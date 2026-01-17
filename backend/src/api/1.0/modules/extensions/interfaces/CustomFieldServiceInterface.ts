import { CustomFieldDbRow, CustomFieldTargetType } from '../../db/schema'
import { Id } from '../../common/identifier'
import {
  CustomFieldValues,
  FullyQualifiedCustomField,
  GetValuesResult,
  SetCustomRelationValueResult,
  SetValueResult,
  GetValuesForTargetIdsResult,
  GetExtensionsDataResult, GetCustomRelationResult
} from '../types'

import { AnyDict } from '../../common/types'

export interface CustomFieldServiceInterface {
  setValues(
    targetType: CustomFieldTargetType,
    targetId: Id,
    fieldValues: CustomFieldValues,
    actorId: Id,
  ): PromiseLike<SetValueResult>;

  setValue(
    targetType: CustomFieldTargetType,
    targetId: Id,
    fqName: string,
    value: any,
    actorId: Id,
  ): PromiseLike<SetValueResult>;

  doSetValue(
    trx: Transaction,
    targetType: CustomFieldTargetType,
    targetId: Id,
    fqName: string,
    value: any,
    actorId: Id,
  ): PromiseLike<SetValueResult>;

  parseFieldName(fieldName: string): FullyQualifiedCustomField

  updateRelation(namespace: string, relation: string, data: AnyDict | AnyDict[], trx?: Transaction): PromiseLike<SetCustomRelationValueResult>;

  /**
   * Returns map of custom field names => value for given target.
   * If namespace is provided, then only values filtered to that namespace are returned.
   *
   * @param targetType
   * @param targetId
   * @param namespace
   */
  getValues(
    targetType: CustomFieldTargetType,
    targetId: Id,
    namespace?: string,
    trx?: Transaction,
  ): PromiseLike<GetValuesResult>;

  getValuesForTargetIds(
    targetType: CustomFieldTargetType,
    targetIds: Id[],
    namespace?: string,
    trx?: Transaction
  ): PromiseLike<GetValuesForTargetIdsResult>;

  getCustomFieldByName(extensionId: Id, targetType: CustomFieldTargetType, name: string, trx?: Transaction): PromiseLike<CustomFieldDbRow>

  deleteRelation(namespace: string, relationName: string, pkFields: AnyDict | AnyDict[]): PromiseLike<SetCustomRelationValueResult>

  getRelationData(
    extensionNamespace: string,
    targetType: CustomFieldTargetType,
    targetId: Id,
  ): Promise<GetCustomRelationResult>

  getExtensionsData(extensionIds: Id[], queryFields: AnyDict, trx?: Transaction): PromiseLike<GetExtensionsDataResult>

  getAllExtensionsData(queryFields: AnyDict): PromiseLike<GetExtensionsDataResult>
}
