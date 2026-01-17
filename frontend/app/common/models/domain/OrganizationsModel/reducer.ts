import { fromJS, List, Map } from 'immutable'
import * as OrganizationsConstants from './constants/index'
import * as CurrentUserConstants from '../CurrentUserModel/constants'

import { EntityStatus } from '../EntityModel/types'
import { OrganizationsState } from './types';
import { Reducer } from 'redux';
import { PayloadAction } from '../../../types';
import { OnPurgeUsersInOrganizationPayload } from './payloads';
import { updateListWithNewItem } from 'common/utils/immutableUtils';
import { Id } from 'common/utils/identifier';

const emptyList = List()
const emptyMap = Map()

const initialState: OrganizationsState = fromJS({
  currentOrganizationId: undefined,
  organizationsData: {

  },
  organizationsPeople: {

  },
  organizationsPeopleRole: {

  },
  organizationPeopleStatus: {

  },
  userInOrganizationIds: {

  },
  userInvitationLinks: {

  },
  openedReactivateUserModalId: null,
})

const reducer: Reducer<OrganizationsState, PayloadAction> = (state: OrganizationsState = initialState, action: PayloadAction): OrganizationsState => {
  switch (action.type) {
    case OrganizationsConstants.onRegisterOrganizationSuccess:
      {
        const { organizationId, organization, userId } = action.payload.data
        return state
          .updateIn(['organizationsPeople', organizationId], list => {
            if (!list) {
              return List([userId])
            } else {
              return list.indexOf(userId) === -1 ? list.unshift(userId) : list
            }
          })
          .setIn(['organizationsData', organizationId], organization)
      }
    case OrganizationsConstants.onSetCurrentOrganizationId:
      return state.set('currentOrganizationId', action.payload.organizationId)
    case OrganizationsConstants.onSwitchOrganization:
      return state.set('currentOrganizationId', action.payload.organizationId)

    case OrganizationsConstants.onBatchOrganizationsData:
      return state.set('organizationsData', state.get('organizationsData').merge(action.payload.organizations))
    case OrganizationsConstants.onCreateOrganizationData:
    case OrganizationsConstants.onUpdateOrganizationData:
      const { organizationData } = action.payload
      return state.setIn(['organizationsData', organizationData.id], organizationData)

    case OrganizationsConstants.onBatchOrganizationsPeople:
      const { organizationId, organizationPeople } = action.payload
      return state.setIn(['organizationsPeople', organizationId], organizationPeople)

    case OrganizationsConstants.onCreateUserInOrganizationData: {
      const { userId, organizationId, organization, userInOrganization } = action.payload
      let newState = state.updateIn(['organizationsPeople', organizationId], list => {
        if (!list) {
          return List([userId])
        } else {
          return list.indexOf(userId) === -1 ? list.unshift(userId) : list
        }
      })
        .setIn(['organizationsPeopleRole', organizationId, userId], userInOrganization.role)
        .setIn(['organizationPeopleStatus', organizationId, userId], userInOrganization.entityStatus)
        .setIn(['userInOrganizationIds', organizationId, userId], userInOrganization.id)

      if (organization) {
        newState = newState.setIn(['organizationsData', organizationId], organization)
      }

      return newState
    }

    case OrganizationsConstants.onPurgeUsersInOrganizationData: {
      const { organizationId, currentUserId } = action.payload as OnPurgeUsersInOrganizationPayload
      const currentOrganizationUserRole = state.getIn(['organizationsPeopleRole', organizationId, currentUserId])
      const currentOrganizationUserStatus = state.getIn(['organizationPeopleStatus', organizationId, currentUserId])
      const currentUserInOrganizationId = state.getIn(['userInOrganizationIds', organizationId, currentUserId])
      return state
        .set('organizationsPeople', emptyMap.set(organizationId, List([currentUserId])))
        .set('organizationsPeopleRole', emptyMap.setIn([organizationId, currentUserId], currentOrganizationUserRole))
        .set('organizationPeopleStatus', emptyMap.setIn([organizationId, currentUserId], currentOrganizationUserStatus))
        .set('userInOrganizationIds', emptyMap.setIn([organizationId, currentUserId], currentUserInOrganizationId))
    }

    case OrganizationsConstants.onUpdateUserInOrganizationDataSuccess: {
      const { userId, organizationId, userInOrganization, organization } = action.payload
      let newState = state
        .updateIn(['organizationsPeople', organizationId], updateListWithNewItem<Id>(userId))
        .setIn(['organizationsPeopleRole', organizationId, userId], userInOrganization.role)
        .setIn(['organizationPeopleStatus', organizationId, userId], userInOrganization.entityStatus)
        .setIn(['userInOrganizationIds', organizationId, userId], userInOrganization.id)

      if (organization) {
        newState = newState.setIn(['organizationsData', organizationId], organization)
      }

      return newState
    }

    case OrganizationsConstants.onUpdateWorkspaceSuccess: {
      const { organizationId, name } = action.payload
      return state.setIn(['organizationsData', organizationId, 'name'], name)
    }

    case OrganizationsConstants.onUpdateWorkspace: {
      const { organizationId, fields } = action.payload
      return state.mergeIn(['organizationsData', organizationId], fields)
    }

    case OrganizationsConstants.onDeleteUserInOrganizationData: {
      const { userId, organizationId } = action.payload
      return state.updateIn(['organizationsPeople', organizationId], list => (list ? list.filter(id => id !== userId) : emptyList))
    }

    case OrganizationsConstants.onFetchOrganizationPeopleSuccess: {
      const { organizationPeopleRole, organizationPeopleStatus, userInOrganizationIds, organizationId } = action.payload.data
      return state
        .setIn(['organizationsPeopleRole', organizationId], organizationPeopleRole)
        .setIn(['organizationPeopleStatus', organizationId], organizationPeopleStatus)
        .setIn(['userInOrganizationIds', organizationId], userInOrganizationIds)
    }

    case OrganizationsConstants.onDeactivateUserFromOrganizationSuccess: {
      const { userId, organizationId } = action.payload
      return state
        .setIn(['organizationPeopleStatus', organizationId, userId], EntityStatus.DELETED)
    }

    case OrganizationsConstants.onDeactivateUserFromOrganizationFailure: {
      const { userId, organizationId } = action.payload
      return state
        .setIn(['organizationPeopleStatus', organizationId, userId], EntityStatus.EXISTS)
    }

    case OrganizationsConstants.onReactivateUserFromOrganizationSuccess: {
      const { userId, organizationId } = action.payload
      return state
        .setIn(['organizationPeopleStatus', organizationId, userId], EntityStatus.EXISTS)
    }

    case OrganizationsConstants.onReactivateUserFromOrganizationFailure: {
      const { userId, organizationId } = action.payload
      return state
        .setIn(['organizationPeopleStatus', organizationId, userId], EntityStatus.DELETED)
    }

    case OrganizationsConstants.onSetOpenedReactivateUserModalId: {
      const { openedReactivateUserModalId } = action.payload
      return state.set('openedReactivateUserModalId', openedReactivateUserModalId)
    }

    case OrganizationsConstants.onSetUserInvitationLink: {
      const { userId, link } = action.payload
      return state.setIn(['userInvitationLinks', userId], link)
    }

    case OrganizationsConstants.onSetUserRole: {
      const { userId, organizationId, role } = action.payload
      return state.setIn(['organizationsPeopleRole', organizationId, userId], role)
    }

    case OrganizationsConstants.onFetchCurrentUserOrganizationRolesSuccess: {
      const { organizationsPeopleRole } = action.payload
      return state.set('organizationsPeopleRole', state.get('organizationsPeopleRole').mergeDeep(organizationsPeopleRole))
    }

    case OrganizationsConstants.onSetCurrentUserInOrganizationId: {
      const { userId, organizationId, userInOrganizationId } = action.payload
      return state.setIn(['userInOrganizationIds', organizationId, userId], userInOrganizationId)
    }

    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default:
      return state
  }
}

export default reducer
