import { createSelector } from 'reselect';
import * as ExtensionsModelConstants from '../constants';
import generateSelectorName from '../../../../utils/generateSelectorName';
import createCachedSelector from 're-reselect';
import createImmutableEqualSelector from '../../../../utils/createImmutableEqualSelector';

import { Map } from 'immutable';
import getEnabledStatusField from '../constants/getEnabledStatusField';
import { generateExtensionCustomFieldId } from '../utils';
import { TargetType, EnabledStatus, ExtensionNamespace, ExtensionInterface } from '../types';
import { Id } from '../../../../utils/identifier';
import { AnyDict } from '../../../../types';

const emptyMap = Map();

export const selectExtensionsModelDomain = (state) => state.get(ExtensionsModelConstants.domain);

export const selectExtensionsDataDomain = createSelector(
  selectExtensionsModelDomain,
  (domain) => domain.get('extensionsData') as Map<Id, ExtensionInterface>
);

export const selectIsExtensionEnabledForSpaceDomain = createSelector(
  selectExtensionsModelDomain,
  (domain) => domain.get('isExtensionEnabledForSpace') as Map<Id, boolean>
);

export const selectIsExtensionEnabledForOrganizationDomain = createSelector(
  selectExtensionsModelDomain,
  (domain) => domain.get('isExtensionEnabledForOrganization') as Map<Id, Map<Id, boolean>>
);

export const selectCustomFieldsDomain = createSelector(
  selectExtensionsModelDomain,
  (domain) => domain.get('customFields') as AnyDict
);

// extensionId
export const selectExtension = createCachedSelector(
  selectExtensionsDataDomain,
  (_, args) => args.extensionId,
  (extensionsData, extensionId) => extensionsData.get(extensionId)
)((_, args) => generateSelectorName(args, ['extensionId']));

export const selectExtensionNames = createSelector(selectExtensionsDataDomain, (extensionsData) =>
  extensionsData.map((extension) => extension.name)
);

// extensionId
export const selectExtensionName = createCachedSelector(selectExtension, (extension) =>
  extension ? extension.name : null
)((_, args) => generateSelectorName(args, ['extensionId']));

// extensionId
export const selectExtensionDescription = createCachedSelector(selectExtension, (extension) =>
  extension ? extension.description : null
)((_, args) => generateSelectorName(args, ['extensionId']));

// extensionId
export const selectExtensionThumbnailUrl = createCachedSelector(selectExtension, (extension) =>
  extension ? extension.thumbnailUrl : null
)((_, args) => generateSelectorName(args, ['extensionId']));

// extensionId
export const selectExtensionNamespace = createCachedSelector(selectExtension, (extension) =>
  extension ? extension.namespace : null
)((_, args) => generateSelectorName(args, ['extensionId']));

export const selectExtensionIds = createImmutableEqualSelector(selectExtensionsDataDomain, (extensionsData) =>
  extensionsData.keySeq().toList()
);

// args: type
export const selectExtensionIdsByType = createCachedSelector(
  selectExtensionsDataDomain,
  (_, args) => args.type,
  (extensionsData, type) =>
    extensionsData
      .valueSeq()
      .toList()
      .filter((extension) => extension.type === type && extension.isInMarketplace)
      .map((extension) => extension.id)
)((_, args) => generateSelectorName(args, ['type']));

// args: organizationId, extensionId
export const selectIsExtensionEnabledForOrganization = createCachedSelector(
  selectIsExtensionEnabledForOrganizationDomain,
  (_, args) => args.extensionId,
  (_, args) => args.organizationId,
  (isExtensionEnabledForOrganizationMap, extensionId, organizationId) =>
    isExtensionEnabledForOrganizationMap.getIn([organizationId, extensionId])
)((_, args) => generateSelectorName(args, ['extensionId', 'organizationId']));

export const selectExtensionIdsByNamespaces = createImmutableEqualSelector(
  selectExtensionsDataDomain,
  (extensionsData) => {
    let extensionIdsByNamespaces = emptyMap;
    extensionsData.forEach((extension, extensionId) => {
      extensionIdsByNamespaces = extensionIdsByNamespaces.set(extension.namespace, extensionId);
    });
    return extensionIdsByNamespaces as Map<ExtensionNamespace, Id>;
  }
);

