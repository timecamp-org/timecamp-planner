import { useDispatch } from 'react-redux'
import {
  selectProjectGroupName,
  selectProjectGroupIsExpanded,
  selectProjectGroupWasJustCreated
} from 'models/domain/PersonalProjectStructureModel/selectors/domain'
import { useSelector } from 'common/hooks/useSelector'
import { Id } from 'common/utils/identifier'
import { useCallback } from 'react'
import * as PersonalProjectStructureActions from 'models/domain/PersonalProjectStructureModel/actions'
import { List } from 'immutable'
import {
  selectGroupHasUnreadMessages,
  selectOrderedProjectIdsByGroupId
} from 'models/domain/PersonalProjectStructureModel/selectors'
import { UserProjectGroupInterface } from 'models/domain/PersonalProjectStructureModel/types'

export type DataProviderHookInterface = {
  groupName: string,
  isExpanded: boolean,
  wasJustCreated: boolean,
  spaceIds: List<Id>,
  groupHasUnreadMessages: boolean,
}

export const useDataProvider = (groupId: Id): DataProviderHookInterface => ({
  groupName: useSelector(state => selectProjectGroupName(state, { groupId })),
  isExpanded: useSelector(state => selectProjectGroupIsExpanded(state, { groupId })),
  wasJustCreated: useSelector(state => selectProjectGroupWasJustCreated(state, { groupId })),
  spaceIds: useSelector(state => selectOrderedProjectIdsByGroupId(state, { groupId })),
  groupHasUnreadMessages: useSelector((state) => selectGroupHasUnreadMessages(state, { groupId }))
})

export type DataPersisterHookInterface = {
  onUpdateProjectGroup: (fields: Partial<UserProjectGroupInterface>) => void,
  onDeleteGroup: () => void,
}

export const useDataPersister = (groupId: Id): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  return {
    onUpdateProjectGroup: useCallback(
      (fields: Partial<UserProjectGroupInterface>) => dispatch(PersonalProjectStructureActions.onUpdateProjectGroup(groupId, fields)),
      [dispatch, groupId]
    ),
    onDeleteGroup: useCallback(
      () => dispatch(PersonalProjectStructureActions.onDeleteProjectGroup(groupId)),
      [dispatch, groupId]
    ),
  }
}
