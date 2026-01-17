import { injectable, inject } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { ExportDataType, ExportOutputFormat, ExportDataResult } from './types';
import { AnyDict } from '../common/types';
import { last, first } from 'lodash'
import { ExporterChainInterface } from './interfaces/ExporterChainInterface';
import { ChainableExporterInterface } from './interfaces/ChainableExporterInterface';

@injectable()
export class ExporterChain implements ExporterChainInterface {
  private exporters: ChainableExporterInterface[] = [];

  constructor(
    @inject(InfrastructureModule.LoggerInterface) 
    private logger: LoggerInterface,
  ) { }

  registerExporter(exporter: ChainableExporterInterface): void {
    const previousExporter = last(this.exporters)
    if (previousExporter) {
      previousExporter.setNextExporter(exporter)
    }
    this.logger.debug(`Registering exporter: ${exporter.getExporterType()}`)
    this.exporters.push(exporter);
  }

  async export(dataType: ExportDataType, format: ExportOutputFormat, params: AnyDict): Promise<ExportDataResult> {
    try {
      const exporter = first(this.exporters)
      return await exporter.export(dataType, format, params)
    } catch (error) {
      this.logger.error(error)
    }
  }
  
}
