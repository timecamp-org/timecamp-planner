import * as app from 'express'; // TODO CR a zrobmy z tego RestServer folder i wrzucmy do niego ten plik jako index + routes.ts obok
import * as cors from 'cors';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import * as bodyParser from 'body-parser';
import * as boolParser from 'express-query-boolean';
import * as cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import config from '../../config/index';
import { Router } from 'express';

import { inject, injectable, multiInject } from 'inversify';
import { RestServerModule } from './RestServerModule';
import { MiddlewareHandler } from '../RouteLoader';
import { RestServerPluginInterface } from './RestServerPluginInterface';
import { InfrastructureModule } from '../InfrastructureModule';
import { LoggerInterface } from '../logger';

@injectable()
class RestServer {
  private app;
  private httpServer;
  private logger: LoggerInterface;
  private plugins: RestServerPluginInterface[];

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger,
    @multiInject(RestServerModule.RestMiddleware) middlewares: MiddlewareHandler[],
    @inject(RestServerModule.RoutesV10) routesV10: Router,
    @inject(RestServerModule.RoutesV11) routesV11: Router
  ) {
    this.logger = logger;
    this.app = app();

    if (config.sentry.isEnabled) {
      this.attachSentry();
    }

    this.app.use(
      cors({
        credentials: true,
        origin: true,
      })
    );

    this.app.use(helmet());

    this.app.use(requestIp.mw());

    this.app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 50000 }));
    this.app.use(bodyParser.json({ limit: '5mb' }));
    this.app.use(boolParser());

    this.app.use(cookieParser());
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });

    this.app.use('/api/', routesV10);
    this.app.use('/api/v1.0/', routesV10);
    this.app.use('/api/v1.1/', routesV11);

    if (config.sentry.isEnabled) {
      this.app.use(Sentry.Handlers.errorHandler());

      this.app.use(function onError(err, req, res, next) {
        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        res.statusCode = 500;
        res.end(res.sentry + '\n');
      });
    }

    this.plugins = [];
  }

  public listen(port) {
    return new Promise((resolve, reject) => {
      this.httpServer = this.app.listen(port, (err, server) => {
        if (err) {
          return reject(err);
        }
        resolve(server);
      });
    });
  }

  public async installPlugin(plugin: RestServerPluginInterface): Promise<void> {
    this.logger.info(`Installing plugin: [${plugin.getKey()}]`);
    const installed = this.plugins.find((p) => p.getKey() === plugin.getKey());
    if (installed) {
      this.logger.warn('Plugin already installed. Cannot duplicate plugis.');
      return;
    }

    await plugin.onPluggedIn();

    this.plugins.push(plugin);
  }

  public async close(): Promise<void> {
    await this.closeServer();
    await this.uninstallPlugins();
  }

  attachSentry() {
    Sentry.init({
      dsn: config.sentry.dsn,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable app.js middleware tracing
        // @ts-ignore
        new Tracing.Integrations.Express({ app }),
      ],

      tracesSampleRate: 0.01,
    });
    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(Sentry.Handlers.tracingHandler());
  }

  protected closeServer(): Promise<void> {
    this.logger.info('Stopping HTTP server...');
    return new Promise((res, rej) => {
      this.httpServer.close((err) => {
        if (err) {
          rej(err);
        } else {
          this.logger.info('HTTP stopped.');
          res();
        }
      });
    });
  }

  protected async uninstallPlugins(): Promise<void> {
    this.logger.info(`Unplugging: ${this.plugins.map((p) => p.getKey()).join(', ')}`);
    const uninstallers = this.plugins.map((plugin) => plugin.onUnplugged());
    await Promise.all(uninstallers);
    this.logger.info('All plugins unplugged');
  }
}

export default RestServer;
