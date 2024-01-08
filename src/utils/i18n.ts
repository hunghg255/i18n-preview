import type { Dictionary } from './types'

export function flattenObject(parentObject: object) {
  let object: object = parentObject
  while (Object.values(object).some(value => typeof value === 'object')) {
    object = Object.entries(object).reduce((obj: object, [key, subObject]) => {
      if (typeof subObject === 'object')
        return { ...obj, ...subObject }

      return { ...obj, [key]: subObject }
    }, {})
  }
  return object
}

export function flattenDictionary(dictionary: Dictionary): Dictionary {
  return Object.entries(dictionary).reduce(
    (flattenedDictionary, [locale, subDictionary]) => {
      return {
        ...flattenedDictionary,
        [locale]: flattenObject(subDictionary as object),
      }
    },
    {},
  )
}

export function detectLocalFromFileName(fileName: string) {
  const fileNameFormat = fileName.replace('.json', '').replace(/\\/g, '/').split('/')
  const locale = fileNameFormat[fileNameFormat.length - 2]
  const namespace = fileNameFormat[fileNameFormat.length - 1]

  return {
    locale,
    namespace,
  }
}
