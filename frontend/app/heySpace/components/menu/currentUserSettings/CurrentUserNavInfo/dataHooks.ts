import { Id } from 'common/utils/identifier'
import { useSelector } from 'common/hooks/useSelector'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors'
import { useCallback, useMemo } from 'react'
import {
  selectIsAddonsSettingsAvailable,
  selectIsSubscriptionSettingsAvailable
} from 'models/domain/PermissionsModel/selectors'
import { selectIsWorkspacesPanelVisible } from 'models/domain/AppModel/selectors'
import * as AppModelActions from 'models/domain/AppModel/actions'
import { useDispatch } from 'react-redux'

export type DataProviderInterface = {
  currentUserId: Id,

  shouldRenderAddWorkspaceButton: boolean,
  shouldRenderToggleWorkspace: boolean,

  isSubscriptionSettingsAvailable: boolean,
  isAddonsSettingsAvailable: boolean,
  isWorkspacesPanelVisible: boolean,
}

export const useDataProvider = (): DataProviderInterface => {
  const currentUserId = useSelector(state => selectCurrentUserId(state))
  const organizationIds = useSelector(state => selectCurrentUserExistingOrganizationIds(state))


  const shouldRenderAddWorkspaceButton = useMemo(() => organizationIds.size < 2, [organizationIds.size])
  const shouldRenderToggleWorkspace = useMemo(() => organizationIds.size > 1, [organizationIds.size])

  const isSubscriptionSettingsAvailable = useSelector(state => selectIsSubscriptionSettingsAvailable(state))
  const isAddonsSettingsAvailable = useSelector(state => selectIsAddonsSettingsAvailable(state))
  const isWorkspacesPanelVisible = useSelector(state => selectIsWorkspacesPanelVisible(state))

  return {
    currentUserId,

    shouldRenderAddWorkspaceButton,
    shouldRenderToggleWorkspace,

    isSubscriptionSettingsAvailable,
    isAddonsSettingsAvailable,
    isWorkspacesPanelVisible,
  }
}

export type DataPersisterInterface = {
  onSetIsWorkspaceModalOpen: (isOpen: boolean) => void,
  onSetIsWorkspacesPanelVisible: (isVisible: boolean) => void,
}

export const useDataPersister = (): DataPersisterInterface => {
  const dispatch = useDispatch()

  const onSetIsWorkspaceModalOpen = useCallback((isOpen: boolean) => {
    dispatch(AppModelActions.onSetIsWorkspaceModalOpen(isOpen))
  }, [dispatch])

  const onSetIsWorkspacesPanelVisible = useCallback((isVisible: boolean) => {
    dispatch(AppModelActions.onSetIsWorkspacesPanelVisible(isVisible))
  }, [dispatch])

  return {
    onSetIsWorkspaceModalOpen,
    onSetIsWorkspacesPanelVisible,
  }
}
