import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface'
import { CommandParameters } from '../console/types'
import { OutputInterface } from '../console/OutputInterface'
import { injectable, multiInject, inject } from 'inversify'
import { NotificationTransportInterface } from '../notifications/interfaces/NotificationTransportInterface';
import { NotificationsModule } from '../notifications/NotificationsModule';
import { NotificationMethod } from '../notifications/types';
import { OnlineStatusModule } from '../onlineStatus/OnlineStatusModule';
import { UserSessionServiceInterface } from '../onlineStatus/UserSessionServiceInterface';
import { ProcessCommunicationInterface } from '../processManager/interfaces/ProcessCommunicationInterface';
import { ProcessManagerModule } from '../processManager/ProcessManagerModule';
import { ProcessName, ProcessType } from '../processManager/types';
import { NotificationCommandParams } from './types';

@injectable()
export class NotificationCommand implements ConsoleCommandInterface
{
  private transports: NotificationTransportInterface[];
  protected processCommunication: ProcessCommunicationInterface;
  protected userSessionService: UserSessionServiceInterface;

  constructor(
    @multiInject(NotificationsModule.NotificationTransportInterface)
    transports: NotificationTransportInterface[],
    @inject(ProcessManagerModule.ProcessCommunicationInterface)
    processCommunication: ProcessCommunicationInterface,
    @inject(OnlineStatusModule.UserSessionServiceInterface) 
    userSessionService: UserSessionServiceInterface,
  ) {
    this.transports = transports
    this.processCommunication = processCommunication
    this.userSessionService = userSessionService
  }

  async execute(params: CommandParameters, output: OutputInterface): Promise<void> {
    if (params.params.length < 1) {
      throw new Error('Missing audience type!');
    }
    if (params.params.length === 1) {
      throw new Error('Missing title!');
    }
    if (params.params.length === 2) {
      throw new Error('Missing content!');
    }
 
    const [ audienceType, title, content ] = params.params as NotificationCommandParams

    const sendPromises = this.transports
      .filter(t => t.getNotificationMethod() !== NotificationMethod.EMAIL)
      .map(t => t.sendSystemNotification(audienceType, title, content))
      ;

    output.print(`Sending push notification: ${content} for audience: ${audienceType}`);

    await sendPromises

    this.processCommunication.createMessageAndSendToProcess(ProcessName.HEYSPACE_API, { 
      title, 
      content, 
      audienceType, 
      type: ProcessType.NOTIFICATION_COMMAND 
    })

    output.print(`Success!`);
  }
}
