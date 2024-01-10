<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=hunghg255.i18n-preview">
<img src="https://github.com/hunghg255/i18n-preview/blob/main/res/logo.png?raw=true" alt="logo" width='200'/>
</a>
</p>

<p align="center">
  A vscode extension preview locales
</p>

<p align="center">
  <a href="https://github.com/hunghg255/i18n-preview/graphs/contributors" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/all_contributors-1-orange.svg" alt="Contributors" /></a>
  <a href="https://github.com/hunghg255/i18n-preview/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/hunghg255/agile-css-suggestion" alt="License" /></a>
</p>


## Preview

<p align='center'>
  <img src="https://github.com/hunghg255/i18n-preview/blob/main/screenshots/preview-1.png?raw=true" alt='preview'>
</p>


## Features

- Inline display corresponding locale
- Hover

## Config `.vscode/settings.json`

```json
// reload
 "i18n-preview.watchFile": true,

  "i18n-preview.annotations": true,
 "i18n-preview.localeDirectoryPath": {
    "en": {
      "common": "./public/locales/en/common.json"
    },
    "vi": {
      "common": "./public/locales/vi/common.json"
    }
  }
```
