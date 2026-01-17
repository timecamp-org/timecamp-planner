import { useEffect } from 'react';
import { Id } from 'common/utils/identifier';
import { useDataPersister, useDataProvider } from './dataHooks';
import usePrevious from 'common/hooks/usePrevious';
import { useUserTrackerEvent } from 'common/hooks/useUserTrackerEvent';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { SpaceTaskListViewInterface } from '.';
import { List } from 'immutable';

export type SpaceTaskListViewHookInterface = {
  isLoading: boolean;
  isTaskListEnabled: boolean;
  taskIds: List<Id>;
  filterId: Id;
};

export default function useComponent(props: SpaceTaskListViewInterface): SpaceTaskListViewHookInterface {
  const { taskIds, isProjectViewDataRequestRepeatable, isLoading, filterId, fetchArchived, isTaskListEnabled } =
    useDataProvider(props.spaceId, props.isConversation);

  const { onFetchProjectViewData, onUpdateLastPanelType } = useDataPersister(props.spaceId);

  const queryParams = { fetchArchived };

  const prevSpaceId = usePrevious(props.spaceId);

  useEffect(() => {
    if (isProjectViewDataRequestRepeatable) {
      onFetchProjectViewData(queryParams);
    }
    onUpdateLastPanelType();
  }, []);

  useEffect(() => {
    if (prevSpaceId && props.spaceId !== prevSpaceId && isProjectViewDataRequestRepeatable) {
      onFetchProjectViewData(queryParams);
    }
  }, [isProjectViewDataRequestRepeatable, props.spaceId, prevSpaceId, onFetchProjectViewData]);

  useUserTrackerEvent(UserTrackerEvent.featureUsed, { name: 'Task List', isConversation: props.isConversation });

  return {
    taskIds,
    isLoading,
    filterId,
    isTaskListEnabled,
  };
}
