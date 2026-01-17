import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ConsoleApplicationInterface } from './ConsoleApplicationInterface'
import { ConsoleModule } from './ConsoleModule'
import { ConsoleApplication } from './ConsoleApplication'
import { ParameterFactoryInterface } from './ParameterFactoryInterface'
import { ParameterFactory } from './ParameterFactory'
import { interfaces } from 'inversify'
import Context = interfaces.Context
import { CommandConfig } from './types'
import { ConsoleCommandInterface } from './ConsoleCommandInterface'
import { ListCommands } from './ListCommands'
import { OutputInterface } from './OutputInterface'
import { ConsoleOutput } from './ConsoleOutput'

export const consoleModule: ModuleLoaderType = (kernel, config) =>
{
  kernel.bind<ConsoleApplicationInterface>(ConsoleModule.ConsoleApplicationInterface)
    .to(ConsoleApplication)
    .inSingletonScope()
    .onActivation((ctx: Context, app : ConsoleApplicationInterface) => {

      const commConfigs = ctx.container.getAll<CommandConfig>(ConsoleModule.ConsoleCommand);
      commConfigs.forEach(cc => app.registerCommand(cc.name, cc));

      return app;
    })
  ;

  kernel.bind<ParameterFactoryInterface>(ConsoleModule.ParameterFactoryInterface)
    .to(ParameterFactory);

  kernel.bind<OutputInterface>(ConsoleModule.OutputInterface)
    .to(ConsoleOutput);

  kernel.bind<ConsoleCommandInterface>(ConsoleModule.ListCommands).to(ListCommands);
  kernel.bind<CommandConfig>(ConsoleModule.ConsoleCommand).toConstantValue({
    name: 'list',
    serviceId: ConsoleModule.ListCommands,
    description: 'Lists all registered console commands',
  })
}