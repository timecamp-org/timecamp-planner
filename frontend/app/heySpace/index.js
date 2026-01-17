/**
 * This is the entry file for the application
 */
import 'sanitize.css/sanitize.css'

import '!file-loader?name=[name].[ext]!./manifest.json'
import rootRender from './rootRender'
import isHttpsProtocol from 'common/utils/isHttpsProtocol'

rootRender()

if (process.env.NODE_ENV === 'production') {
  // First, install error reporting
  // Last, Install 3rd party push notifications service worker
  if (navigator.serviceWorker && isHttpsProtocol()) {
    // ok
  } else {
    console.warn('Service Workers are not supported in this browser. Push notifications will not work.')
  }

  // set release version for easy access
  window.__tc3_releaseVersion = APP_VERSION
}
