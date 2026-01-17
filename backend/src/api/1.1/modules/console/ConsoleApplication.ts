import { CommandConfig, CommandDescriptor, CommandParameters, CommandRegistry } from './types'
import { CommandAlreadyDefined, CommandNotDefined } from './error'
import { ConsoleApplicationInterface } from './ConsoleApplicationInterface'
import { inject, injectable, interfaces } from 'inversify'
import { KernelService } from '../../../../kernel'
import Container = interfaces.Container
import { OutputInterface } from './OutputInterface'
import { ConsoleModule } from './ConsoleModule'

@injectable()
export class ConsoleApplication
implements ConsoleApplicationInterface
{
  protected descriptors: CommandRegistry = {};
  protected container: Container;
  protected output: OutputInterface;

  constructor(
    @inject(KernelService)
      container: interfaces.Container,

    @inject(ConsoleModule.OutputInterface)
      output: OutputInterface,
  ) {
    this.container = container;
    this.output = output;
  }

  registerCommand(
    name: string,
    descriptor: CommandDescriptor
  ) {
    if (this.descriptors[name]) {
      throw new CommandAlreadyDefined(name);
    }

    this.descriptors[name] = descriptor;
  }

  async run(commandName: string, params: CommandParameters): Promise<void> {
    if (!this.descriptors[commandName]) {
      throw new CommandNotDefined(commandName);
    }
    const descriptor = this.descriptors[commandName];
    const command = this.container.get(descriptor.serviceId);

    await command.execute(params, this.output);
  }

  getCommandDefinitions(): CommandConfig[] {
    return Object.keys(this.descriptors).map(name => ({
      name,
      ...this.descriptors[name],
    }));
  }
}