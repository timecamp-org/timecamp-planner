const fs = require('fs');

const path = require('path');
const { defaults: tsjPreset } = require('ts-jest/presets');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('./tsconfig');

const esModules = ['lodash-es'].join('|');

module.exports = {
  preset: 'ts-jest',
  bail: 1,
  verbose: true,
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      babelConfig: 'babel.config.js',
    },
  },
  moduleDirectories: ['app', 'node_modules'],
  modulePaths: [
    path.resolve(__dirname, 'app', 'heySpace'),
    path.resolve(__dirname, 'packages'),
  ]
    .concat(path.resolve(__dirname, 'app', 'common', 'node_modules'))
    .concat(path.resolve(__dirname, 'packages', 'client', 'node_modules'))
    .concat(path.resolve(__dirname, 'app', 'heySpace', 'components'))
    .concat(path.resolve(__dirname, 'app', 'heySpace', 'enhancers'))
    .concat(
      getFullLowerCaseDirectories(
        path.resolve(__dirname, 'app', 'heySpace', 'enhancers')
      )
    )
    .concat(path.resolve(__dirname, 'app'))
    .concat(path.resolve(__dirname, 'app', 'styles'))
    .concat(path.resolve(__dirname, 'app', 'utils'))
    .concat(path.resolve(__dirname, 'app', 'common'))
    .concat(path.resolve(__dirname, 'app', 'common', 'utils'))
    .concat(path.resolve(__dirname, 'app', 'common', 'enhancers'))
    .concat(path.resolve(__dirname, 'app', 'common', 'models'))
    .concat(path.resolve(__dirname, 'app', 'common', 'models', 'domain'))
    .concat(path.resolve(__dirname, 'app', 'common', 'models', 'component'))
    .concat('node_modules')
    .concat(
      getFullLowerCaseDirectoriesRecursive(
        path.resolve(__dirname, 'app', 'heySpace', 'components')
      )
    ),
  setupFiles: [path.resolve(__dirname, 'tests', 'jestSetup.js')],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/mocks/fileMock.js',
    'immutable-prop-types': 'react-immutable-proptypes',
    client: '<rootDir>/tests/mocks/client.js',
    services: '<rootDir>/tests/mocks/services.js',
    stateMock: '<rootDir>/tests/mocks/stateMock.js',
    componentMock: '<rootDir>/tests/mocks/componentMock.js',
    'common/utils/generate-pushid': '<rootDir>/tests/mocks/generateId.js',
    i18next: '<rootDir>/tests/mocks/i18next.js',
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    'react-i18next': '<rootDir>/tests/mocks/react-i18next.js',
    'typed-immutable-record':
      '<rootDir>/app/common/node_modules/typed-immutable-record',
    immutable: '<rootDir>/app/common/node_modules/immutable',
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    ...tsjPreset.transform,
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/packages/',
    /* Disabled component tests because enzyme-redux is not configured properly.
     * For now we should focus on business logic tests in app/common
     */
    '/app/heySpace/',
    '/app/HeySpaceMobile/',
  ],
  transformIgnorePatterns: [
    '/(disposables)/',
    `/node_modules/(?!${esModules})`,
  ],
  snapshotSerializers: ['<rootDir>/node_modules/enzyme-to-json/serializer'],
  roots: [path.resolve(__dirname, 'app')],
};

function getFullLowerCaseDirectoriesRecursive(forPath) {
  var directories = [];
  getRecursively(forPath);

  function getRecursively(levelPath) {
    var levelDirectories = getFullLowerCaseDirectories(levelPath);
    directories = directories.concat(levelDirectories);
    levelDirectories.forEach((directory) => getRecursively(directory));
  }

  return directories;
}

function getFullLowerCaseDirectories(forPath) {
  return getLowerCaseDirectories(forPath).map((relativeDir) =>
    path.resolve(forPath, relativeDir)
  );
}

function getLowerCaseDirectories(forPath) {
  return getDirectories(forPath).filter(wordIsLowercase);
}

function getDirectories(forPath) {
  return fs
    .readdirSync(forPath)
    .filter((file) => fs.lstatSync(path.join(forPath, file)).isDirectory());
}

function wordIsLowercase(word) {
  return /[a-z]/.test(word[0]);
}