// args: extensionNamespace
export const selectExtensionIdByNamespace = createCachedSelector(
  selectExtensionIdsByNamespaces,
  (_, args) => args.extensionNamespace,
  (extensionIdsByNamespaces, extensionNamespace) => extensionIdsByNamespaces.get(extensionNamespace)
)((_, args) => generateSelectorName(args, ['extensionNamespace']));

// args: organizationId, extensionNamespace
export const selectIsExtensionEnabledInOrganization = createCachedSelector(
  selectIsExtensionEnabledForOrganizationDomain,
  selectExtensionIdByNamespace,
  (_, args) => args.organizationId,
  (enabledExtensionsInOrganization, extensionId, organizationId) =>
    enabledExtensionsInOrganization.getIn([organizationId, extensionId])
)((_, args) => generateSelectorName(args, ['extensionNamespace', 'organizationId']));

// args: organizationId, extensionNamespace
export const selectIsExtensionEnabledForAllSpaces = createCachedSelector(
  selectCustomFieldsDomain,
  selectExtensionIdByNamespace,
  (_, args) => args.extensionNamespace,
  (_, args) => args.organizationId,
  (customFields, extensionId, extensionNamespace, organizationId) => {
    const organizationFieldType = getEnabledStatusField(extensionNamespace, TargetType.ORGANIZATION);
    const organizationFieldKey = generateExtensionCustomFieldId(
      extensionId,
      TargetType.ORGANIZATION,
      organizationId,
      organizationFieldType
    );
    const extensionEnabledStatus = customFields.get(organizationFieldKey);

    return extensionEnabledStatus === EnabledStatus.ENABLE_FOR_ALL_SPACES;
  }
)((_, args) => generateSelectorName(args, ['extensionNamespace', 'organizationId']));

// args: organizationId, projectId, extensionNamespace
export const selectIsExtensionEnabled = createCachedSelector(
  selectIsExtensionEnabledInOrganization,
  selectExtensionIdByNamespace,
  selectCustomFieldsDomain,
  (_, args) => args.extensionNamespace,
  (_, args) => args.organizationId,
  (_, args) => args.projectId,
  (isExtensionEnabledInOrganization, extensionId, customFields, extensionNamespace, organizationId, projectId) => {
    if (!isExtensionEnabledInOrganization) {
      return false;
    }
    const organizationFieldType = getEnabledStatusField(extensionNamespace, TargetType.ORGANIZATION);
    const organizationFieldKey = generateExtensionCustomFieldId(
      extensionId,
      TargetType.ORGANIZATION,
      organizationId,
      organizationFieldType
    );

    const projectFieldType = getEnabledStatusField(extensionNamespace, TargetType.PROJECT);
    const projectFieldKey = generateExtensionCustomFieldId(
      extensionId,
      TargetType.PROJECT,
      projectId,
      projectFieldType
    );

    const extensionEnabledStatus = customFields.get(organizationFieldKey);
    const isExtensionEnabledInSpace = customFields.get(projectFieldKey);

    return (
      !extensionEnabledStatus ||
      extensionEnabledStatus === EnabledStatus.ENABLE_FOR_ALL_SPACES ||
      isExtensionEnabledInSpace
    );
  }
)((_, args) => generateSelectorName(args, ['extensionNamespace', 'organizationId', 'projectId']));

// args: extensionNamespace, targetType, targetId, fieldType
export const selectCustomFieldValue = createCachedSelector(
  selectCustomFieldsDomain,
  selectExtensionIdByNamespace,
  (_, args) => args.targetType,
  (_, args) => args.targetId,
  (_, args) => args.fieldType,
  (customFields, extensionId, targetType, targetId, fieldType) =>
    customFields.get(generateExtensionCustomFieldId(extensionId, targetType, targetId, fieldType))
)((_, args) => generateSelectorName(args, ['extensionNamespace', 'targetType', 'targetId', 'fieldType']));
