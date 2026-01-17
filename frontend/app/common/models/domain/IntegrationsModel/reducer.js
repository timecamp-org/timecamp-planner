import { fromJS } from 'immutable'
import * as IntegrationsModelConstants from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { generateIntegrationId } from '../../../utils/generateCombinedId'

// export initial state for testing
export const initialState = fromJS({
  integrationsData: {},
})

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case IntegrationsModelConstants.onBatchIntegrations: {
      let newState = state
      action.integrations.forEach(integration => {
        const userId = integration.get('userId')
        const organizationId = integration.get('organizationId')
        const extensionId = integration.get('extensionId')
        const integrationId = generateIntegrationId(userId, organizationId, extensionId)
        newState = newState.setIn(['integrationsData', integrationId], integration)
      })

      return newState
    }

    case IntegrationsModelConstants.onCreateIntegration:
    case IntegrationsModelConstants.onUpdateIntegration: {
      const { integration } = action
      const userId = integration.get('userId')
      const organizationId = integration.get('organizationId')
      const extensionId = integration.get('extensionId')
      const integrationId = generateIntegrationId(userId, organizationId, extensionId)

      return state.setIn(['integrationsData', integrationId], action.integration)
    }

    case IntegrationsModelConstants.onConfirmIntegrationsStatusSuccess: {
      let newState = state
      action.extensionIds.forEach(extensionId => {
        const { userId, organizationId } = action
        const integrationId = generateIntegrationId(userId, organizationId, extensionId)
        newState = newState.setIn(['integrationsData', integrationId, 'userConfirmedStatus'], true)
      })

      return newState
    }

    case IntegrationsModelConstants.onSetIntegrationStatus: {
      // eslint-disable-next-line object-curly-newline
      const { userId, organizationId, extensionId, status } = action
      const integrationId = generateIntegrationId(userId, organizationId, extensionId)

      return state.setIn(['integrationsData', integrationId, 'status'], status)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default:
      return state
  }
}
