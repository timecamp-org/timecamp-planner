import { LoggerInterface, TagLoggerFactory } from '../infrastructure/logger';
import * as i18n from 'i18n';
import { kernel } from '../kernel';
import { InfrastructureModule } from '../infrastructure/InfrastructureModule';
import { decorate, injectable } from 'inversify';
import { EventEmitter } from 'events';
import { OAuth2Module } from '../api/1.0/modules/oauth2/OAuth2Module';
import * as OAuthServer from 'oauth2-server';

const consoleLogger = kernel.get<LoggerInterface>(InfrastructureModule.TargetLogger);
const loggerFactory = new TagLoggerFactory(consoleLogger);

const i18nLogger = loggerFactory.create('i18n');
export const entryLogger = loggerFactory.create('MainProcess');

i18n.configure({
  directory: __dirname + '/../../locale',
  logDebugFn: i18nLogger.debug.bind(i18nLogger),
});

decorate(injectable(), EventEmitter);

export const oAuthServer = kernel.get<OAuthServer>(OAuth2Module.OAuth2Server);

export const theKernel = kernel;
