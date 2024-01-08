import type { DecorationOptions, ExtensionContext, TextEditor } from 'vscode'
import { DecorationRangeBehavior, Range, Uri, window, workspace } from 'vscode'
import { isTruthy } from './utils'

import { config, flatLocale, onConfigUpdated } from './config'
import { getLocaleInfoMarkdown } from './markdown'
import { getSVG } from './utils/svg'

export interface DecorationMatch extends DecorationOptions {
  key: string
}

export function RegisterAnnotations(ctx: ExtensionContext) {
  const InlineIconDecoration = window.createTextEditorDecorationType({
    textDecoration: 'none; opacity: 0.6 !important;',
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  })
  const HideTextDecoration = window.createTextEditorDecorationType({
    textDecoration: 'none; display: none;', // a hack to inject custom style
  })

  let decorations: DecorationMatch[] = []
  let editor: TextEditor | undefined

  const svgURI = getSVG()

  async function updateDecorations() {
    if (!editor)
      return

    if (!config.annotations) {
      editor.setDecorations(InlineIconDecoration, [])
      return
    }

    const { locales, localeKeys } = flatLocale()

    const REGEX_FULL = new RegExp(`[^\\w\\d](?:(${localeKeys.join('|')}))['"]`, 'g')

    const text = editor.document.getText()
    let match
    const regex = REGEX_FULL
    regex.lastIndex = 0
    const keys: [Range, string][] = []

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(text))) {
      const key = match[1]
      if (!key)
        continue

      const startPos = editor.document.positionAt(match.index + 1)
      const endPos = editor.document.positionAt(match.index + match[0].length)
      keys.push([new Range(startPos, endPos), key])
    }

    decorations = (await Promise.all(keys.map(async ([range, key]) => {
      const position = 'before'

      const item: DecorationMatch = {
        range,
        renderOptions: {
          [position]: {
            contentIconPath: Uri.parse(svgURI),
            margin: `-${12}px 2px; transform: translate(-2px, 3px);`,
            width: `${12 * 1 * 1.1}px`,
          },
        },
        hoverMessage: await getLocaleInfoMarkdown(locales, key as string),
        key,
      }
      return item
    }))).filter(isTruthy)

    refreshDecorations()
  }

  function refreshDecorations() {
    if (!editor)
      return

    if (!config.annotations) {
      editor.setDecorations(InlineIconDecoration, [])
      editor.setDecorations(HideTextDecoration, [])
      return
    }

    editor.setDecorations(InlineIconDecoration, decorations)
    editor.setDecorations(HideTextDecoration, [])
  }

  function updateEditor(_editor?: TextEditor) {
    if (!_editor || editor === _editor)
      return
    editor = _editor
    decorations = []
  }

  let timeout: NodeJS.Timer | undefined
  function triggerUpdateDecorations(_editor?: TextEditor) {
    updateEditor(_editor)

    if (timeout) {
      clearTimeout(timeout as any)
      timeout = undefined
    }
    timeout = setTimeout(() => {
      updateDecorations()
    }, 200)
  }

  window.onDidChangeActiveTextEditor((e) => {
    triggerUpdateDecorations(e)
  }, null, ctx.subscriptions)

  workspace.onDidChangeTextDocument((event) => {
    if (window.activeTextEditor && event.document === window.activeTextEditor.document)
      triggerUpdateDecorations(window.activeTextEditor)
  }, null, ctx.subscriptions)

  workspace.onDidChangeConfiguration(async () => {
    await onConfigUpdated()
    triggerUpdateDecorations()
  }, null, ctx.subscriptions)

  window.onDidChangeVisibleTextEditors((editors) => {
    triggerUpdateDecorations(editors[0])
  }, null, ctx.subscriptions)

  window.onDidChangeTextEditorSelection((e) => {
    updateEditor(e.textEditor)
    refreshDecorations()
  })

  if (config.watchFile) {
    // vscode listen file change
    workspace.onDidSaveTextDocument(async (document) => {
      if ((document.fileName.includes('locales') || document.fileName.includes('locale')) && document.fileName.endsWith('.json')) {
        await onConfigUpdated()
        window.showInformationMessage('i18n annotation updated')

        triggerUpdateDecorations()
      }
    }, null, ctx.subscriptions)
  }

  // on start up
  updateEditor(window.activeTextEditor)
  triggerUpdateDecorations()
}
