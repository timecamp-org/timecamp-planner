import { injectable, inject } from 'inversify';
import { ProcessManagerModule } from './ProcessManagerModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { AnyDict, Callback } from '../common/types';
import { SendDataToProcessResponse, ProcessName, ProcessMessage, SendRequestToProcessResponse } from './types';
import { IdGeneratorInterface, Id } from '../common/identifier'
import { ProcessCommunicationInterface } from './interfaces/ProcessCommunicationInterface';
import { CommonModule } from '../common/CommonModule';
import { Pm2ProviderInterface } from './interfaces/Pm2ProviderInterface';
import { ProcessManagerInterface } from './interfaces/ProcessManagerInterface';

@injectable()
export class ProcessCommunication
  implements ProcessCommunicationInterface {

  protected logger: LoggerInterface;
  private idGenerator: IdGeneratorInterface<Id>;
  private pmProvider: Pm2ProviderInterface;
  private processManager: ProcessManagerInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(CommonModule.IdGeneratorInterface) idGenerator: IdGeneratorInterface<Id>,
    @inject(ProcessManagerModule.ProcessManagerProvider) pmProvider: Pm2ProviderInterface,
    @inject(ProcessManagerModule.ProcessManagerInterface) processManager: ProcessManagerInterface,
  ) {
    this.logger = logger
    this.idGenerator = idGenerator
    this.pmProvider = pmProvider
    this.processManager = processManager
  }

  /*
  *  Sends prepared ProcessMessage to running process Id obtained by process name
  *  It doesn't wait form process rsponse
  */
  public async sendMessageToProcess(processName: ProcessName, processMessage: ProcessMessage): Promise<SendDataToProcessResponse> {
    const pmInstance = await this.pmProvider.getPm2Instance()
    const processDescription = await this.processManager.getProcessDescription(processName)
    if (!processDescription) {
      throw new Error(`Process ${processName} is not running.`)
    }
    const pid = processDescription.pm_id

    this.logger.info(`Sending data to process ${processName}, type: ${processMessage.type}...`)
    return new Promise((resolve, reject) => {
      pmInstance.sendDataToProcessId(pid, processMessage, (error, response) => {
        if (error) {
          this.logger.error('Send data error', error)
          return reject(error)
        }
        this.logger.info(`Package sent to process: ${processName}, type: ${processMessage.type}, pid: ${pid}`)
        return resolve(response)
      })
    })
  }

  /*
  *  Prepares ProcessMessage object and sends it to running process Id obtained by process name
  *  It doesn't wait form process rsponse
  */
  public async createMessageAndSendToProcess(processName: ProcessName, data: AnyDict): Promise<SendDataToProcessResponse> {
    const processMessage = this.createProcessMessage(data);
    return await this.sendMessageToProcess(processName, processMessage);
  }

  /*
  *  Sends prepared ProcessMessage to running process Id obtained by process name
  *  It waits for response from process and returns it
  */
  public async sendRequestToProcess(processName: ProcessName, data: AnyDict): Promise<SendRequestToProcessResponse> {
    const processMessage = this.createProcessMessage(data)
    return new Promise(async (resolve, reject) => {
      await this.onProcessMessage(processMessage.type, (error, message) => {
        if (error) {
          reject(error)
        } else {
          resolve(message.data)
        }
      })
      await this.sendMessageToProcess(processName, processMessage)
    })
  }

  /*
  *  Creates ProcessMessage payload to be send for specific process
  */
  private createProcessMessage(data: AnyDict, topic?: string): ProcessMessage {
    /* eventType can be passed with data or generated dynamically to be unique
    * Unique event types are needed for request/response-like messages
    */
    const eventType = data.type || this.idGenerator.generateId();
    return {
      data: { ...data },
      topic: topic || 'sample', // REQUIRED BY PM2 API
      type: eventType,
    }
  }

  /*
  *  Connects to message bus and listen for specific ProcessMessage type
  */
  private async onProcessMessage(processType: string, callback: Callback): Promise<void> {
    const bus = await this.pmProvider.getBus()
    bus.on(processType, (message) => callback(null, message));
  }

}


