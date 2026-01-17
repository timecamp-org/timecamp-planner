import BrowserGoogleApiClient from './BrowserGoogleApiClient'
import { GoogleApiClientConfig } from './types';

function getGoogleApiClient(config: GoogleApiClientConfig) {
  if (process.env.STORYBOOK_DEVICE !== 'browser') {
    const MobileGoogleApiClient = require('./MobileGoogleApiClient').default
    return new MobileGoogleApiClient(config)
  } else {
    return new BrowserGoogleApiClient(config)
  }
}

export default getGoogleApiClient
