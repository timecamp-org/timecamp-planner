const path = require('path');

module.exports = {
  resolver: {
    /* resolver options */
    sourceExts: ['ts', 'tsx', 'js'],
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (target.hasOwnProperty(name)) {
            return target[name];
          }
          return path.join(process.cwd(), `node_modules/${name}`);
        },
      }
    ),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    babelTransformerPath: require.resolve(
      'react-native-typescript-transformer'
    ),
  },
  serializer: {
    /* serializer options */
  },
  server: {
    /* server options */
  },

  /* general options */
  watchFolders: [
    // root of the (rn) project
    path.join(__dirname, '..', 'LocalStorageFactory'),
    path.join(__dirname, '..', 'GoogleApiClientFactory'),
    path.join(__dirname, '..', 'PushNotificationClient'),
    path.join(__dirname, '..', 'SentryClient'),
    path.join(__dirname, '..', 'common'),
    path.join(__dirname, '..', '..', 'packages', 'client'),
    path.join(__dirname, '..', 'CustomerMessagingPlatform'),
  ],
};

const Metro = require('metro-core');

Metro.Logger.on('log', (logEntry) => {
  if (
    logEntry.action_name === 'Transforming file' &&
    logEntry.action_phase === 'end'
  ) {
    console.log(logEntry.file_name, logEntry.duration_ms);
  }
});
