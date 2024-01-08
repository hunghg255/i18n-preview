import type { CompletionItemProvider, ExtensionContext, TextDocument } from 'vscode'
import { CompletionItem, CompletionItemKind, Position, Range, languages } from 'vscode'
import { getLocaleInfoMarkdown } from './markdown'
import { config, localeStore } from './config'
import { flattenDictionary } from './utils'

export function RegisterCompletion(ctx: ExtensionContext) {
  const REGEX_COLLECTION = /t\(['"][\w-]*$/

  const locales = flattenDictionary(localeStore.value)
  const firstLangKey = Object.keys(locales)[0]
  const localeKeys = Object.keys(locales[firstLangKey])

  const collectionProvider: CompletionItemProvider = {
    provideCompletionItems(document: TextDocument, position: Position) {
      const line = document.getText(new Range(new Position(position.line, 0), new Position(position.line, position.character)))
      const match = REGEX_COLLECTION.test(line)
      if (!match)
        return null

      return localeKeys.map(c => new CompletionItem(c, CompletionItemKind.Text))
    },

    async resolveCompletionItem(item: CompletionItem) {
      return {
        ...item,
        documentation: await getLocaleInfoMarkdown(locales, item.label as string),
      }
    },
  }

  ctx.subscriptions.push(
    languages.registerCompletionItemProvider(
      [
        { language: 'typescript', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' },
        { language: 'javascript', scheme: 'file' },
        { language: 'javascriptreact', scheme: 'file' },
        { language: 'html', scheme: 'file' },
        { language: 'vue', scheme: 'file' },
        { language: 'svelte', scheme: 'file' },
      ],
      collectionProvider,
      '"',
      '\'',
      ':',
    ),
  )
}
