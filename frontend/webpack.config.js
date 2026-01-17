const cwd = process.cwd();

const CopyWebpackPlugin = require('copy-webpack-plugin');
const esbuild = require('esbuild');
const { EsbuildPlugin } = require('esbuild-loader');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const gitRevisionPluginInstance = new GitRevisionPlugin({ branch: true });

const packageVersion = require('./package.json').version;

const appVersion =
  `${packageVersion}.${gitRevisionPluginInstance.branch()}.${gitRevisionPluginInstance.commithash()}`.replace('/', '_');
console.log('COMPILING APP version: ', appVersion);

var webpackConfig =
  //: Configuration
  {
    context: cwd,
    stats: {
      children: true,
    },

    mode: isDevEnv() ? 'development' : 'production',
    entry: [
      isDevEnv() ? 'react-hot-loader/patch' : null,
      isDevEnv() ? 'webpack-hot-middleware/client?reload=false' : null,
      path.join(cwd, 'app', 'heySpace', 'index.js'),
    ].filter(Boolean),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProdEnv()
        ? '[name].[git-revision-branch].[git-revision-hash].[chunkhash:8].js'
        : '[name].[hash:8].js',
      sourceMapFilename: isProdEnv()
        ? '[name].[git-revision-branch].[git-revision-hash].[chunkhash:8].js.map'
        : '[name].[contenthash].js.map',
      chunkFilename: isProdEnv()
        ? '[name].[git-revision-branch].[git-revision-hash].[chunkhash:8].chunk.js'
        : '[id].[chunkhash].chunk.js',
      publicPath: '/',
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: 'react',
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          RUN_STATS_SERVER: JSON.stringify(process.env.RUN_STATS_SERVER),
          DEBUG_PERF: JSON.stringify(process.env.DEBUG_PERF),
          STORYBOOK_DEVICE: JSON.stringify(process.env.STORYBOOK_DEVICE),
          GIPHY_API_KEY: JSON.stringify(process.env.GIPHY_API_KEY || ''),
          DROPBOX_API_KEY: JSON.stringify(process.env.DROPBOX_API_KEY || ''),
          VERSION: JSON.stringify(packageVersion),
        },
        APP_VERSION: JSON.stringify(appVersion),
      }),
      // we use custom template function to inject loader script and styles to index.html
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'app', 'heySpace', 'template.js'),
      }),

      new FaviconsWebpackPlugin({
        logo: path.resolve(__dirname, 'app', 'heySpace', 'favicons', 'default.png'),
        favicons: {
          icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            yandex: false,
            windows: false,
          },
        },
      }),
      new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
      new webpack.ProvidePlugin({
        i18n: 'i18n',
      }),
      gitRevisionPluginInstance,
      isProdEnv()
        ? new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
          })
        : null,
      isDevEnv() ? new webpack.HotModuleReplacementPlugin() : null, // Tell webpack we want hot reloading
      isRunStatsServer() ? new BundleAnalyzerPlugin() : null,
      new webpack.IgnorePlugin({ resourceRegExp: /react-native-restart/ }),
      new MomentLocalesPlugin({
        localesToKeep: ['pl'],
      }),
    ].filter(Boolean),
    module: {
      exprContextCritical: false, // TODO: fixwith https://github.com/AngularClass/angular-starter/issues/993
      rules: [
        {
          test: /manifest\.json$/,
          use: { loader: 'file-loader' },
          type: 'javascript/auto',
        },
        {
          test: /\.[jt]sx?$/,
          use: {
            loader: 'esbuild-loader',
            options: {
              jsx: 'automatic',
              target: 'es2017',
              implementation: esbuild,
            },
          },
          exclude: [/node_modules/],
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          include: /(app|packages|.storybook)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: isProdEnv(),
                compact: isProdEnv(),
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'style-loader',
              options: {
                injectType: 'singletonStyleTag',
              },
            },
            { loader: 'css-loader', options: { importLoaders: 1, modules: true, sourceMap: isDevEnv() } },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      'postcss-import',
                      {
                        root: path.resolve(__dirname),
                        path: path.resolve(__dirname, 'app', 'heySpace', 'styles'),
                      },
                    ],

                    'postcss-mixins',
                    ['autoprefixer', { flexbox: false }],
                    'postcss-simple-vars',
                    'postcss-advanced-variables',
                    'postcss-nested',
                    'postcss-icss-values',
                    'postcss-nesting',
                    'postcss-calc',
                    'postcss-color-function',
                    'postcss-reporter',
                    'postcss-discard-comments',
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            { loader: 'style-loader' }, // creates style nodes from JS strings
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          type: 'javascript/auto',
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        },
        {
          test: /\.mp3$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        },
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: {
            loader: 'svg-react-loader',
            options: {
              classIdPrefix: '[name]-[hash:8]__',
              xmlnsTest: /^xmlns.*$/,
              name: '[path][name].[ext]',
            },
          },
        },
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
          include: /node_modules/,
        },
      ],
    },
    resolve: {
      modules: [path.resolve(__dirname, 'app', 'common', 'node_modules'), 'node_modules'],
      alias: {
        client: path.resolve(__dirname, 'packages/client'),
        i18n: path.resolve(__dirname, 'app/common/i18n'),
        commonComponents: path.resolve(__dirname, 'app/heySpace/components/common/'),
        components: path.resolve(__dirname, 'app/heySpace/components/'),
        hooks: path.resolve(__dirname, 'app/heySpace/hooks/'),
        enhancers: path.resolve(__dirname, 'app/heySpace/enhancers/'),
        commonEnhancers: path.resolve(__dirname, 'app/common/enhancers/'),
        models: path.resolve(__dirname, 'app/common/models/'),
        common: path.resolve(__dirname, 'app/common/'),
        styles: path.resolve(__dirname, 'app/heySpace/styles/'),
        commonStyles: path.resolve(__dirname, 'app/common/commonStyles/'),
        commonAssets: path.resolve(__dirname, 'app/common/commonAssets/'),
        utils: path.resolve(__dirname, 'app/heySpace/utils/'),
        favicons: path.resolve(__dirname, 'app/heySpace/favicons/'),
      },
      extensions: ['.js', '.ts', '.tsx', '.json', '.html', '.jsx'],
      mainFields: ['browser', 'jsnext:main', 'main'],
      fallback: {
        module: 'empty',
        fs: 'empty',
        net: 'empty',
        dns: 'mock',
        tls: 'empty',
        __dirname: __dirname,
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 4,
        automaticNameDelimiter: '~',
        name: false,
        cacheGroups: {
          client: {
            test: /client/,
            priority: 0,
            reuseExistingChunk: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            chunks: 'all',
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        isProdEnv()
          ? new EsbuildPlugin({
              target: 'es2015', // Syntax to compile to (see options below for possible values)
            })
          : null,
        isProdEnv()
          ? new OptimizeCssAssetsPlugin({
              assetNameRegExp: /\.optimize\.css$/g,
              cssProcessor: require('cssnano'),
              cssProcessorOptions: { discardComments: { removeAll: true } },
              canPrint: true,
            })
          : null,
      ].filter(Boolean),
    },
    target: 'web', // Make web variables accessible to webpack, e.g. window
    devtool: isDevEnv() ? 'cheap-module-source-map' : 'source-map',
    devServer: {
      hot: isDevEnv() ? 'only' : '',
    },
  };

module.exports = webpackConfig;

/* *** env helpers *** */

function isDevEnv() {
  return process.env.NODE_ENV === 'development';
}

function isProdEnv() {
  return process.env.NODE_ENV === 'production';
}

function isRunStatsServer() {
  return process.env.RUN_STATS_SERVER === 'yes';
}
