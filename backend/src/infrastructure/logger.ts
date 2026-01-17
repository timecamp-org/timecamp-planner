import { format } from 'date-fns';
import * as Sentry from '@sentry/node';
import { inject, injectable } from 'inversify';
import { last } from 'lodash';
import { InfrastructureModule } from './InfrastructureModule';
import { AnyDict } from '../api/1.1/modules/common/types';

export interface LoggerMethodsInterface {
  info(...params: any[]);

  error(...params: any[]);

  warn(...params: any[]);

  verbose(...params: any[]);

  debug(...params: any[]);
}
export interface LoggerInterface extends LoggerMethodsInterface {
  trace(...params: any[]);
}

/**
 * LoggerMethod = 'info' | 'error' | 'warn' | ... any other method defined in LoggerInterface
 */
export type LoggerMethod = keyof LoggerMethodsInterface;
export type LogFilter = LoggerMethod[];

const DEFAULT_LOG_FILTER: LogFilter = ['error', 'warn'];

export type ConsoleLoggerOptionsType = {
  showLogLevel?: boolean;
  /**
   * If empty -- do not show timestamps
   */
  timestampFormat?: string;
};
const CONSOLE_LOGGER_DEFAULT_OPTIONS: ConsoleLoggerOptionsType = {
  showLogLevel: true,
  timestampFormat: 'MM-DD HH:mm:ss |',
};

export class ConsoleLogger implements LoggerInterface {
  private readonly console: Console;
  private readonly filter: LogFilter;
  private options: ConsoleLoggerOptionsType;

  constructor(console: Console, logFilter: LogFilter = DEFAULT_LOG_FILTER, options: ConsoleLoggerOptionsType = {}) {
    this.console = console;
    this.filter = logFilter;
    this.options = Object.assign({}, CONSOLE_LOGGER_DEFAULT_OPTIONS, options);
  }

  debug(...params: any[]) {
    if (!this.should('debug')) return;
    this.decorate(params, 'debug');
    this.console.debug(...params);
  }

  error(...params: any[]) {
    if (!this.should('error')) return;
    this.decorate(params, 'error');
    this.console.error(...params);
    const originalError = this.getOriginalError(params);
    Sentry.captureException(originalError);
  }

  info(...params: any[]) {
    if (!this.should('info')) return;
    this.decorate(params, 'info');
    this.console.info(...params);
  }

  verbose(...params: any[]) {
    if (!this.should('verbose')) return;
    this.decorate(params, 'verbose');
    this.console.debug(...params);
  }

  warn(...params: any[]) {
    if (!this.should('warn')) return;
    this.decorate(params, 'warn');
    this.console.warn(...params);
  }

  trace(...params: any[]) {
    this.console.trace(...params);
  }

  private should(level: LoggerMethod) {
    return !this.filter || this.filter.indexOf(level) >= 0;
  }

  private decorate(params: any[], logLevel: LoggerMethod) {
    if (this.options.showLogLevel) {
      params.unshift(`[${logLevel}]`);
    }
    if (this.options.timestampFormat) {
      const date = format(new Date(), this.options.timestampFormat);
      params.unshift(`${date}`);
    }
  }

  private getOriginalError(params: any[]): Error | any {
    let error = params.find((param) => param instanceof Error);

    let parsedParams = [...params];
    if (parsedParams.length >= 4) {
      parsedParams = parsedParams.slice(2, parsedParams.length);
    }
    const prefix = parsedParams.filter((param) => typeof param === 'string').join();
    if (!error) {
      error = last(params);
    }
    if (error.message) {
      return new Error(`${prefix} ${error.message}`);
    }
    return error;
  }
}

/**
 * Decorates given logger so that it prefixes every line with "[tag]". Eg.:
 * var logger = console, taggedLogger = new TagLoggerDecorator(console, 'http');
 * logger.log('hi');
 * > 'hi'
 * taggedLogger.log('hi')
 * > '[http] hi'
 */
export class TagLoggerDecorator implements LoggerInterface {
  protected tag: string;
  private readonly logger: LoggerInterface;
  private readonly braces: string;

  constructor(logger: LoggerInterface, tag: string, braces: string = '[]') {
    this.tag = tag;
    this.logger = logger;
    this.braces = braces;
    if (this.braces.length !== 2) {
      throw new Error(`TagLoggerDecorator requires 'braces' parameter to be string of length 2, got: ${braces}`);
    }
  }

  private callLogger(method: LoggerMethod, params: any[]) {
    params.unshift(`${this.braces[0]}${this.tag}${this.braces[1]}`);
    this.logger[method](...params);
  }

  info(...params: any[]) {
    this.callLogger('info', params);
  }

  error(...params: any[]) {
    this.callLogger('error', params);
    this.logger.trace();
  }

  warn(...params: any[]) {
    this.callLogger('warn', params);
  }

  debug(...params: any[]) {
    this.callLogger('debug', params);
  }

  verbose(...params: any[]) {
    this.callLogger('verbose', params);
  }

  trace(...params: any[]) {
    this.logger.trace(...params);
  }
}

@injectable()
export class TagLoggerFactory {
  protected logger: LoggerInterface;

  constructor(@inject(InfrastructureModule.TargetLogger) logger: LoggerInterface) {
    this.logger = logger;
  }

  public create(tag: string, braces: string = '[]') {
    return new TagLoggerDecorator(this.logger, tag, braces);
  }
}

export interface SentryUserData {
  userId?: string;
  username?: string;
  email?: string;
}

function setUserContext(userData: SentryUserData) {
  Sentry.configureScope((scope) => {
    scope.clear();
    scope.setUser({
      id: userData.userId,
      username: userData.username,
      email: userData.email,
    });
  });
}

function setExtraContext(context: AnyDict) {
  Sentry.configureScope((scope) => {
    scope.clear();
    Object.keys(context).forEach((key) => {
      scope.setExtra(key, context[key]);
    });
  });
}

function captureException(error: Error, userData?: SentryUserData, context?: AnyDict) {
  if (userData) {
    setUserContext(userData);
  }

  if (context) {
    setExtraContext(context);
  }

  Sentry.captureException(error);
}

export default (error: Error, userData?: SentryUserData, context?: AnyDict) => {
  console.error(error);
  console.trace();
  captureException(error, userData, context);
};
