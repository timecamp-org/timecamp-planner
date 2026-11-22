var config = {
  restApiUri: 'http://localhost:3001/api',
  activityFeedUri: 'ws://localhost:3003',
  activityFeedReconnectionDelay: 5 * 1000,
  backgroundResourcesMaxDelay: 10000,

  googleClientId: '',
  // Base URL of an image resize service (thumbnails at <url>95x95_b/<file>).
  // Leave empty to show the original images.
  amazonResizeUrl: '',
  sentryDSN: '',

  isTrackingEnabled: false,
  externalResources: {
    calendly: false,
    googleFonts: false,
    googleApis: false,
    jitsi: false,
  },
  isRemoteDevtoolsEnabled: false,
  userComApiKey: '',
  landingPageUrl: 'http://localhost:3000',
  webAppUrl: 'localhost:3002',
  pushNotifications: {
    baseUrl: 'http://localhost:8080',
    topicPrefix: 'heyspace-',
  },
  fcm: {
    senderID: '',
    androidChannelId: 'heyspace',
    androidChannelName: 'Heyspace',
    vapidKey: '',
    // The browser loads this file directly as /config.js, so it cannot read process.env.
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
  },
  customerMessagingPlatformApiKey: '',
};

window.__tc3_config = config;

if (typeof module !== 'undefined') {
  module.exports = config;
}
