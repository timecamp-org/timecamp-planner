module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
      }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      1,
      'single'
    ],
    'semi': [
      'off'
    ],
    'no-unused-expressions': [
      'warn',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      }
    ],
    'no-unused-vars': [
      'off'
      // TODO: fix interfaces imported unused
      // 'error',
      // { "vars": "local" }
    ],
    'no-use-before-define': [
      'warn',
      { 'functions': false, 'classes': false }
    ],
    'max-len': [
      'warn', { 'code': 120, 'tabWidth': 2 }
    ],
  }
}