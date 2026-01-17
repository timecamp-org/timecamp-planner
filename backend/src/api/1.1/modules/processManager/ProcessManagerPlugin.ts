import { injectable, inject } from 'inversify';
import { ProcessManagerModule } from './ProcessManagerModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { ProcessManagerConfig, ProcessDefinition } from './types';
import { RestServerPluginInterface } from '../../../../infrastructure/restServer/RestServerPluginInterface';
import { Pm2ProviderInterface } from './interfaces/Pm2ProviderInterface';
import { ProcessManagerInterface } from './interfaces/ProcessManagerInterface';

@injectable()
export class ProcessManagerPlugin implements RestServerPluginInterface {

  public static readonly PLUGIN_KEY = 'ProcessManager';
  protected logger: LoggerInterface;
  protected config: ProcessManagerConfig;
  protected pmProvider: Pm2ProviderInterface;
  protected processManager: ProcessManagerInterface

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(ProcessManagerModule.ProcessManagerConfig) config: ProcessManagerConfig,
    @inject(ProcessManagerModule.ProcessManagerProvider) pmProvider: Pm2ProviderInterface,
    @inject(ProcessManagerModule.ProcessManagerInterface) processManager: ProcessManagerInterface,
  ) {
    this.logger = logger
    this.config = config
    this.pmProvider = pmProvider
    this.processManager = processManager
  }

  getKey(): string {
    return ProcessManagerPlugin.PLUGIN_KEY;
  }

  async onPluggedIn(): Promise<void> {
    await this.pmProvider.connect()
    await this.pmProvider.getBus()
    await Promise.all(
      this.config.definitions.map(async processDefinition => await this.processManager.startProcess(this.config.scriptRoot, processDefinition))
    )
  }

  async onUnplugged(): Promise<void> {
    await this.close();
  }

  /*
  *  Stops all processes owned by main api process
  *  Also disconnects from pm2 daemon
  */
  protected async close() {
    this.logger.info('Closing process manager connection...')
    const processList = await this.processManager.getProcessList()
    const appProcessNames = this.config.definitions.map(pd => pd.name)

    const appOwnedProcessList = processList.filter((proc: ProcessDefinition) => appProcessNames.includes(proc.name))

    this.logger.info(`Closing [${appOwnedProcessList.length}] forked processes...`)
    await Promise.all(
      appOwnedProcessList.map(async (proc: ProcessDefinition) => await this.processManager.stopProcess(proc.name))
    )
    // TODO: timeout/kill if process hangs for a long time

    this.logger.info(`All forked processes closed`)

    await this.pmProvider.disconnect()

    this.logger.info('Disconnected from process manager')
  }

}


