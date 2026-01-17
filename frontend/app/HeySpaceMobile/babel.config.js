module.exports = (api) => {
  api.cache(true)

  const isDev = process.env.NODE_ENV === 'development'

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['@babel/plugin-transform-flow-strip-types'],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      !isDev ? ['transform-remove-console'] : null,
      [
        'module-resolver',
        {
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.json',
            '.ts',
            '.tsx',
          ],
          alias: {
            models: "../common/models",
            common: "../common",
            'styles/colors': '../common/commonStyles/colors',
            'styles/common': './styles/common',
            BaseComponent: '../common/enhancers/BaseComponent',
            PureBaseComponent: '../common/enhancers/PureBaseComponent',
            'react-redux': './node_modules/react-redux/dist/react-redux.min.js',
            'react-dom': '../common/node_modules/react-dom',
            react: './node_modules/react',
            commonComponents: "./components/common/",
            Icons: "./components/Icons/",
            components: "./components/",
            enhancers: "./enhancers/",
            utils: "./utils/",
          },
        },
      ],
      "@babel/plugin-transform-runtime"
    ].filter(Boolean),
  }
}
