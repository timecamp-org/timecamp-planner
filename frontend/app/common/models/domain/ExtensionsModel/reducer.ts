import { fromJS } from 'immutable'
import * as ExtensionsModelConstants from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import * as ProjectModelConstants from '../ProjectsModel/constants'
import { generateExtensionCustomFieldId } from './utils'
import { Reducer } from 'redux';
import { ExtensionsState } from './types';
import { PayloadAction } from '../../../types';

// export initial state for testing
export const initialState: ExtensionsState = fromJS({
  extensionsData: {
  },
  isExtensionEnabledForOrganization: {
  },
  customFields: {
  },
})

const extensionsReducer: Reducer<ExtensionsState, PayloadAction> = (state: ExtensionsState = initialState, action: PayloadAction): ExtensionsState => {
  switch (action.type) {
    case ExtensionsModelConstants.onSetIsExtensionEnabledForOrganizationSuccess: {
      const { extensionId, organizationId, isEnabled } = action.payload.data
      return state.setIn(['isExtensionEnabledForOrganization', organizationId, extensionId], isEnabled)
    }

    case ExtensionsModelConstants.onFetchOrganizationExtensionsSuccess: {
      const { organizationExtensions, isExtensionEnabledForOrganization } = action.payload.data
      return state.set('extensionsData', organizationExtensions)
        .set('isExtensionEnabledForOrganization', isExtensionEnabledForOrganization)
    }

    case ExtensionsModelConstants.onUpdateExtensionInOrganizationData: {
      const { organizationId, extensionId, isEnabled } = action.payload
      return state.setIn(['isExtensionEnabledForOrganization', organizationId, extensionId], isEnabled)
    }

    case ExtensionsModelConstants.onSetExtensionCustomFieldValue: {
      const { extensionId, targetType, targetId, fieldType, value } = action.payload
      const targetKey = generateExtensionCustomFieldId(extensionId, targetType, targetId, fieldType)
      return state.setIn(['customFields', targetKey], value)
    }

    case ExtensionsModelConstants.onBatchCustomFieldValues:
    case ProjectModelConstants.onGetOrganizationProjectsSuccess: {
      const { customFields } = action.payload
      return state.set('customFields', state.get('customFields').mergeDeep(customFields))
    }

    case ExtensionsModelConstants.onUpdateExtensionCustomFieldValue: {
      const { targetType, targetId, extensionId, value, name } = action.payload
      const targetKey = generateExtensionCustomFieldId(extensionId, targetType, targetId, name)
      return state.setIn(['customFields', targetKey], value)
    }

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default:
      return state
  }
}

export default extensionsReducer
