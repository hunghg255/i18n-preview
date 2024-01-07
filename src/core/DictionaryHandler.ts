import type { Dictionary } from '../utils'
import { flattenDictionary } from '../utils'

class DictionaryHandler {
  localePath: string
  dictionary: Dictionary
  flattenedDictionary: Dictionary
  constructor({
    localePath,
    dictionary,
  }: {
    localePath: string
    dictionary: Dictionary
  }) {
    this.localePath = localePath
    this.dictionary = dictionary
    this.flattenedDictionary = flattenDictionary(dictionary)
  }

  internationalize(locale: string, key: string): string {
    const translatedValue: string = (() => {
      // If no delimiter exists, use this.flattenedDictionary to quickly get the translated value.
      if (!key.includes(':')) {
        const localeFlattenedDictionary = this.flattenedDictionary[
          locale
        ] as Dictionary
        return localeFlattenedDictionary?.[key] as string
      }

      // If delimiter exists, travel this.dictionary to get the translated value.
      return key.split(':').reduce((value, subKey) => {
        if (typeof value === 'string')
          return value

        return value?.[subKey]
      }, this.dictionary[locale]) as string
    })()

    return translatedValue?.replace(/\n/g, '\\n') || '-'
  }
}

export default DictionaryHandler
