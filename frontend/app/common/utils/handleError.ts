import { AnyDict } from 'common/types';
import { BaseErrorInterface } from 'client/src/HeySpaceRestApiClient';
import { UserInterface } from 'models/domain/UsersModel/types';

import { Id } from './identifier';

import isDev from './isDevEnv';
import isMobileApp from './isMobileApp';
import removeEmpty from './removeEmpty';
import isObject from 'lodash/isObject';
import { UserContextSingleton } from 'common/services/userContext';

type ErrorContext = {
  mainOrganizationId?: Id;
  appUserId?: Id;
  reduxState?: {
    currentUser: {};
  };
  errorDetails?: {
    code?: string;
    message: string;
    params?: AnyDict;
    innerError?: Error;
    url?: string;
  };
  getOrganizationError?: Error;
} & {
  [_: string]: any;
};

function capture(error: Error | BaseErrorInterface | string, context: ErrorContext) {
  const SentryClient = require('../services/sentryClient').default;

  if (!SentryClient) {
    return;
  }

  let currentUserId = null;
  let user: Partial<UserInterface> = {};

  const userContextInstance = UserContextSingleton.getInstance();
  user = userContextInstance.getUser() ?? {};

  const baseError = error as BaseErrorInterface;

  context = {
    appUserId: currentUserId,
    reduxState: {
      currentUser: user,
    },
    errorDetails: isObject(baseError)
      ? {
          code: baseError.code,
          message: baseError.message,
          params: baseError.params,
          innerError: baseError.innerError,
          url: baseError.url,
        }
      : {
          message: baseError,
        },
    ...context,
  };

  // checking for null values because react-native-sentry is failing to set null values on iOS
  removeEmpty(context);

  let userContext = {};
  if (user.id) {
    userContext = {
      userId: user.id,
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };
  }

  SentryClient.captureException(baseError.code ? baseError.message : error, userContext, context);
}

export default function logException(error: Error | BaseErrorInterface | string, context: ErrorContext = {}) {
  if (!isDev()) {
    const getLocalStorage = require('../../LocalStorageFactory').default;
    const localStorage = getLocalStorage();

    if (localStorage) {
      localStorage.getItem('currentOrganizationId', (getOrganizationError, currentOrganizationId) => {
        if (getOrganizationError) {
          context.getOrganizationError = getOrganizationError;
        }
        context.mainOrganizationId = currentOrganizationId;
        capture(error, context);
      });
    } else {
      capture(error, context);
    }
  }

  /* eslint no-console:0 */
  // console.error crashes react-native app immediately
  if (isMobileApp()) {
    window.console && console.log && console.log(error, context);
  } else {
    window.console && console.error && console.error(error, context);
  }
}
