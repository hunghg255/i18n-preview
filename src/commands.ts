import type { DecorationOptions, ExtensionContext } from 'vscode'
import { commands } from 'vscode'
import { config } from './config'
import { clearCache } from './loader'

export interface DecorationMatch extends DecorationOptions {
  key: string
}

export function RegisterCommands(ctx: ExtensionContext) {
  ctx.subscriptions.push(
    commands.registerCommand('i18n-preview.toggle-annotations', () => {
      config.annotations = !config.annotations
    }),
  )

  ctx.subscriptions.push(
    commands.registerCommand('i18n-preview.clear-cache', () => {
      clearCache(ctx)
    }),
  )
}
