import * as Constants from './constants'
import { fromJS, Map } from 'immutable'
import { Reducer } from 'redux'
import { PayloadAction } from 'common/types'
import { PersonalProjectStructureState } from './types'
import {
  OnUpdateGroupPayload,
  OnCreateProjectGroupSuccessPayload,
  OnUpdateGrouplessProjectOrdersPayload,
  OnUpdateProjectOrdersInGroupPayload,
  OnBatchProjectGroupsPayload,
  OnBatchProjectOrdersInGroupPayload,
  OnDeleteProjectGroupPayload
} from './payloads'
import * as AppModelConstants from '../AppModel/constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'

const emptyMap = Map()

const initialState: PersonalProjectStructureState = fromJS({
  groupsData: {
  },
  projectOrderByGroupId: {

  },
  projectOrderWithoutGroup: {

  }
})

const personalProjectStructureReducer: Reducer<PersonalProjectStructureState, PayloadAction> = (state = initialState, action) => {
  switch (action.type) {
    case Constants.onUpdateProjectGroup: {
      const { fields, groupId }: OnUpdateGroupPayload = action.payload
      return state.mergeIn(['groupsData', groupId], fields)
    }
    case Constants.onBatchProjectGroups: {
      const { projectGroups }: OnBatchProjectGroupsPayload = action.payload
      return state.set('groupsData', state.get('groupsData').mergeDeep(projectGroups))
    }
    case Constants.onDeleteProjectGroup: {
      const { groupId }: OnDeleteProjectGroupPayload = action.payload
      return state.deleteIn(['groupsData', groupId])
    }
    case Constants.onBatchProjectOrdersInGroup: {
      const { projectOrdersInGroup }: OnBatchProjectOrdersInGroupPayload = action.payload
      return state.set('projectOrderByGroupId', projectOrdersInGroup)
    }
    case Constants.onCreateProjectGroupData:
    case Constants.onCreateProjectGroupSuccess: {
      const { projectGroup }: OnCreateProjectGroupSuccessPayload = action.payload
      return state.setIn(['groupsData', projectGroup.id], projectGroup)
    }
    case Constants.onUpdateGrouplessProjectOrders: {
      const { projectOrders }: OnUpdateGrouplessProjectOrdersPayload = action.payload
      return state.set('projectOrderWithoutGroup', projectOrders)
    }
    case Constants.onUpdateProjectOrdersInGroup: {
      const { groupId, projectOrders }: OnUpdateProjectOrdersInGroupPayload = action.payload
      return state.setIn(['projectOrderByGroupId', groupId], projectOrders)
    }
    case Constants.onUpdateProjectGroupData: {
      const { projectGroup } = action.payload
      return state.mergeIn(['groupsData', projectGroup.id], projectGroup)
    }
    case Constants.onDeleteProjectGroupData: {
      const { id } = action.payload
      return state.deleteIn(['groupsData', id])
    }
    case Constants.onCreatePersonalProjectOrderData:
    case Constants.onUpdatePersonalProjectOrderData: {
      const { projectOrder } = action.payload
      return state.setIn(['projectOrderWithoutGroup', projectOrder.projectId], projectOrder.order)
    }
    case Constants.onDeletePersonalProjectOrderData: {
      const { projectId } = action.payload
      return state.deleteIn(['projectOrderWithoutGroup', projectId])
    }
    case Constants.onCreateProjectInGroupData: {
      const { projectInGroup } = action.payload
      return state.setIn(
        ['projectOrderByGroupId', projectInGroup.groupId, projectInGroup.projectId],
        projectInGroup.order
      )
    }
    case Constants.onUpdateProjectInGroupData: {
      const { projectInGroup } = action.payload
      const [groupIdCurrentlyContainingProject] = state
        .get('projectOrderByGroupId')
        .findEntry(group => group.get(projectInGroup.projectId))

      let newState = state
        .setIn(
          ['projectOrderByGroupId', projectInGroup.groupId, projectInGroup.projectId],
          projectInGroup.order
        )

      if (groupIdCurrentlyContainingProject !== projectInGroup.groupId) {
        newState = newState.deleteIn(
          ['projectOrderByGroupId', groupIdCurrentlyContainingProject, projectInGroup.projectId],
        )
      }


      return newState
    }
    case Constants.onDeleteProjectInGroupData: {
      const { projectId, groupId } = action.payload
      return state.deleteIn(
        ['projectOrderByGroupId', groupId, projectId],
      )
    }
    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState
    default: {
      return state
    }
  }
}

export default personalProjectStructureReducer
