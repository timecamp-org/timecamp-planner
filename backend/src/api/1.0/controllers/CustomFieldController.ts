import { Request, Response } from 'express';
import { LoggerInterface } from '../../../infrastructure/logger'
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions'
import { CustomFieldTargetType } from '../modules/db/schema'
import {
  GetCustomFieldValueStatus,
  SetCustomFieldValueStatus,
  SetCustomRelationValueStatus
} from '../modules/extensions/types';
import { Id } from '../modules/common/identifier'
import { inject, injectable } from 'inversify';
import { ExtensionsModule } from '../modules/extensions/ExtensionsModule';
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule';
import { CustomFieldServiceInterface } from '../modules/extensions/interfaces/CustomFieldServiceInterface';
import { ExtensionServiceInterface } from '../modules/extensions/interfaces/ExtensionServiceInterface';

@injectable()
export class CustomFieldController {
  protected logger: LoggerInterface;
  protected customFieldService: CustomFieldServiceInterface;
  protected extensionService: ExtensionServiceInterface;


  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(ExtensionsModule.CustomFieldServiceInterface) customFieldService: CustomFieldServiceInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface) extensionService: ExtensionServiceInterface,
  ) {
    this.logger = logger
    this.customFieldService = customFieldService
    this.extensionService = extensionService
  }

  public async updateCustomFieldsAction(req: Request, res: Response) {
    const { targetType, targetId } = req.params;
    return await this.doUpdateObjectCustomFieldsAction(
      req,
      res,
      targetType as CustomFieldTargetType,
      targetId,
    )
  }

  public async getCustomFieldsAction(req: Request, res: Response) {
    try {
      const { targetType, targetId } = req.params;

      const result = await this.customFieldService.getValuesForTargetIds(
        targetType as CustomFieldTargetType,
        [targetId],
      );

      switch (result.status) {
        case GetCustomFieldValueStatus.OK:
          res.send(result.values);
          break;

        case GetCustomFieldValueStatus.NAMESPACE_DOES_NOT_EXIST:
          res.send(ErrorDefinitions[Type.CUSTOM_FIELD_NAMESPACE_INCORRECT]);
          break

        default:
          res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (e) {
      this.logger.error(e);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  protected async doUpdateObjectCustomFieldsAction(
    req: Request,
    res: Response,
    targetType: CustomFieldTargetType,
    targetId: Id
  ) {
    try {

      const result = await this.customFieldService.setValues(
        targetType,
        targetId,
        req.body,
        req.heyspace.authResult.userId,
      );

      switch (result.status) {
        case SetCustomFieldValueStatus.OK:
          return res.send();
        case SetCustomFieldValueStatus.CUSTOM_FIELD_DOES_NOT_EXIST:
        case SetCustomFieldValueStatus.CUSTOM_FIELD_FULLY_QUALIFIED_NAME_MALFORMED:
        case SetCustomFieldValueStatus.NAMESPACE_DOES_NOT_EXIST:
          return res.send(ErrorDefinitions[Type.CUSTOM_FIELD_INCORRECT](result.fieldName))
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (e) {
      this.logger.error(e);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  public async getExtensionRelationAction(req: Request, res: Response) {
    const { targetType, targetId, namespace } = req.params
    try {
      const result = await this.customFieldService.getRelationData(
        namespace,
        targetType as CustomFieldTargetType,
        targetId,
      )

      switch (result.status) {
        case SetCustomRelationValueStatus.OK:
          return res.send(result.values);
        case SetCustomRelationValueStatus.CUSTOM_RELATION_DOES_NOT_EXIST:
          return res.send(ErrorDefinitions[Type.CUSTOM_RELATION_INCORRECT])
        case SetCustomRelationValueStatus.NAMESPACE_DOES_NOT_EXIST:
          return res.send(ErrorDefinitions[Type.EXTENSION_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch(e) {
      this.logger.error(e);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }

  public async updateExtensionRelationAction(req: Request, res: Response) {
    await this.doUpdateExtensionRelationAction(req, res, 'update')
  }

  public async deleteExtensionRelationAction(req: Request, res: Response) {
    await this.doUpdateExtensionRelationAction(req, res, 'delete')
  }

  public async doUpdateExtensionRelationAction(req: Request, res: Response, operation: 'delete' | 'update') {
    try {
      const { namespace, relation } = req.params;
      const result = operation === 'delete'
        ? await this.customFieldService.deleteRelation(namespace, relation, req.body)
        : await this.customFieldService.updateRelation(namespace, relation, req.body)
        ;

      switch (result.status) {
        case SetCustomRelationValueStatus.OK:
          return res.send();
        case SetCustomRelationValueStatus.CUSTOM_RELATION_DOES_NOT_EXIST:
        case SetCustomRelationValueStatus.UNIQUE_KEY_MALFORMED:
        case SetCustomRelationValueStatus.NAMESPACE_DOES_NOT_EXIST:
          return res.send(ErrorDefinitions[Type.CUSTOM_RELATION_INCORRECT])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (e) {
      this.logger.error(e);
      res.send(ErrorDefinitions[Type.INTERNAL]);
    }
  }
}
