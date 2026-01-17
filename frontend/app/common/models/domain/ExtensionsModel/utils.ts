import { Map } from 'immutable';
import flatten from 'flat'
import { Id } from '../../../utils/identifier';
import { TargetType, FieldType, ExtensionNamespace, CustomFieldsMap } from './types';
import { AnyDict } from '../../../types';

const emptyMap = Map();

export function generateExtensionCustomFieldId(
  extensionId: Id,
  targetType: TargetType,
  targetId: Id,
  fieldType: FieldType
): string {
  return `${extensionId}:${targetType}:${targetId}:${fieldType}`;
}

export function generateExtensionCustomFieldKey(extensionNamespace: ExtensionNamespace, fieldType: FieldType): string {
  return `${extensionNamespace}.${fieldType}`;
}

export function getCustomFieldsMap(rawCustomFields: AnyDict, targetType: TargetType): CustomFieldsMap {
  let customFields = emptyMap;
  //@ts-ignore
  const flattenCustomFields = flatten(rawCustomFields);
  Object.keys(flattenCustomFields).forEach((flattenKey) => {
    const [fieldType, extensionId, targetId] = flattenKey.split('.');
    const fieldKey = generateExtensionCustomFieldId(extensionId, targetType, targetId, fieldType as FieldType);
    const value = flattenCustomFields[flattenKey];
    customFields = customFields.set(fieldKey, value);
  });
  return customFields;
}
