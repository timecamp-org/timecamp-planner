import { useCallback, useEffect, useMemo } from 'react'
import { useDataPersister, useDataProvider } from './dataHooks'
import { useUserTrackerEvent } from 'common/hooks/useUserTrackerEvent'
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants'
import { QuickSwitcherModalInterface } from './index'
import { QuickSwitcherState } from 'models/domain/AppModel/types'

interface QuickSwitcherModalHookInterface {
  isRequestLoading: boolean,

  onSetIsModalOpen: (isOpen: boolean) => void,
  onSetQuickSwitcherState: (state: QuickSwitcherState) => void,
}

export const useComponent = (props: QuickSwitcherModalInterface): QuickSwitcherModalHookInterface => {
  const {
    isFetchChatsRequestLoading,
    isFetchCardsRequestLoading,
    isFetchJoinableProjectsRequestLoading,
    isFetchInvisibleConversationsRequestLoading,
    isFetchChatsRequestRepeatable,
    isFetchCardsRequestRepeatable,
    isFetchJoinableProjectsRequestRepeatable,
    isFetchInvisibleConversationsRequestRepeatable,
  } = useDataProvider()
  const {
    onSetQuickSwitcherState,
    onFetchLatestActiveUserConversations,
    onFetchUserLatestVisitedTasks,
    onFetchAvailableSpaces,
    onFetchInvisibleConversations,
  } = useDataPersister()

  const onSetIsModalOpen = useCallback((isOpen: boolean): void => {
    if (!isOpen) {
      onSetQuickSwitcherState(QuickSwitcherState.CLOSED)
    }
  }, [onSetQuickSwitcherState])

  useEffect(() => {
    if (isFetchChatsRequestRepeatable) {
      onFetchLatestActiveUserConversations()
    }
    if (isFetchJoinableProjectsRequestRepeatable) {
      onFetchAvailableSpaces()
    }
    if (isFetchInvisibleConversationsRequestRepeatable) {
      onFetchInvisibleConversations()
    }
  }, [])

  useUserTrackerEvent(UserTrackerEvent.featureUsed, { name: 'Jump to' })

  useEffect(() => {
    if (props.quickSwitcherState === QuickSwitcherState.CARDS && isFetchCardsRequestRepeatable) {
      onFetchUserLatestVisitedTasks()
    }
  }, [
    props.quickSwitcherState,
    isFetchCardsRequestRepeatable,
    onFetchUserLatestVisitedTasks,
  ])

  const isRequestLoading = useMemo(() => {
    return isFetchChatsRequestLoading
      || isFetchCardsRequestLoading
      || isFetchJoinableProjectsRequestLoading
      || isFetchInvisibleConversationsRequestLoading
  }, [
    isFetchChatsRequestLoading,
    isFetchCardsRequestLoading,
    isFetchJoinableProjectsRequestLoading,
    isFetchInvisibleConversationsRequestLoading,
  ])

  return {
    onSetIsModalOpen,
    onSetQuickSwitcherState,
    isRequestLoading,
  }
}