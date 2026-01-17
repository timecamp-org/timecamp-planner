import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { ExportModule } from './ExportModule';
import { ExportService } from './ExportService';
import { ExportServiceInterface } from './interfaces/ExportServiceInterface';
import { ExporterChain } from './ExporterChain';
import { CalendarExporter } from './exporters/CalendarExporter';
import { BoardCardsExporter } from './exporters/BoardCardsExporter';
import { ExporterChainInterface } from './interfaces/ExporterChainInterface';
import { interfaces } from 'inversify';
import { ChainableExporterInterface } from './interfaces/ChainableExporterInterface';
import { FormatProviderFactoryInterface } from './interfaces/FormatProviderFactoryInterface';
import { FormatProviderFactory } from './FormatProviderFactory';
import { CSVExporterInterface } from './interfaces/CSVExporterInterface'
import { CSVExporter } from './exporters/CSVExporter'
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { ExportPermissions } from './ExportPermissions';

export const exportModule : ModuleLoaderType = kernel => {
  kernel.bind<ExportServiceInterface>(ExportModule.ExportServiceInterface).to(ExportService);

  kernel.bind<ChainableExporterInterface>(ExportModule.ChainableExporterInterface).to(CalendarExporter)

  kernel.bind<ChainableExporterInterface>(ExportModule.ChainableExporterInterface).to(BoardCardsExporter)

  kernel.bind<ExporterChainInterface>(ExportModule.ExporterChainInterface)
    .to(ExporterChain)
    .onActivation((ctx: interfaces.Context, exporterChain: ExporterChainInterface) => {
      const exporters = ctx.container.getAll<ChainableExporterInterface>(ExportModule.ChainableExporterInterface);
      exporters.forEach(exporter => exporterChain.registerExporter(exporter))
      return exporterChain
    })

  kernel.bind<CSVExporterInterface>(ExportModule.CSVExporterInterface).to(CSVExporter)

  kernel.bind<FormatProviderFactoryInterface>(ExportModule.FormatProviderFactoryInterface).to(FormatProviderFactory)

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface).to(ExportPermissions)
}
