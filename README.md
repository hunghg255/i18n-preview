<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=hunghg255.i18n-preview">
<img src="https://github.com/hunghg255/i18n-preview/blob/main/res/logo.png?raw=true" alt="logo" width='200'/>
</a>
</p>

<p align="center">
  A vscode extension preview locales
</p>

<p align="center">
    <a href="https://github.com/hunghg255/i18n-preview/stargazers"><img src="https://img.shields.io/github/stars/hunghg255/i18n-preview?colorA=363a4f&colorB=f9c35a&style=for-the-badge"></a>
    <a href="https://marketplace.visualstudio.com/items?itemName=hunghg255.i18n-preview"><img src="https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/hunghg255.i18n-preview?colorA=363a4f&colorB=5BDfff&style=for-the-badge"></a>
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
