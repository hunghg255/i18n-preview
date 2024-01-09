/* eslint-disable prefer-regex-literals */
import { MarkdownString } from 'vscode'

function internationalize(arrKeys: Record<string, string>, localeKey: string) {
  return arrKeys[localeKey] ?? ''
}

const reg = new RegExp(/[{{]\w+[}}]/g)

function getParams(str: string) {
  if (!str)
    return ''

  const match = str.match(reg)
  if (!match?.length)
    return ''

  const matchSet = [...new Set(match)]

  const params = matchSet.map((item) => {
    const key = item.replace(/[{{}}]/g, '')
    return `*@param* \`${key}\` - \`{string | number | boolean}\`\n`
  })

  return `\n#### Options:\n${params.join('\n')}`
}

export async function getLocaleInfoMarkdown(dictionary: any, localeKey: string) {
  const localeList = Object.keys(dictionary)

  const internationalizedStringList = localeList.map((locale) => {
    return `|${locale}|${internationalize(
      dictionary[locale],
      localeKey,
    )}|`
  })

  const options = getParams(internationalizedStringList.join(' '))

  return new MarkdownString(
    `${['|Locales|Translate|', '|:----|----:|', ...internationalizedStringList].join(
      '\n',
    )}${options}`,
  )
}
