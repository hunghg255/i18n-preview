/* eslint-disable prefer-regex-literals */
import { MarkdownString } from 'vscode'

function extractLocaleValue(arrKeys: Record<string, string>, localeKey: string) {
  return {
    value: arrKeys[localeKey] ? arrKeys[localeKey].split('_ns_')[0] : '',
    namespace: arrKeys[localeKey] ? arrKeys[localeKey].split('_ns_')[1] : '',
  }
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
    const { value, namespace } = extractLocaleValue(
      dictionary[locale],
      localeKey,
    )

    return `|${locale}|${value}|\`${namespace}.json\`|`
  })

  const options = getParams(internationalizedStringList.join(' '))

  return new MarkdownString(
    `${['|Locales|Translate|NS|', '|:----:|:----:|:----:|', ...internationalizedStringList].join(
      '\n',
    )}${options}`,
  )
}
