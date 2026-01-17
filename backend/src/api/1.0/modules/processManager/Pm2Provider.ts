import { Pm2ProviderInterface } from "./interfaces/Pm2ProviderInterface";
import { InfrastructureModule } from "../../../../infrastructure/InfrastructureModule";
import { LoggerInterface } from "../../../../infrastructure/logger";
import { ProcessManagerModule } from "./ProcessManagerModule";
import { inject, injectable } from "inversify";

@injectable()
export class Pm2Provider implements Pm2ProviderInterface {

  protected logger: LoggerInterface;
  protected processManagerInstance: PM2.Manager;
  private processManagerInstancePromise: Promise<PM2.Manager>;
  private busPromise: Promise<PM2.Bus>;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(ProcessManagerModule.ProcessManagerInstance) processManagerInstance: PM2.Manager,
  ) {
    this.logger = logger
    this.processManagerInstance = processManagerInstance
  }

  public async getPm2Instance(): Promise<PM2.Manager> {
    if (!this.processManagerInstancePromise) {
      await this.connect()
    }
    return this.processManagerInstancePromise
  }

  /*
  *  Connects to a running pm2 daemon (“God”)
  *  Once launched, the pm2 process will keep running after the script exits.
  */
  public async connect(): Promise<PM2.Manager> {
    this.logger.info('Connecting to process manager...')
    this.processManagerInstancePromise = new Promise((resolve, reject) => {
      this.processManagerInstance.connect((error) => {
        if (error) {
          this.logger.error(error);
          reject(error)
          process.exit(2);
        }
        this.logger.info('Connected to process manager')
        return resolve(this.processManagerInstance)
      })
    })
    return this.processManagerInstancePromise
  }

  public async disconnect(): Promise<void> {
    await this.processManagerInstance.disconnect()
    this.processManagerInstancePromise = null
  }

  /*
  *  Opens a message bus
  *  The bus will be an Axon Sub Emitter object used to listen to and send events.
  */
  public async launchBus(): Promise<PM2.Bus> {
    this.logger.info('Connecting to messaging bus...')
    this.busPromise = new Promise((resolve, reject) => {
      this.processManagerInstance.launchBus((error, bus: PM2.Bus) => {
        if (error) {
          this.logger.info('Bus launch error', error)
          return reject(error)
        }

        this.logger.info('Connected to process messaging bus')
        return resolve(bus)
      })
    })
    return this.busPromise
  }

  public async getBus(): Promise<PM2.Bus> {
    if (this.busPromise) {
      return this.busPromise
    } else {
      return await this.launchBus()
    }
  }

}
