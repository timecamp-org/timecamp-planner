import { CustomFieldServiceInterface } from './interfaces/CustomFieldServiceInterface'
import {
  CustomFieldDbRow,
  CustomFieldTargetType,
  CustomFieldValueDbRow,
  CustomRelationDbRow,
  ExtensionDbRow,
  TargetType
} from '../db/schema'
import { Id } from '../common/identifier'
import {
  CustomFieldTargetTypeMap,
  CustomFieldValues,
  ExtensionNamespace,
  ExtensionRelation,
  ExtensionsData,
  FullyQualifiedCustomField,
  GetCustomFieldValueStatus, GetCustomRelationResult,
  GetExtensionsDataResult,
  GetExtensionsDataStatus,
  GetValuesForTargetIdsResult,
  GetValuesResult,
  SetCustomFieldValueStatus,
  SetCustomRelationValueResult,
  SetCustomRelationValueStatus,
  SetValueResult,
} from './types'
import { ExtensionServiceInterface } from './interfaces/ExtensionServiceInterface'
import Table from '../db/Table'

import { NamingConvention } from '../../../../utils'
import { first, get, set, values } from 'lodash'
import { ConnectionInterface } from '../db/ConnectionInterface'
import { CustomRelationSqlFactoryInterface } from './interfaces/CustomRelationSqlFactoryInterface'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { inject, injectable } from 'inversify'
import { DbModule } from '../db/DbModule'
import { ExtensionsModule } from './ExtensionsModule'
import { AnyDict } from '../common/types'
import ConventionConverter = NamingConvention.ConventionConverter;
import { ActivityServiceInterface } from '../activities/interfaces/ActivityServiceInterface';
import { ActivitiesModule } from '../activities/ActivitiesModule';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { Changes } from '../activities/types';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';
import { CommonModule } from '../common/CommonModule';
import { CustomFieldProviderInterface } from './interfaces/CustomFieldProviderInterface';

