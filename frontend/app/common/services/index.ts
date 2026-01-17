import * as hsClient from 'client';
import { HeySpaceClientInterface } from 'client/src/HeySpaceClient';
import EventEmitter from 'eventemitter3';
import getGoogleApiClient from '../../GoogleApiClientFactory';
import getLocalStorage from '../../LocalStorageFactory';
import getPushNotificationClient from '../../PushNotificationClient';
import { AppEventType } from '../types';
import FileUploadService from '../utils/FileUpload';
import getBrowserVersion, { GetBrowserVersionInterface } from '../utils/getBrowserVersion';
import getPlatform from '../utils/getPlatform';
import isMobileApp from '../utils/isMobileApp';

import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import random from 'lodash/random';
import { GoogleApiClientInterface } from '../../GoogleApiClientFactory/GoogleApiClientInterface';
import { AppConfigInterface } from '../types';

import { UserTrackerOptionsInterface } from 'client/src/UserTracker';
import { UserTrackerInterface } from 'client/src/UserTracker/interfaces/UserTrackerInterface';
import { LivechatClient } from '../../CustomerMessagingPlatform/LivechatClient';
import { PushNotificationClientInterface } from '../../PushNotificationClient/PushNotificationClientInterface';
import { getConfig } from '../services/config';
import sentryClient from './sentryClient';
import { UserContextSingleton } from './userContext';

const config: AppConfigInterface = getConfig();

const httpClient = new hsClient.HttpAgent({
  baseUrl: config.restApiUri,
});

const localStorageService = getLocalStorage();

const trackerQueue = new hsClient.LocalStorageQueue(localStorageService);

const TrackerSingleton = (function () {
  let instance;
  return {
    getInstance: function (): UserTrackerInterface {
      if (!instance) {
        let browser;
        let parsedBrowser = '';
        if (!isMobileApp()) {
          browser = getBrowserVersion();
        }
        if (isPlainObject(browser)) {
          browser = browser as GetBrowserVersionInterface;
          parsedBrowser = `${browser.name} ${browser.version}`;
        } else {
          parsedBrowser = browser as string;
        }
        const options: UserTrackerOptionsInterface = {
          isUserTrackerEnabled: config.isTrackingEnabled,
          browser: parsedBrowser,
          platform: getPlatform(),
        };

        const trackingClients = [];
        instance = new hsClient.UserTracker(httpClient, trackerQueue, options, trackingClients);
      }
      return instance;
    },
  };
})();

const HeySpaceClientSingleton = (function () {
  let client;

  return {
    getInstance: function (): HeySpaceClientInterface {
      if (!client) {
        client = new hsClient.HeySpaceClient(
          {
            restApi: {
              endpoint: config.restApiUri,
            },
          },
          UserContextSingleton.getInstance(),
        );
      }
      return client;
    },
  };
})();

const googleApiClient: GoogleApiClientInterface = getGoogleApiClient({
  googleClientId: config.googleClientId,
  googleDeveloperKey: config.googleDeveloperKey,
});
googleApiClient.init();

const fileUpload = FileUploadService(HeySpaceClientSingleton.getInstance());

const activityFeed = new hsClient.ActivityFeed({
  url: config.activityFeedUri,
  reconnectionDelay: config.activityFeedReconnectionDelay,
  deviceType: getPlatform(),
});

const pushNotificationsClient: PushNotificationClientInterface = getPushNotificationClient(config.pushNotifications);
pushNotificationsClient.init();

const appEventEmitter = new EventEmitter();

/* This handler fires after RELOAD_APP_DELAY
 *  because server needs to warm up before we will make any requests
 */
const reconnectHandler = {
  onReconnect: () => appEventEmitter.emit(AppEventType.APP_RECONNECTED),
  refreshTimeout: random(5, 30) * 1000,
};


const CustomerMessagingPlatformSingleton = (function () {
  let instance;

  return {
    getInstance: function (): LivechatClient {
      if (!instance) {
        instance = new LivechatClient(config.customerMessagingPlatformApiKey, config.isTrackingEnabled);
      }

      return instance;
    },
  };
})();


const NavigationServiceSingleton = (function () {
  let instance;
  if (process.env.STORYBOOK_DEVICE !== 'browser') {
    const { NavigationService: NavService } = require('../HeySpaceMobile/components/AppNavigation/NavigationService');
    return {
      getInstance: function () {
        if (!instance) {
          instance = new NavService();
        }

        return instance;
      },
    };
  } else {
    return {
      getInstance: function () {
        return null;
      },
    };
  }
})();

export const HeySpaceClient = HeySpaceClientSingleton.getInstance();
export const UserTracker = TrackerSingleton.getInstance();
export const GoogleApiClient = googleApiClient;
export const FileUpload = fileUpload;
export const ActivityFeed = activityFeed;
export const PushNotificationsClient = pushNotificationsClient;
export const localStorage = localStorageService;
export const AppEventEmitter = appEventEmitter;
export const Config = config;
export const ReconnectHandler = reconnectHandler;
export const SentryClient = sentryClient;
export const NavigationService = NavigationServiceSingleton.getInstance();
export const CustomerMessagingPlatform = CustomerMessagingPlatformSingleton.getInstance();
