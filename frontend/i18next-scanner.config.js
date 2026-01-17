/* eslint no-console: 0 */
/* eslint strict: 0 */
const fs = require('fs')
const chalk = require('chalk')

const languages = [
  'en', // English (default)
  'pl', //
  'es',
  'de',
  'pt',
  'it',
  'hu',
  'tr',
  'ar_EG',
  'fr',
  'ja',
  'ru',
]

module.exports = {
  input: [
    'app/**/*.{html,js,jsx}',
    'dist/app/**/*.{html,js,jsx}',
    '!app/common/i18n/**',
    '!app/HeySpaceMobile/android/**',
    '!**/node_modules/**',
  ],
  output: './',
  options: {
    debug: false,
    sort: false,
    removeUnusedKeys: true,
    lngs: languages,
    func: {
      list: ['t', 'i18n.t, i18next.t', 'i18mark'], // Use an empty array to bypass the default list: i18n.t, i18next.t
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      fallbackKey: function (ns, value) {
        return value
      },
    },
    defaultValue: (lng, ns, key) => {
      if (lng === 'en') {
        return key // Use key as value for base language
      }
      return '' // Return empty string for other languages
    },
    ns: [
      'resource', // default
    ],
    defaultNs: 'resource',
    defaultLng: 'en',
    resource: {
      loadPath: 'app/common/i18n/resources/{{lng}}/{{ns}}.json',
      savePath: 'app/common/i18n/resources/{{lng}}/{{ns}}.json', // or 'app/i18n/${lng}/${ns}.saveAll.json'
      jsonIndent: 4,
    },
    nsSeparator: false, // namespace separator
    keySeparator: '|',
    plural: true, // No plural form keys
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
    contextFallback: false,
  },
  transform: customTransform,
}

function customTransform(file, enc, done) {
  'use strict'

  const { parser } = this
  const content = fs.readFileSync(file.path, enc)
  let count = 0

  parser.parseFuncFromString(content, { list: ['i18n._', 'i18n.__', 'i18n.t', 't', 'i18mark'] }, (key, options) => {
    parser.set(key, Object.assign({}, options, {
      nsSeparator: false,
      keySeparator: '|',
    }))
    ++count
  })

  if (count > 0) {
    console.log(`i18next-scanner: count=${chalk.cyan(count)}, file=${chalk.yellow(JSON.stringify(file.relative))}`)
  }

  done()
}
