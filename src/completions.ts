import type { CompletionItemProvider, ExtensionContext, TextDocument } from 'vscode'
import { CompletionItem, CompletionItemKind, Position, Range, languages, window, workspace } from 'vscode'
import { config, flatLocale, onConfigUpdatedOnlyFileChange } from './config'
import { getLocaleInfoMarkdown } from './markdown'

export function RegisterCompletion(ctx: ExtensionContext) {
  const REGEX_COLLECTION = /t\(['"][\w-]*$/
  let provider: any

  const start = () => {
    const { locales, localeKeys } = flatLocale()

    const collectionProvider: CompletionItemProvider = {
      provideCompletionItems(document: TextDocument, position: Position) {
        const line = document.getText(new Range(new Position(position.line, 0), new Position(position.line, position.character)))
        const match = REGEX_COLLECTION.test(line)
        if (!match)
          return null

        return localeKeys.map((c: any) => new CompletionItem(c, CompletionItemKind.Text))
      },

      async resolveCompletionItem(item: CompletionItem) {
        return {
          ...item,
          documentation: await getLocaleInfoMarkdown(locales, item.label as string),
        }
      },
    }

    provider = languages.registerCompletionItemProvider(
      config.languageIds,
      collectionProvider,
      ...['"', '\'', ':'],
    )

    ctx.subscriptions.push(provider)
  }

  let timeout: NodeJS.Timer | undefined
  function triggerUpdateProvider(fileName: string, type: string) {
    if (timeout) {
      clearTimeout(timeout as any)
      timeout = undefined
    }
    timeout = setTimeout(async () => {
      if (provider)
        provider.dispose()

      await onConfigUpdatedOnlyFileChange(fileName, type)

      window.showInformationMessage('i18n completion provider updated')

      provider = null
      start()
    }, 200)
  }

  if (config.watchFile) {
    // vscode listen file change
    workspace.onDidSaveTextDocument(async (document: TextDocument) => {
      if ((document.fileName.toLowerCase().includes('locales') || document.fileName.toLowerCase().includes('locale')) && document.fileName.endsWith('.json'))
        triggerUpdateProvider(document.fileName, 'Completion')
    })
  }

  // on start up
  start()
}
