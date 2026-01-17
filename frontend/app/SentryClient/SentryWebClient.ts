import * as Sentry from '@sentry/react';
import some from 'lodash/some';
import { SentryClientInterface } from './SentryClientInterface';
import { SentryUserData, SentryClientOptions, SentryFilter } from './types';
import { AnyDict } from '../common/types';

declare var APP_VERSION: string;

const defaultOptions = {
  release: typeof APP_VERSION !== 'undefined' ? APP_VERSION : null,
  ignoreErrors: [
    // Random plugins/extensions
    'top.GLOBALS',
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    "Can't find variable: ZiteReader",
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'http://loading.retry.widdit.com/',
    'atomicFindClose',
    // Facebook borked
    'fb_xd_fragment',
    // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
    // reduce this. (thanks @acdha)
    // See http://stackoverflow.com/questions/4113268
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    'conduitPage',
    // Generic error code from errors outside the security sandbox
    // You can delete this if using raven.js > 1.0, which ignores these automatically.
    'Script error.',
    'ResizeObserver loop limit exceeded',
    'GoogleApiClient picker load timeout',
    'messaging not initialized',
    'fbq is not defined',
    'GoogleApiClient oauth2 load timeout',
    'window.wootric is not a function',
    `Can't find variable: fbq`,
    'TypeError: Failed to fetch',
    'FETCH_ERROR',
    'Loading chunk',
  ],
  blacklistUrls: [
    // Facebook flakiness
    /graph\.facebook\.com/i,
    // Facebook blocked
    /connect\.facebook\.net\/en_US\/all\.js/i,
    // Woopra flakiness
    /eatdifferent\.com\.woopra-ns\.com/i,
    /static\.woopra\.com\/js\/woopra\.js/i,
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Other plugins
    /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
    /webappstoolbarba\.texthelp\.com\//i,
    /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
    /cdn\.inspectlet\.com\//i,
    /s\.ytimg\.com\//i,
  ],
};

export default class SentryWebClient implements SentryClientInterface {
  private options: SentryClientOptions;
  private filters: SentryFilter[];

  constructor(config, filters = []) {
    this.options = { ...defaultOptions, ...config };
    this.filters = filters;
  }

  init() {
    Sentry.init({
      dsn: this.options.sentryDSN,
      ...this.options,
      tracesSampleRate: 0.01,
      integrations: [new Sentry.BrowserTracing()],
      beforeSend(event) {
        const filteredBreadcrumbs = event.breadcrumbs.filter((breadcrumb) => {
          if (breadcrumb.category === 'console' && breadcrumb.level !== 'error') {
            return false;
          }
          return true;
        });
        event.breadcrumbs = filteredBreadcrumbs;
        return event;
      },
    });
  }

  setUserContext(userData: SentryUserData) {
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: userData.userId,
        username: userData.username,
        email: userData.email,
      });
    });
  }

  setExtraContext(context: AnyDict) {
    Sentry.configureScope((scope) => {
      Object.keys(context).forEach((key) => {
        scope.setExtra(key, context[key]);
      });
    });
  }

  captureException(error: Error, userData: SentryUserData, context: AnyDict) {
    if (this.isErrorPermittedToCapture(error)) {
      this.setUserContext(userData);
      this.setExtraContext(context);
      Sentry.captureException(error);
    } else {
      // ok
    }
  }

  isErrorPermittedToCapture(error: Error): boolean {
    if (!this.filters || this.filters.length === 0) {
      return true;
    }
    const results = this.filters.map((filter) => filter(error));
    return !some(results, (result) => result);
  }
}
