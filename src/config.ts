import { isAbsolute, resolve } from 'node:path'
import { ColorThemeKind, window, workspace } from 'vscode'
import fs from 'fs-extra'
import { computed, reactive, ref } from '@vue/reactivity'
import { EXT_NAMESPACE } from './meta'
import { flattenDictionary } from './utils'

const _configState = ref(0)

export const localeStore = ref({} as Record<string, any>)

function getConfig<T = any>(key: string): T | undefined {
  return workspace
    .getConfiguration()
    .get<T>(key)
}

async function setConfig(key: string, value: any, isGlobal = true) {
  // update value
  return await workspace
    .getConfiguration()
    .update(key, value, isGlobal)
}

function createConfigRef<T>(key: string, defaultValue: T, isGlobal = true) {
  return computed({
    get: () => {
      // to force computed update
      // eslint-disable-next-line no-unused-expressions
      _configState.value
      return getConfig<T>(key) ?? defaultValue
    },
    set: (v) => {
      setConfig(key, v, isGlobal)
    },
  })
}

export const config = reactive({
  annotations: createConfigRef(`${EXT_NAMESPACE}.annotations`, true),
  languageIds: createConfigRef(`${EXT_NAMESPACE}.languageIds`, []),
  localeDirectoryPath: createConfigRef(`${EXT_NAMESPACE}.localeDirectoryPath`, null),
  translatorFunctionName: createConfigRef(`${EXT_NAMESPACE}.translatorFunctionName`, 't'),
  watchFile: createConfigRef(`${EXT_NAMESPACE}.watchFile`, false),
})

export async function LoadLocalesDirectory() {
  if (!config.localeDirectoryPath)
    return
  const localeDirectoryPath = config.localeDirectoryPath as any

  const dictionary = Object.keys(localeDirectoryPath)

  const workspaceLocale = Object.keys(localeDirectoryPath[dictionary[0]])

  const r = {} as any

  for (const locale of dictionary) {
    if (!r[locale])
      r[locale] = {}

    for (const namespaceLocale of workspaceLocale) {
      if (!r[locale][namespaceLocale])
        r[locale][namespaceLocale] = {}

      const localePath = localeDirectoryPath[locale][namespaceLocale]
      let filePath = ''
      if (isAbsolute(localePath)) {
        filePath = localePath
      }
      else {
        const list: string[] = []
        if (workspace?.workspaceFolders) {
          for (const folder of workspace.workspaceFolders)
            list.push(resolve(folder.uri.fsPath, localePath))
        }
        filePath = list[0]
      }

      if (fs.existsSync(filePath)) {
        const data = await fs.readJSON(filePath)
        const keys = Object.keys(data)
        const newData = {} as any
        for (const key of keys) {
          newData[key] = data[key]
          newData[`${namespaceLocale}:${key}`] = data[key]
        }
        r[locale][namespaceLocale] = newData
      }
    }
  }

  localeStore.value = r
}

export async function onConfigUpdated() {
  _configState.value = +new Date()
  await LoadLocalesDirectory()
}

export const color = computed(() => {
  return isDarkTheme()
    ? 'eee'
    : '222'
})

// First try the activeColorThemeKind (if available) otherwise apply regex on the color theme's name
function isDarkTheme() {
  const themeKind = window?.activeColorTheme?.kind
  if (themeKind && themeKind === ColorThemeKind?.Dark)
    return true

  const theme = createConfigRef('workbench.colorTheme', '', true)

  // must be dark
  if (theme.value.match(/dark|black/i) != null)
    return true

  // must be light
  if (theme.value.match(/light/i) != null)
    return false

  // IDK, maybe dark
  return true
}

export function flatLocale() {
  const locales = flattenDictionary(localeStore.value)
  const firstLangKey = Object.keys(locales)[0]
  const localeKeys = Object.keys(locales[firstLangKey])

  return {
    locales,
    localeKeys,
  }
}
