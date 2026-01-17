var config = {
  restApiUri: 'http://localhost:3001/api',
  activityFeedUri: 'ws://localhost:3003',
  activityFeedReconnectionDelay: 5 * 1000,
  backgroundResourcesMaxDelay: 10000,

  googleClientId: '',
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
    apiKey: process.env.FCM_API_KEY || '',
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
