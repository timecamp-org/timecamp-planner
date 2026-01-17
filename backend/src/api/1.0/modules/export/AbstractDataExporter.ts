import {
  ExportDataType,
  ExportOutputFormat,
  GetContextResult,
  ExportDataResult,
  ExportDataStatus,
  ExporterType
} from './types';
import { inject, injectable } from 'inversify';
import { ChainableExporterInterface } from './interfaces/ChainableExporterInterface';
import { LoggerInterface } from '../../../../infrastructure/logger';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { Response } from 'express';

@injectable()
export abstract class AbstractDataExporter<T1, T2, R>
implements ChainableExporterInterface {

  private logger: LoggerInterface;
  protected exporterType: ExporterType;

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
  ) {
    this.logger = logger
  }

  protected nextExporter: ChainableExporterInterface;

  public setNextExporter(exporter: ChainableExporterInterface) {
    this.nextExporter = exporter
  }

  public async export(dataType: ExportDataType, format: ExportOutputFormat, params: T1): Promise<ExportDataResult> {
    if (this.isAbleToExport(dataType, format)) {
      this.logger.debug(`Exporter [${this.getExporterType()}] is able to handle request for ${dataType} in format ${format}`)
      const isPermitted = await this.isPermitted(params);
      if (!isPermitted) {
        return {
          status: ExportDataStatus.NOT_PERMITTED,
        }
      }
      const context = await this.getContext(params);
      const result = this.formatOutput(format, context.data);
      return {
        status: ExportDataStatus.OK,
        result,
        responseHandler: this.handleResponse.bind(this)
      }
    } else if (this.nextExporter) {
      return this.nextExporter.export(dataType, format, params)
    } else {
      this.logger.debug(`There is no exporter which can handle request for ${dataType} in format ${format}`)
      return {
        status: ExportDataStatus.EXPORT_MODULE_NOT_FOUND,
      }
    }
  }

  protected abstract isAbleToExport(dataType: ExportDataType, format: ExportOutputFormat): boolean;

  protected abstract isPermitted(params: T1): Promise<boolean>;

  public getExporterType(): ExporterType {
    return this.exporterType;
  }

  protected abstract getContext(params: T1): Promise<GetContextResult<T2>>;

  protected abstract formatOutput(format: ExportOutputFormat, context: T2): R;

  public abstract handleResponse(res: Response, result: R): void;
}
