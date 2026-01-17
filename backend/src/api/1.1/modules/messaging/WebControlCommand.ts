import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface'
import { CommandParameters } from '../console/types'
import { OutputInterface } from '../console/OutputInterface'
import { injectable, inject } from 'inversify'
import { ProcessCommunicationInterface } from '../processManager/interfaces/ProcessCommunicationInterface';
import { ProcessManagerModule } from '../processManager/ProcessManagerModule';
import { ProcessName, ProcessType } from '../processManager/types';
import { MessagingModule } from './MessagingModule';
import { ControlCommandFactoryInterface } from './interfaces/ControlCommandFactoryInterface';

@injectable()
export class WebControlCommand
  implements ConsoleCommandInterface
{

  protected processCommunication: ProcessCommunicationInterface;
  protected controlCommandFactory: ControlCommandFactoryInterface;

  constructor(
    @inject(ProcessManagerModule.ProcessCommunicationInterface)
    processCommunication: ProcessCommunicationInterface,

    @inject(MessagingModule.ControlCommandFactoryInterface)
    controlCommandFactory: ControlCommandFactoryInterface,
  ) {
    this.processCommunication = processCommunication
    this.controlCommandFactory = controlCommandFactory
  }

  async execute(params: CommandParameters, out: OutputInterface): Promise<void> {
    try {
      const [ commandName ] = params.params
      const command = this.controlCommandFactory.createCommand(commandName)
      this.processCommunication.createMessageAndSendToProcess(ProcessName.HEYSPACE_API, { data: command, type: ProcessType.CONTROL_COMMAND })
      out.print(`Send control command: ${commandName}`);
    } catch(error) {
      out.print(`Could not send command: ${error}`);
    }
    finally {
      out.print("\n");
    }
  }
}
