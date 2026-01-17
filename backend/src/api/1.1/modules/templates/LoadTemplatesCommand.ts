import { inject, injectable } from 'inversify';
import { ConsoleCommandInterface } from '../../../1.1/modules/console/ConsoleCommandInterface';
import { OutputInterface } from '../../../1.1/modules/console/OutputInterface';
import { CommandParameters } from '../../../1.1/modules/console/types';
import { ControlCommandFactoryInterface } from '../../../1.1/modules/messaging/interfaces/ControlCommandFactoryInterface';
import { ProcessCommunicationInterface } from '../../../1.1/modules/processManager/interfaces/ProcessCommunicationInterface';
import { EntityType } from '../common/enum';
import Table from '../db/Table';
import { TemplateModule } from './TemplateModule';
import { TemplateProviderInterface } from './interfaces/TemplateProviderInterface';
import { TemplateServiceInterface } from './interfaces/TemplateServiceInterface';

@injectable()
export class LoadTemplatesCommand implements ConsoleCommandInterface {
  protected processCommunication: ProcessCommunicationInterface;
  protected controlCommandFactory: ControlCommandFactoryInterface;

  constructor(
    @inject(TemplateModule.TemplateServiceInterface)
    protected templateService: TemplateServiceInterface,
    @inject(TemplateModule.TemplateProviderInterface)
    protected templateProvider: TemplateProviderInterface
  ) {}

  async execute(params: CommandParameters, out: OutputInterface): Promise<void> {
    try {
      const templatePaths = process.argv.slice(3);

      for (const templatePath of templatePaths) {
        const template = await import(templatePath);
        const name = template.name;

        const [templateWithSameName] = await this.templateProvider.getTemplateEntitiesByQueryModifiers(
          Table.PROJECT_TEMPLATE,
          {
            name,
          }
        );

        if (templateWithSameName) {
          await this.templateService.updateEntityTemplate(null, EntityType.Project, templateWithSameName.id, template);

          continue;
        }
        await this.templateService.createProjectTemplate(null, template);
      }
      process.exit(0);
    } catch (error) {
      out.print(`Could not send command: ${error}`);
    } finally {
      out.print('\n');
    }
  }
}
