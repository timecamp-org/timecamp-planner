import { ExportServiceInterface } from './interfaces/ExportServiceInterface';
import { ExportDataType, ExportOutputFormat, ExportDataResult } from './types';
import { injectable, inject } from 'inversify';
import { AnyDict } from '../common/types';
import { ExportModule } from './ExportModule';
import { ExporterChainInterface } from './interfaces/ExporterChainInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';

@injectable()
export class ExportService implements ExportServiceInterface {

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(ExportModule.ExporterChainInterface)
    private exporterChain: ExporterChainInterface
  ) {
  }

  async export(dataType: ExportDataType, format: ExportOutputFormat, params: AnyDict): Promise<ExportDataResult> {
    this.logger.info(`Looking for chainable exporter able to export: ${dataType} in format: ${format}`)
    return await this.exporterChain.export(dataType, format, params);
  }
}
