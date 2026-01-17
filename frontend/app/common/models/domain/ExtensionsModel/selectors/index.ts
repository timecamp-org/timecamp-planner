import createCachedSelector from 're-reselect';
import { selectAvailableSpacesIds } from '../../ProjectsModel/selectors';
import {
  selectCustomFieldsDomain,
  selectExtensionNamespace,
  selectExtensionsDataDomain,
  selectIsExtensionEnabledForOrganizationDomain,
} from './domain';

import { Map } from 'immutable';
import { TargetType } from '../types';
import getEnabledStatusField from '../constants/getEnabledStatusField';
import { generateExtensionCustomFieldId } from '../utils';
import generateSelectorName from '../../../../utils/generateSelectorName';
import { createSelector } from 'reselect';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';

const emptyMap = Map();

// args: extensionId
export const selectIsExtensionEnabledForOrganizationSpaces = createCachedSelector(
  selectAvailableSpacesIds,
  selectCustomFieldsDomain,
  selectExtensionNamespace,
  (_, args) => args.extensionId,
  (availableSpacesIds, customFields, extensionNamespace, extensionId) => {
    let spaceIdIsExtensionEnabledMap = emptyMap;
    const fieldType = getEnabledStatusField(extensionNamespace, TargetType.PROJECT);
    if (!fieldType) {
      return spaceIdIsExtensionEnabledMap;
    }
    availableSpacesIds.forEach((spaceId) => {
      const fullKey = generateExtensionCustomFieldId(extensionId, TargetType.PROJECT, spaceId, fieldType);
      const isEnabledInSpace = customFields.get(fullKey);
      spaceIdIsExtensionEnabledMap = spaceIdIsExtensionEnabledMap.set(spaceId, isEnabledInSpace);
    });
    return spaceIdIsExtensionEnabledMap;
  }
)((_, args) => generateSelectorName(args, ['extensionId']));

export const selectCurrentlyEnabledExtensionsString = createSelector(
  selectExtensionsDataDomain,
  selectIsExtensionEnabledForOrganizationDomain,
  selectCurrentOrganizationId,
  (extensionsData, extensionsEnabledForOrganizationDomain, organizationId) => {
    const extensionsInOrganization = extensionsEnabledForOrganizationDomain.get(organizationId) || emptyMap;
    const enabledExtensionIds = extensionsInOrganization.entrySeq().reduce((acc, [extensionId, isEnabled]) => {
      if (isEnabled) {
        acc.push(extensionId);
      }
      return acc;
    }, []);

    let extensionNames = enabledExtensionIds.reduce((acc, extensionId) => {
      const extensionName = extensionsData.get(extensionId)?.name;
      acc += `${extensionName},`;
      return acc;
    }, '');

    if (extensionNames.length) {
      extensionNames = extensionNames.substring(0, extensionNames.length - 1);
    }

    return extensionNames;
  }
);
