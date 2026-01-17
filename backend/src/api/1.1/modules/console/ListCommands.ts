import { ConsoleCommandInterface } from './ConsoleCommandInterface'
import { CommandParameters } from './types'
import { ConsoleApplicationInterface } from './ConsoleApplicationInterface'
import { inject, injectable } from 'inversify'
import { ConsoleModule } from './ConsoleModule'
import { OutputInterface } from './OutputInterface'


@injectable()
export class ListCommands
  implements ConsoleCommandInterface
{
  protected app: ConsoleApplicationInterface;

  constructor(
    @inject(ConsoleModule.ConsoleApplicationInterface)
    app: ConsoleApplicationInterface
  ) {
    this.app = app
  }

  async execute(params: CommandParameters, output: OutputInterface): Promise<void> {
    const commands = this.app.getCommandDefinitions();

    commands.forEach(cmd => {
      output.print(`${cmd.name}\t\t-- ${cmd.description}\n`);
    });

    output.print("\n\n");
  }
}
