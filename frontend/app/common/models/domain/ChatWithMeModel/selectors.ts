import { createSelector } from 'reselect'
import { domain } from './constants'
import { ChatWithMeState } from './types';
import { selectIsCurrentUserOrganizationGuest, selectCurrentUserInOrganizationId } from '../OrganizationsModel/selectors';
import { selectCustomFieldsDomain, selectExtensionIdsByNamespaces } from '../ExtensionsModel/selectors/domain';
import { selectCurrentUserAssignedProjectIds } from '../ProjectsModel/selectors';
import { ExtensionNamespace, TargetType, FieldType } from '../ExtensionsModel/types';
import { generateExtensionCustomFieldId } from '../ExtensionsModel/utils';

/**
 * Direct selector to the projectsTree state domain
 */
export const selectChatWithMeDomain = (state) => state.get(domain) as ChatWithMeState

/**
 * Other specific selectors
 */

export const selectInvitationUserId = createSelector(
  selectChatWithMeDomain,
  (domain) => domain.get('userId'),
)

export const selectInvitationOrganizationId = createSelector(
  selectChatWithMeDomain,
  (domain) => domain.get('organizationId'),
)

export const selectInvitationOrganizationName = createSelector(
  selectChatWithMeDomain,
  (domain) => domain.get('organizationName'),
)

export const selectInvitationToken = createSelector(
  selectChatWithMeDomain,
  (domain) => domain.get('token'),
)

export const selectIsCurrentUserOrganizationGuestInvitedByLink = createSelector(
  selectIsCurrentUserOrganizationGuest,
  selectCustomFieldsDomain,
  selectExtensionIdsByNamespaces,
  selectCurrentUserInOrganizationId,
  selectCurrentUserAssignedProjectIds,
  (
    isOrganizationGuest,
    customFields,
    extensionIdsByNamespaces,
    currentUserInOrganizationId,
    assignedProjectIds,
  ) => {
    const extensionId = extensionIdsByNamespaces.get(ExtensionNamespace.CHAT_WITH_ME)
    let inviterId = customFields.get(generateExtensionCustomFieldId(extensionId, TargetType.USER_IN_ORGANIZATION, currentUserInOrganizationId, FieldType.INVITER_ID))
    return isOrganizationGuest && inviterId && assignedProjectIds.size === 0
  }
)
