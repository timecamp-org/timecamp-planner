import { Request, Response } from 'express';
import { LoggerInterface } from '../../../infrastructure/logger'
import { inject, injectable } from 'inversify';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';
import { ExportModule } from '../modules/export/ExportModule';
import { ExportServiceInterface } from '../modules/export/interfaces/ExportServiceInterface';
import { ExportDataStatus, ExportDataType, ExportOutputFormat } from '../modules/export/types';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';

import { get } from 'lodash'

@injectable()
export class ExportController {
  protected logger: LoggerInterface;
  protected exportService: ExportServiceInterface;


  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(ExportModule.ExportServiceInterface)
      exportService: ExportServiceInterface,
  ) {
    this.logger = logger
    this.exportService = exportService
  }

  public async exportDataAction(req: Request, res: Response) {
    try {
      const { dataType, format } = req.params
      const params = { ...req.query }
      params.userId = get(req, 'heyspace.authResult.userId')
      const result = await this.exportService.export(dataType as ExportDataType, format as ExportOutputFormat, params);

      switch (result.status) {
        case ExportDataStatus.OK:
          const responseHandler = result.responseHandler
          if (!responseHandler) {
            return res.send(ErrorDefinitions[Type.RESPONSE_HANDLER_NOT_FOUND])
          }
          return responseHandler(res, result.result);
        case ExportDataStatus.EXPORT_MODULE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.RESOURCE_NOT_FOUND])
        case ExportDataStatus.NOT_PERMITTED:
          return res.send(ErrorDefinitions[Type.NOT_PERMITTED])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }

  }
}
