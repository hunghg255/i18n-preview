import { type ExtensionContext, workspace } from 'vscode'
import { version } from '../package.json'
import { Log } from './utils'
import { LoadLocalesDirectory, localeStore } from './config'
import { RegisterCompletion } from './completions'
import { RegisterAnnotations } from './annotation'
import { RegisterCommands } from './commands'

export async function activate(ctx: ExtensionContext) {
  Log.info(`🈶 Activated, v${version}`)

  if (!workspace.workspaceFolders)
    return

  await LoadLocalesDirectory()

  if (!Object.keys(localeStore.value).length)
    return

  await RegisterCommands(ctx)
  await RegisterCompletion(ctx)
  await RegisterAnnotations(ctx)
}

export function deactivate() {
  Log.info('🈚 Deactivated')
}
