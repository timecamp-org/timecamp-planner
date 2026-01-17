import 'react-native-gesture-handler'
import 'intl'
import 'intl/locale-data/jsonp/en'

if (!global._babelPolyfill) { require('babel-polyfill') }

import { AppRegistry } from 'react-native'
import React from 'react'
import App from './components/App'
import { name as appName } from './app.json'
import { PushNotificationsClient } from 'common/services'
import isDev from '../common/utils/isDevEnv'

if (isDev() && process.env.DEBUG_PERF === 'true') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    exclude: [
      // React Router
      /^Route/,
    ],
    include: [/(.*?)/],
    groupByComponent: true,
    collapseGroups: true,
    titleColor: 'yellow',
    diffNameColor: 'yellow',
    diffPathColor: 'organge',
  })
}

if (isDev()) {
  const modules = require.getModules()
  const moduleIds = Object.keys(modules)
  const loadedModuleNames = moduleIds
    .filter(moduleId => modules[moduleId].isInitialized)
    .map(moduleId => modules[moduleId].verboseName)
  const waitingModuleNames = moduleIds
    .filter(moduleId => !modules[moduleId].isInitialized)
    .map(moduleId => modules[moduleId].verboseName)

  // make sure that the modules you expect to be waiting are actually waiting
  console.log(
    'loaded:',
    loadedModuleNames.length,
    'waiting:',
    waitingModuleNames.length,
  )

  // grab this text blob, and put it in a file named packager/modulePaths.js
  // console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`)
}

AppRegistry.registerComponent(appName, () => App)
AppRegistry.registerHeadlessTask('PushNotificationBackgroundMessage', PushNotificationsClient.subscribeBackgroundNotificationClick)
