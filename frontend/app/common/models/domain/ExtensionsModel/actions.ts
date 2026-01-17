import * as C from './constants'
import { EntityStatus, EntityInterface } from '../EntityModel/types'
import { action } from 'typesafe-actions'
import { Id } from '../../../utils/identifier';
import { ActionResultInterface } from '../ActionResultModel';
import { EnabledStatus, TargetType, FieldType, CustomFieldsMap, ExtensionNamespace } from './types';
import { PayloadAction } from 'common/types'
import {
  OnFetchCustomRelationPayload,
} from 'models/domain/ExtensionsModel/payloads'

export const onInit = () => action(C.onInit)

export const onSetIsExtensionEnabledForOrganization = (extensionId: Id, organizationId: Id, isEnabled: boolean) =>
  action(C.onSetIsExtensionEnabledForOrganization, { extensionId, organizationId, isEnabled })

export const onSetIsExtensionEnabledForOrganizationSuccess = (actionResult: ActionResultInterface) =>
  action(C.onSetIsExtensionEnabledForOrganizationSuccess, actionResult)

export const onSetIsExtensionEnabledForSpace = (extensionId: Id, spaceId: Id, isEnabled: boolean) =>
  action(C.onSetIsExtensionEnabledForSpace, { extensionId, spaceId, isEnabled })

export const onSetExtensionEnabledStatus = (extensionId: Id, organizationId: Id, enabledStatus: EnabledStatus) =>
  action(C.onSetExtensionEnabledStatus, { extensionId, organizationId, enabledStatus })

export const onFetchOrganizationExtensions = (extensionNamespaces: ExtensionNamespace[] = []) =>
  action(
    C.onFetchOrganizationExtensions,
    {
      extensionNamespaces,
    },
  )

export const onFetchOrganizationExtensionsSuccess = (actionResult: ActionResultInterface) =>
  action(C.onFetchOrganizationExtensionsSuccess, actionResult)

export const onUpdateExtensionInOrganizationData = (wrappedEntity: EntityInterface) => {
  const { organizationId, extensionId, status } = wrappedEntity.body
  return action(C.onUpdateExtensionInOrganizationData, {
    organizationId,
    extensionId,
    isEnabled: status === EntityStatus.EXISTS,
  })
}

export const onUpdateExtensionCustomFieldValue = (wrappedEntity: EntityInterface) =>
  action(C.onUpdateExtensionCustomFieldValue, wrappedEntity.body)

export const onSetExtensionCustomFieldValue = (extensionId: Id, targetType: TargetType, targetId: Id, fieldType: FieldType, value: string, showAlert: boolean = false) =>
  action(C.onSetExtensionCustomFieldValue, { extensionId, targetType, targetId, fieldType, value, showAlert })

export const onBatchCustomFieldValues = (customFields: CustomFieldsMap) =>
  action(C.onBatchCustomFieldValues, { customFields })

export const onFetchCustomFields = (targetType: TargetType, targetId: Id) =>
  action(C.onFetchCustomFields, { targetType, targetId })

export const onFetchCustomRelation = (
  namespace: ExtensionNamespace,
  targetType: TargetType,
  targetId: Id,
): PayloadAction<OnFetchCustomRelationPayload> =>
  action(C.onFetchCustomRelation, {
    namespace,
    targetType,
    targetId,
  })