@injectable()
export class CustomFieldService
implements CustomFieldServiceInterface {
  protected connection: ConnectionInterface;
  protected extensionService: ExtensionServiceInterface;
  protected customRelationSqlFactory: CustomRelationSqlFactoryInterface
  protected logger: LoggerInterface;
  private namingConverter: ConventionConverter
  protected activityService: ActivityServiceInterface;
  protected jsonSerializer: JsonSerializerInterface;

  constructor(
    @inject(InfrastructureModule.LoggerInterface) logger: LoggerInterface,
    @inject(DbModule.ConnectionInterface) connection: ConnectionInterface,
    @inject(ExtensionsModule.ExtensionServiceInterface) extensionService: ExtensionServiceInterface,
    @inject(ExtensionsModule.CustomRelationSqlFactoryInterface) customRelationSqlFactory: CustomRelationSqlFactoryInterface,
    @inject(DbModule.NamingConverter) namingConverter: ConventionConverter,
    @inject(ActivitiesModule.ActivityServiceInterface) activityService: ActivityServiceInterface,
    @inject(CommonModule.JsonSerializerInterface) jsonSerializer: JsonSerializerInterface,
    @inject(ExtensionsModule.CustomFieldProviderInterface)
    private customFieldProvider: CustomFieldProviderInterface,
  ) {
    this.logger = logger;
    this.extensionService = extensionService;
    this.customRelationSqlFactory = customRelationSqlFactory;
    this.connection = connection;
    this.namingConverter = namingConverter;
    this.activityService = activityService;
    this.jsonSerializer = jsonSerializer;

  }

  async setValue(
    targetType: CustomFieldTargetType,
    targetId: Id,
    fieldName: string,
    value: any,
    actorId: Id,
  ): Promise<SetValueResult> {
    return await this.connection.getConnection().transaction(async trx => {
      return await this.doSetValue(
        trx,
        targetType,
        targetId,
        fieldName,
        value,
        actorId
      )
    })
  }

  async setValues(
    targetType: CustomFieldTargetType,
    targetId: Id,
    fieldValues: CustomFieldValues,
    actorId: Id
  ): Promise<SetValueResult> {
    return this.connection.getConnection().transaction(async trx => {
      return await this.doSetValues(trx, targetType, targetId, fieldValues, actorId);
    });
  }

  async doSetValues(
    trx: Transaction,
    targetType: CustomFieldTargetType,
    targetId: Id,
    fieldValues: CustomFieldValues,
    actorId: Id,
  ): Promise<SetValueResult> {
    if (!fieldValues || !Object.keys(fieldValues).length) {
      return;
    }

    const fieldNames = Object.keys(fieldValues);
    const promises = fieldNames.map(
      field => this.doSetValue(
        trx,
        targetType,
        targetId,
        field,
        fieldValues[field],
        actorId,
      )
    );

    const results = await Promise.all(promises);
    const failure = first(results.filter(r => r.status !== SetCustomFieldValueStatus.OK));
    if (failure) {
      // returns first failed custom property
      return failure;
    }
    return results[0];
  }

  async doSetValue(
    trx: Transaction,
    targetType: CustomFieldTargetType,
    targetId: Id,
    fieldName: string,
    value: any,
    actorId: Id,
  ): Promise<SetValueResult> {
    const connection = this.connection.getConnection();
    const result = {
      fieldName
    };
    const fieldDescriptor = this.parseFieldName(fieldName);

    if (!values(CustomFieldTargetType).includes(targetType)) {
      return {
        ...result,
        status: SetCustomFieldValueStatus.UNKNOWN_TARGET_TYPE,
      }
    }

    if (!fieldDescriptor) {
      return {
        ...result,
        status: SetCustomFieldValueStatus.CUSTOM_FIELD_FULLY_QUALIFIED_NAME_MALFORMED
      };
    }

    const extension = await this.extensionService.getExtensionByNamespace(
      fieldDescriptor.namespace, trx
    );

    if (!extension) {
      return {
        ...result,
        status: SetCustomFieldValueStatus.NAMESPACE_DOES_NOT_EXIST
      }
    }

    const customField = await this.getCustomFieldByName(
      extension.id,
      targetType,
      fieldDescriptor.name,
      trx
    )

    if (!customField) {
      return {
        ...result,
        status: SetCustomFieldValueStatus.CUSTOM_FIELD_DOES_NOT_EXIST
      };
    }
    const oldValueResult = await this.getValues(targetType, targetId, extension.namespace, trx);

    const queryParams = {
      targetType: connection.raw('?', targetType),
      targetId: connection.raw('?', targetId),
      fieldId: connection.raw('?', customField.id),
      value: connection.raw('?', this.jsonSerializer.toJson(value)),
    };

    const query = `INSERT INTO ${Table.EXTENSION_CUSTOM_FIELD_VALUE} `
      + '(target_type, target_id, field_id, value) VALUES '
      + '(:targetType:, :targetId:, :fieldId:, :value:) '
      + 'ON CONFLICT (target_type, target_id, field_id) DO UPDATE SET '
      + 'value = :value:'
      ;

    await trx.raw(query, queryParams);


    if (customField.generateActivities) {
      const oldValues = {}
      Object.keys(oldValueResult.values).forEach(namespace => {
        const fieldValues = oldValueResult.values[namespace]
        Object.keys(fieldValues).forEach(name => {
          const fqValueKey = `${namespace}.${name}`;
          oldValues[fqValueKey] = get(oldValueResult, `values.${fqValueKey}`);
        })
      })
      const changes: Changes = { new: { [fieldName]: value }, old: oldValues }

      const customTargetType: TargetType = CustomFieldTargetTypeMap[targetType];
      if (!customTargetType) {
        return {
          status: SetCustomFieldValueStatus.UNKNOWN_TARGET_TYPE,
          fieldName,
        }
      }

      await this.activityService.createActivityCustomFieldValueUpdate(
        actorId,
        customTargetType,
        targetId,
        changes,
        trx,
      )
    }

    return {
      ...result,
      status: SetCustomFieldValueStatus.OK
    };
  }

  parseFieldName(fieldName: string): FullyQualifiedCustomField {
    const parts = fieldName.split('.');
    if (parts.length !== 2) {
      return null;
    }

    return {
      namespace: parts[0],
      name: parts[1]
    }
  }

  async deleteRelation(namespace: ExtensionNamespace, relationName: string, pkFields: AnyDict | AnyDict[]) {
    return await this.performRelationUpdate(
      namespace,
      relationName,
      pkFields,
      'delete'
    )
  }

  async updateRelation(namespace: string, relationName: string, data: AnyDict | AnyDict[], trx?: Transaction): Promise<SetCustomRelationValueResult> {
    return await this.performRelationUpdate(
      namespace,
      relationName,
      data,
      'update',
      trx,
    )
  }

  async performRelationUpdate(
    namespace: string,
    relationName: string,
    fields: AnyDict | AnyDict[],
    operation: 'delete' | 'update',
    trx?: Transaction,
  ): Promise<SetCustomRelationValueResult> {
    this.logger.debug(`Updating custom relation [${relationName}] in namespace [${namespace}]`);
    fields = this.namingConverter.convert(fields);
    const extension = await this.extensionService.getExtensionByNamespace(namespace, trx);
    if (!extension) {
      return {
        status: SetCustomRelationValueStatus.NAMESPACE_DOES_NOT_EXIST,
        namespace
      }
    }

    const relationInstance = await this.extensionService.getRelationByName(extension.id, relationName, trx);

    if (!relationInstance) {
      return {
        status: SetCustomRelationValueStatus.CUSTOM_RELATION_DOES_NOT_EXIST,
        relation: relationName
      }
    }

    const tableName = this.customRelationSqlFactory.getFullyQualifiedTableName(extension, relationInstance);
    if (!tableName) {
      return {
        status: SetCustomRelationValueStatus.CUSTOM_RELATION_DOES_NOT_EXIST,
        relation: relationName
      }
    }
    // Updated relation MUST include all fields: PK and non-PK.
    // Non-PK fields will be updated on conflict.
    // PK fields will be used to identify relation row.
    const relationColumns = await this.extensionService.getRelationColumns(relationInstance, trx);

    this.logger.verbose(`relation schema: [${tableName}]`);

    const connection = trx || this.connection.getConnection()

    const query = operation === 'delete'
      ? this.customRelationSqlFactory.createRelationDeleteQuery(connection, tableName, relationColumns, fields)
      : this.customRelationSqlFactory.createRelationUpdateQuery(connection, tableName, relationColumns, fields)

    await connection.raw(query);

    return {
      status: SetCustomRelationValueStatus.OK
    }
  }

  async getAllExtensionsData(queryFields: AnyDict): Promise<GetExtensionsDataResult> {
    const extensions = await this.extensionService.getExtensions()
    const extensionIds = extensions.map(extension => extension.id)

    return this.getExtensionsData(extensionIds, queryFields)
  }

  async getExtensionsData(
    extensionIds: Id[],
    queryFields: AnyDict,
    trx?: Transaction,
  ): Promise<GetExtensionsDataResult> {
    queryFields = this.namingConverter.convert(queryFields);

    const extensions = await this.extensionService.getExtensionsByIds(extensionIds, trx)

    let extensionRelations: ExtensionRelation[] = []

    for (let i = 0; i < extensions.length; i++) {
      const extension = extensions[i]
      const relations = await this.extensionService.getRelationsByExtensionId(extension.id, trx)
      const relationsIds = relations.map(relation => relation.id)
      const relationsColumns = await this.extensionService.getRelationsColumns(relationsIds, trx);

      const extensionRelationsWithQueryFelds = relations.filter(relation => {
        const relationColumns = relationsColumns.filter(column => column.relationId === relation.id)
        const relationColumnsNames = relationColumns.map(column => column.name)
        const queryFieldsAbsentInRelation = Object.keys(queryFields).filter(key => !relationColumnsNames.includes(key))
        return queryFieldsAbsentInRelation.length === 0
      })

      extensionRelations = extensionRelations.concat(
        ...extensionRelationsWithQueryFelds.map(relation => this.getRelationDescriptor(extension, relation))
      )
    }

    const extensionsData: ExtensionsData = {}

    for (let i = 0; i < extensionRelations.length; i++) {
      const extensionRelation = extensionRelations[i]
      extensionsData[extensionRelation.tableName] = await this.getExtensionRelationData(extensionRelation, queryFields, trx)
    }

    return {
      status: GetExtensionsDataStatus.OK,
      values: extensionsData,
    }
  }

  async getRelationData(
    extensionNamespace: ExtensionNamespace,
    targetType: CustomFieldTargetType,
    targetId: Id,
  ): Promise<GetCustomRelationResult> {
    if (!extensionNamespace) {
      return {
        status: SetCustomRelationValueStatus.NAMESPACE_DOES_NOT_EXIST
      }
    }

    const extension = await this.extensionService.getExtensionByNamespace(extensionNamespace)

    if (!extension) {
      return {
        status: SetCustomRelationValueStatus.NAMESPACE_DOES_NOT_EXIST
      }
    }

    const extensionId = extension.id
    const relationTargetIdKey = this.getRelationTargetIdKey(targetType)
    const data = await this.getExtensionsData([extensionId], { [relationTargetIdKey]: [targetId] })
    return {
      status: SetCustomRelationValueStatus.OK,
      values: data.values,
    }
  }

  private getRelationTargetIdKey(targetType: CustomFieldTargetType): string {
    switch(targetType) {
      case CustomFieldTargetType.ORGANIZATION: {
        return 'organizationId'
      }
      case CustomFieldTargetType.PROJECT: {
        return 'projectId'
      }
      case CustomFieldTargetType.TASK: {
        return 'taskId'
      }
      case CustomFieldTargetType.TASK_LIST: {
        return 'taskListId'
      }
      case CustomFieldTargetType.USER_IN_ORGANIZATION: {
        return 'userInOrganizationId'
      }
      default: {
        return 'id'
      }
    }
  }

  private getRelationDescriptor(extension: ExtensionDbRow, relation: CustomRelationDbRow) {
    const tableName = this.customRelationSqlFactory.getFullyQualifiedTableName(extension, relation);
    return {
      namespace: extension.namespace,
      relationName: relation.name,
      tableName,
    }
  }

  private async getExtensionRelationData(extensionRelation: ExtensionRelation, queryFields: AnyDict, trx?: Transaction) {
    const qb = this.connection.getQueryWithTransaction(trx);
    let query = qb
      .select()
      .from(extensionRelation.tableName)

    Object.keys(queryFields).forEach(queryFieldKey => {
      query = query.whereIn(queryFieldKey, queryFields[queryFieldKey])
    })
    return await query
  }



  async getValues(
    targetType: CustomFieldTargetType,
    targetId: Id,
    namespace?: string,
    trx?: Transaction,
  ): Promise<GetValuesResult> {
    const qb = this.connection.getQueryWithTransaction(trx)
      .select(
        {
          'namespace': `${Table.EXTENSION}.namespace`,
          'name': `${Table.EXTENSION_CUSTOM_FIELD}.name`,
          'value': `${Table.EXTENSION_CUSTOM_FIELD_VALUE}.value`,
        }
      );
    const where = {
      targetId,
    };
    where[`${Table.EXTENSION_CUSTOM_FIELD_VALUE}.targetType`] = targetType;
    qb
      .from(Table.EXTENSION_CUSTOM_FIELD_VALUE)
      .join(Table.EXTENSION_CUSTOM_FIELD,
        `${Table.EXTENSION_CUSTOM_FIELD_VALUE}.field_id`,
        `${Table.EXTENSION_CUSTOM_FIELD}.id`)
      .join(Table.EXTENSION,
        `${Table.EXTENSION}.id`,
        `${Table.EXTENSION_CUSTOM_FIELD}.extension_id`
      )
      .where(where)
    ;

    if (namespace) {
      const extension = await this.extensionService.getExtensionByNamespace(namespace, trx);
      if (!extension) {
        return {
          status: GetCustomFieldValueStatus.NAMESPACE_DOES_NOT_EXIST
        }
      }

      qb.andWhere({
        extensionId: extension.id
      })
    }

    const results = await qb;

    const ret = results.reduce((acc, result: CustomFieldDbRow & CustomFieldValueDbRow & ExtensionDbRow) => {
      set(acc, `${result.namespace}.${result.name}`, result.value)
      return acc
    }, {})

    return {
      status: GetCustomFieldValueStatus.OK,
      values: ret
    };
  }

  async getValuesForTargetIds(
    targetType: CustomFieldTargetType,
    targetIds: Id[],
    namespace?: string,
    trx?: Transaction
  ): Promise<GetValuesForTargetIdsResult> {
    const qb = this.connection.getQueryWithTransaction(trx).select()
    const where = {};
    where[`${Table.EXTENSION_CUSTOM_FIELD_VALUE}.targetType`] = targetType;
    qb
      .from(Table.EXTENSION_CUSTOM_FIELD_VALUE)
      .join(Table.EXTENSION_CUSTOM_FIELD,
        `${Table.EXTENSION_CUSTOM_FIELD_VALUE}.field_id`,
        `${Table.EXTENSION_CUSTOM_FIELD}.id`)
      .where(where)
      .whereIn('targetId', targetIds)
    ;

    if (namespace) {
      const extension = await this.extensionService.getExtensionByNamespace(namespace, trx);
      if (!extension) {
        return {
          status: GetCustomFieldValueStatus.NAMESPACE_DOES_NOT_EXIST
        }
      }

      qb.andWhere({
        extensionId: extension.id
      })
    }

    const results = await qb;

    const ret = results.reduce((acc, result: CustomFieldDbRow & CustomFieldValueDbRow) => {
      set(acc, `${result.name}.${result.extensionId}.${result.targetId}`, result.value)
      return acc
    }, {})

    return {
      status: GetCustomFieldValueStatus.OK,
      values: ret
    };
  }

  async getCustomFieldByName(
    extensionId: Id,
    targetType: CustomFieldTargetType,
    name: string,
    trx?: Transaction,
  ): Promise<CustomFieldDbRow> {
    return await this.customFieldProvider.getCustomFieldByName(
      extensionId,
      targetType,
      name,
      trx,
    )
  }
}
