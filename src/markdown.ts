/* eslint-disable prefer-regex-literals */
import { MarkdownString } from 'vscode'

function internationalize(arrKeys: Record<string, string>, localeKey: string) {
  // if (localeKey.includes(':')) {
  //   const [workspace, key] = localeKey.split(':')
  //   return arrKeys[key] ?? ''
  // }

  return arrKeys[localeKey] ?? ''
}

const reg = new RegExp(/[{{]\w+[}}]/g)

function getParams(str: string) {
  if (!str)
    ''

  const match = str.match(reg)
  if (!match?.length)
    return ''

  const params = match.map((item) => {
    const key = item.replace(/[{{}}]/g, '')
    return `@param \`${key}\` - {string|number|boolean}`
  })

  return `\n## Options:\n${params.join('\n')}`
}

export async function getLocaleInfoMarkdown(dictionary: any, localeKey: string) {
  const localeList = Object.keys(dictionary)

  const internationalizedStringList = localeList.map((locale) => {
    return `|${locale}|${internationalize(
      dictionary[locale],
      localeKey,
    )}|`
  })

  const options = getParams(internationalizedStringList?.[0])

  return new MarkdownString(
    `${['|Locales|Translate|', '|:----|----:|', ...internationalizedStringList].join(
      '\n',
    )}${options}`,
  )
}
