import { inject, injectable } from 'inversify'
import { EventEmitter } from 'events'
import { Notification, Pool, PoolClient } from 'pg'
import { LoggerInterface } from './logger'
import { NEW_NOTIFICATION, PostgresListenerOptions } from './types'
import { InfrastructureModule } from './InfrastructureModule'
import { FeedServicePluginInterface } from '../api/1.1/modules/feed/interfaces/FeedServicePluginInterface'

@injectable()
export class PostgresListenerPlugin
  extends EventEmitter
  implements FeedServicePluginInterface
{
  public static readonly PLUGIN_KEY = 'PostgresListener';

  protected pool: Pool
  protected client: PoolClient
  protected logger: LoggerInterface
  private options: PostgresListenerOptions

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(InfrastructureModule.Pool) pgPool: Pool,
    @inject(InfrastructureModule.PostgresListenerOptions) options: PostgresListenerOptions,
  ) {
    super()
    try {
      this.pool = pgPool
      this.logger = logger
      this.options = options
    } catch (error) {
      this.logger.error(error)
    }
  }

  async attach(): Promise<void> {
    await this.connect();
  }

  async detach(): Promise<void> {
    await this.close();
  }

  async connect(): Promise<this> {
    try {
      this.pool.on('error', this.onError.bind(this))
      this.client = await this.pool.connect()
      await this.client.query(`LISTEN ${this.options.channel}`)
      this.client.on('notification', this.emitNotification.bind(this))
      this.logger.info(`PostgresListener is listening on channel '${this.channel}'`);
      return this
    } catch (error) {
      this.logger.error(error)
    }
  }

  close(): void {
    try {
      this.logger.info('Releasing client...');
      this.client.release()
    } catch (error) {
      this.logger.error(error)
    }
  }

  emitNotification(notification: Notification): void {
    this.emit(NEW_NOTIFICATION, notification);
  }

  onError(error): void {
    this.logger.error('Unexpected error on idle client', error)
    process.exit(-1);
  }

  get channel(): string {
    return this.options.channel
  }
}

export default PostgresListenerPlugin