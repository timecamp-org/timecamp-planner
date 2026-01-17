import * as WebSocket from 'ws'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { EventEmitter } from 'events'
import { parseDateToEpochInMS } from '../../../../infrastructure/utils';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { inject, injectable, multiInject } from 'inversify';
import { CommonModule } from '../common/CommonModule';
import { FeedServiceInterface } from './interfaces/FeedServiceInterface';
import { FeedServicePluginInterface } from './interfaces/FeedServicePluginInterface';
import { KeepAliveSocket } from './KeepAliveSocket';
import { BucketRegistry } from './BucketRegistry';
import { FeedModule } from './FeedModule';
import { Broadcast } from './types';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';

@injectable()
export class FeedService
  extends EventEmitter
  implements FeedServiceInterface {
  protected bucketRegistry: BucketRegistry;
  protected logger: LoggerInterface;
  protected timeService: TimeServiceInterface;
  protected initialized: Promise<void[] | void>;
  protected plugins?: FeedServicePluginInterface[];
  protected jsonSerializer: JsonSerializerInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(CommonModule.TimeServiceInterface) timeService: TimeServiceInterface,
    @inject(CommonModule.JsonSerializerInterface) jsonSerializer: JsonSerializerInterface,
    @multiInject(FeedModule.FeedServicePluginInterface) plugins?: FeedServicePluginInterface[],
  ) {
    super();
    this.logger = logger;
    this.timeService = timeService;
    this.bucketRegistry = new BucketRegistry(logger, this, jsonSerializer);
    this.plugins = plugins || [];
    this.jsonSerializer = jsonSerializer;
  }

  public initialize(): void {
    this.loadPlugins();
  }

  public close(): void {
    this.uninstallPlugins()
  }

  public broadcast(broadcast: Broadcast) {
    this.initialized.then(() => {
      this.logger.debug(`Received new broadcast [${this.jsonSerializer.toJson(broadcast.message)}] to ${this.jsonSerializer.toJson(broadcast.recipients)}`);
      broadcast.message = parseDateToEpochInMS(broadcast.message)
      if (broadcast.recipients === '*') {
        try {
          this.bucketRegistry.broadcastToAll(broadcast.message);
        } catch (e) {
          this.logger.error(e);
        }
      } else {
        broadcast.recipients.forEach((userId) => {
          try {
            this.bucketRegistry.broadcastToUser(userId, broadcast.message);
          } catch (e) {
            this.logger.error(e);
          }
        })
      }
    });
  }

  registerUserSocket(userId: string, socket: WebSocket): void {

    this.initialized.then(() => {
      const bucket = this.bucketRegistry.getOrCreateUserBucket(userId);
      new KeepAliveSocket({
        socket,
        logger: this.logger,
        keepAliveSeconds: 5
      }, this.jsonSerializer);
      bucket.registerSocket(socket);
    });
  }

  private loadPlugins() {
    this.logger.info(`Loading ${this.plugins.length} plugins...`);
    this.initialized = Promise.all(this.plugins.map(plugin => plugin.attach(this)))
      .then(() => {
        this.logger.info('Plugins loaded: ', this.plugins.map(plugin => plugin.constructor.name).join(', '))
      })
      .catch(this.logger.error.bind(this.logger));
  }

  private uninstallPlugins() {
    this.logger.info(`Uninstalling ${this.plugins.length} plugins...`);
    this.initialized = Promise.all(this.plugins.map(plugin => plugin.detach(this)))
      .then(() => {
        this.logger.info('Plugins uninstalled: ', this.plugins.map(plugin => plugin.constructor.name).join(', '))
      })
      .catch(this.logger.error.bind(this.logger));
  }
}
