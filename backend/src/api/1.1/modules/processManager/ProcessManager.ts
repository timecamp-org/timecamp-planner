import { injectable, inject } from 'inversify';
import * as path from 'path'
import * as fs from 'fs'
import { ProcessManagerModule } from './ProcessManagerModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { ProcessDefinition, ProcessName, ProcessManagerConfig } from './types';
import { ProcessDescription } from 'pm2';
import { ProcessManagerInterface } from './interfaces/ProcessManagerInterface';
import { Pm2ProviderInterface } from './interfaces/Pm2ProviderInterface';

@injectable()
export class ProcessManager
  implements ProcessManagerInterface {

  protected logger: LoggerInterface;
  protected config: ProcessManagerConfig;
  protected pmProvider: Pm2ProviderInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(ProcessManagerModule.ProcessManagerConfig) config: ProcessManagerConfig,
    @inject(ProcessManagerModule.ProcessManagerProvider) pmProvider: Pm2ProviderInterface,
  ) {
    this.logger = logger
    this.config = config
    this.pmProvider = pmProvider
  }

  /*
  *  Get full process description by processName
  */
  public async getProcessDescription(processName: ProcessName): Promise<ProcessDescription> {
    const pmInstance = await this.pmProvider.getPm2Instance()
    return new Promise((resolve, reject) => {
      pmInstance.describe(processName, async (error, proc) => {
        if (error) {
          this.logger.error(error)
          await pmInstance.disconnect()
          return reject(error)
        }
        if (Array.isArray(proc)) {
          return resolve(proc[0])
        }
        return resolve(proc)
      })
    })
  }

  /*
*  Starts process by given ProcessDefinition
*  Process can be forked or clusterized depends on configuration
*/
  public async startProcess(scriptRoot: string, processDefinition: ProcessDefinition): Promise<ProcessDescription> {
    const pmInstance = await this.pmProvider.getPm2Instance()
    const scriptPath = path.join(scriptRoot, processDefinition.script)
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(scriptPath)) {
        return reject(new Error(`Script ${scriptPath} doesn't exist`))
      }
      this.logger.info(`Starting process ${scriptPath}...`)
      pmInstance.start({
        ...processDefinition,
        script: scriptPath,
      }, async (error, proc) => {
        if (error) {
          this.logger.error(error)
          await pmInstance.disconnect()
          return reject(error)
        }
        this.logger.info(`Process ${processDefinition.name} started.`)
        resolve(proc)
      })
    })
  }

  /*
  *  Deletes the process
  */
  public async deleteProcess(processName: ProcessName): Promise<ProcessDescription> {
    const pmInstance = await this.pmProvider.getPm2Instance()
    return new Promise((resolve, reject) => {
      this.logger.info(`Deleting process ${processName}...`)
      pmInstance.delete(processName, async (error, proc) => {
        if (error) {
          this.logger.error(error)
          await pmInstance.disconnect()
          return reject(error)
        }
        this.logger.info(`Process ${processName} deleted.`)
        resolve(proc)
      })
    })
  }


  /*
*  Gracefully stops the process
*/
  public async stopProcess(processName: ProcessName): Promise<ProcessDescription> {
    const pmInstance = await this.pmProvider.getPm2Instance()
    return new Promise((resolve, reject) => {
      this.logger.info(`Stopping process ${processName}...`)
      pmInstance.stop(processName, async (error, proc) => {
        if (error) {
          this.logger.error(error)
          await pmInstance.disconnect()
          return reject(error)
        }
        this.logger.info(`Process ${processName} stopped.`)
        resolve(proc)
      })
    })
  }


  /*
  *  Get list of running processes
  */
  public async getProcessList(): Promise<ProcessDescription[]> {
    const pmInstance = await this.pmProvider.getPm2Instance()
    return new Promise<ProcessDescription[]>((resolve, reject) => {
      pmInstance.list(async (error, list) => {
        if (error) {
          this.logger.error(error)
          await pmInstance.disconnect()
          return reject(error)
        }
        resolve(list)
      })
    })
  }

}


