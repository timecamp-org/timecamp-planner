import { useSelector } from 'common/hooks/useSelector'
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors'
import { onCloseModal as onCloseModalAction } from 'models/component/ModalsModel/actions'
import { ModalType } from 'models/component/ModalsModel/types'
import { Id } from 'common/utils/identifier'
import { List, Map } from 'immutable'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectProjectNames } from 'models/domain/ProjectsModel/selectors/domain'
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import {
  selectLinkedViewContainerIdsByBaseViewId,
  selectViewSettingsIdByTypeAndContainerId
} from 'models/domain/ViewSettingsModel/selectors/domain'
import { ViewSettingsViewType, ViewContainerType } from 'models/domain/ViewSettingsModel/types'
import { onCreateOverwatchView, onUpdateOverwatchViews } from 'models/domain/OverwatchModel/actions'

export type DataProviderHookInterface = {
  isModalOpen: boolean,
  spaceNames: Map<Id, string>,
  availableSpaceIds: List<Id>
  selectedSpaceIds: List<Id>,
  overwatchViewId?: Id,
}

export const useDataProvider = (): DataProviderHookInterface => {
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))
  const overwatchViewId = useSelector(state => selectViewSettingsIdByTypeAndContainerId(state, {
    viewType: ViewSettingsViewType.OVERWATCH,
    containerId: currentOrganizationId,
    containerType: ViewContainerType.ORGANIZATION,
  }))
  return {
    isModalOpen: useSelector(state => selectIsModalOpen(state, { modalType: ModalType.MANAGE_OVERWATCH_MODAL })),
    availableSpaceIds: useSelector(state => selectSortedAvailableVisibleSpacesIds(state)),
    spaceNames: useSelector(state => selectProjectNames(state)),
    selectedSpaceIds: useSelector(state => selectLinkedViewContainerIdsByBaseViewId(state, { baseViewId: overwatchViewId })),
    overwatchViewId,
  }
}

export type DataPersisterHookInterface = {
  onCloseModal: VoidFunction,
  onCreateOverwatch: (spaceIds: List<Id>) => void,
  onUpdateOverwatch: (selectedSpaceIds: List<Id>, overwatchViewId: Id) => void,
}

export const useDataPersister = (): DataPersisterHookInterface => {
  const dispatch = useDispatch()

  const onCloseModal = useCallback(() => {
    dispatch(onCloseModalAction(ModalType.MANAGE_OVERWATCH_MODAL))
  }, [dispatch])

  const onCreateOverwatch = useCallback((spaceIds: List<Id>) => {
    dispatch(onCreateOverwatchView(spaceIds))
  }, [dispatch])

  const onUpdateOverwatch = useCallback((selectedSpaceIds: List<Id>, overwatchViewId: Id) => {
    dispatch(onUpdateOverwatchViews(selectedSpaceIds, overwatchViewId))
  }, [dispatch])

  return {
    onCloseModal,
    onCreateOverwatch,
    onUpdateOverwatch,
  }
}
