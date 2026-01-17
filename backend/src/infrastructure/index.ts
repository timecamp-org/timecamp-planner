import { ModuleLoaderType } from '../ModuleLoaderType'
import { interfaces } from 'inversify'
import { ConsoleLogger, LogFilter, TagLoggerFactory } from './logger'
import config from '../config'
import { pgPool } from '../api/1.1/modules/db/pg'
import PostgresListenerPlugin from './PostgresListenerPlugin';
import { FeedServer } from './FeedServer';
import { InfrastructureModule } from './InfrastructureModule';
import { Pool } from 'pg';
import { PostgresListenerOptions } from './types';
import { RestServerModule } from './restServer/RestServerModule'
import responseFormatMiddleware from './responseFormatMiddleware'
import responseEnvelopeMiddleware from './responseEnvelopeMiddleware'
import { FeedServicePluginInterface } from '../api/1.1/modules/feed/interfaces/FeedServicePluginInterface'
import { FeedModule } from '../api/1.1/modules/feed/FeedModule'

export const infrastructureModule : ModuleLoaderType = kernel => {

  kernel.bind(InfrastructureModule.TargetLogger).toConstantValue(
    new ConsoleLogger(
      console,
      config.log.filter as LogFilter
    )
  );
  kernel.bind(InfrastructureModule.TagLoggerFactory).to(TagLoggerFactory);

  kernel.bind(InfrastructureModule.LoggerInterface).toDynamicValue(
    (ctx : interfaces.Context) => {
      let tag : string = '<unidentifiedService>';
      const tagLoggerFactory = ctx.container.get<TagLoggerFactory>(InfrastructureModule.TagLoggerFactory);
      // 'tag' will be service identifier of service that got LoggerInterface injected in constructor, eg.:
      //     class DupaDupa { @inject(...) construcor (logger : LoggerInterface) }
      // will produce call to new TagLogger('DupaDupa').
      if (ctx.currentRequest.parentRequest) {
        const parent = ctx.currentRequest.parentRequest;
        const serviceId = parent.serviceIdentifier;
        if (typeof serviceId === 'string') {
          tag = serviceId
        } else if (typeof serviceId === 'symbol') {
          // "Symbol(SomeString)" --> "SomeString"
          tag = serviceId.toString().replace(/^Symbol\(|\)$/g, '')
          // "SomeServiceInterface" -> "SomeService"
          tag = tag.replace(/Interface$/, '');
        }
      }
      return tagLoggerFactory.create(tag);
    }
  ).inTransientScope();
  kernel.bind<Pool>(InfrastructureModule.Pool).toConstantValue(pgPool)
  kernel.bind<PostgresListenerOptions>(InfrastructureModule.PostgresListenerOptions).toConstantValue({
    channel: config.db.notificationChannel,
  })
  kernel
    .bind<PostgresListenerPlugin>(InfrastructureModule.PostgresListener)
    .to(PostgresListenerPlugin)
  ;
  kernel.bind<FeedServer>(InfrastructureModule.FeedServer).to(FeedServer).inSingletonScope();

  kernel.bind(RestServerModule.RestMiddleware).toConstantValue(responseFormatMiddleware);
  kernel.bind(RestServerModule.RestMiddleware).toConstantValue(responseEnvelopeMiddleware);
  kernel.bind<FeedServicePluginInterface>(FeedModule.FeedServicePluginInterface)
    .toService(InfrastructureModule.PostgresListener);
}
