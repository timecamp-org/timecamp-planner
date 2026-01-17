import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import * as IntegrationsModelConstants from './constants'
import generateSelectorName from '../../../utils/generateSelectorName'
import * as IntegrationStatus from './constants/integrationStatus'
import { selectCurrentUserId } from '../UsersModel/selectors/domain'
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain'
import { generateIntegrationId } from '../../../utils/generateCombinedId'

const completedIntegrationStatuses = [IntegrationStatus.SUCCESS, IntegrationStatus.FAILURE]

export const selectIntegrationsModelDomain = (state) => state.get(IntegrationsModelConstants.domain)

export const selectIntegrations = createSelector(
  selectIntegrationsModelDomain,
  (domain) => domain.get('integrationsData'),
)

export const selectIntegrationIds = createSelector(
  selectIntegrations,
  (integrations) => integrations.keySeq().toList(),
)

export const selectCompletedNotConfirmedIntegrations = createSelector(
  selectIntegrations,
  (integrations) => integrations
    .valueSeq()
    .toList()
    .filter(integration => !integration.get('userConfirmedStatus') && completedIntegrationStatuses.includes(integration.get('status'))),
)

// args: extensionId
export const selectIntegration = createCachedSelector(
  selectIntegrations,
  selectCurrentUserId,
  selectCurrentOrganizationId,
  (_, args) => args.extensionId,
  (integrations, userId, organizationId, extensionId) => {
    const integrationId = generateIntegrationId(userId, organizationId, extensionId)
    return integrations.get(integrationId)
  },
)
  (
    (_, args) => generateSelectorName(args, ['extensionId']),
  )

// args: extensionId
export const selectIsIntegrationInProgress = createCachedSelector(
  selectIntegration,
  (integration) => integration && integration.get('status') === IntegrationStatus.IN_PROGRESS,
)
  (
    (_, args) => generateSelectorName(args, ['extensionId']),
  )

// args: extensionId
export const selectIsIntegrationSuccessful = createCachedSelector(
  selectIntegration,
  (integration) => integration && integration.get('status') === IntegrationStatus.SUCCESS,
)
  (
    (_, args) => generateSelectorName(args, ['extensionId']),
  )
