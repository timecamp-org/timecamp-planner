import { ModuleLoaderType } from '../../../../ModuleLoaderType';

import { ConsoleCommandInterface } from '../console/ConsoleCommandInterface';
import { ConsoleModule } from '../console/ConsoleModule';
import { CommandConfig } from '../console/types';

import { LoadTemplatesCommand } from './LoadTemplatesCommand';
import { TemplateModule } from './TemplateModule';
import { TemplateService } from './TemplateService';
import { TemplateProviderInterface } from './interfaces/TemplateProviderInterface';
import { TemplateServiceInterface } from './interfaces/TemplateServiceInterface';
import { TemplateProvider } from './providers/TemplatesProvider';

export const templateModule: ModuleLoaderType = (kernel) => {
  kernel.bind<ConsoleCommandInterface>(TemplateModule.LoadTemplatesCommand).to(LoadTemplatesCommand);
  kernel.bind<TemplateServiceInterface>(TemplateModule.TemplateServiceInterface).to(TemplateService);
  kernel.bind<TemplateProviderInterface>(TemplateModule.TemplateProviderInterface).to(TemplateProvider);
  kernel.bind<CommandConfig>(ConsoleModule.ConsoleCommand).toConstantValue({
    name: 'templates:load-templates',
    description: 'Load generic templates to the database',
    serviceId: TemplateModule.LoadTemplatesCommand,
  });
};
