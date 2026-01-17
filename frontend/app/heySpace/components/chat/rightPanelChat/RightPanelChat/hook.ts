import { CSSProperties, useCallback, useEffect, useMemo } from 'react';

import { useHistory, useLocation, useParams } from 'react-router';

import useCompare from 'common/hooks/useCompare';
import usePrevious from 'common/hooks/usePrevious';
import useRefreshData from 'common/hooks/useRefreshData';
import { getProjectBackgroundStyle } from 'common/utils/getProjectBackgroundStyle';
import { Id } from 'common/utils/identifier';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { onFetchSpaceOrConversationViewData as onFetchSpaceOrConversationViewDataAction } from 'models/domain/RequestModel/actions';

import { getCurrentPanelType, getTaskFiltersTargetType } from '../utils';

import { useDataPersister, useDataProvider } from './dataHooks';
import useRightPanelChatPersister from './useRightPanelChatPersister';

import { RightPanelChatInterface } from '.';

export type RightPanelChatHookInterface = {
  projectId: Id;
  isKanban: boolean;
  isCalendar: boolean;
  isTimeline: boolean;
  isTaskList: boolean;
  isFileList: boolean;
  isChat: boolean;
  isConversation: boolean;
  rightPanelType: RightPanelType;
  isProjectViewDataRequestSuccess: boolean;
  hasBackground: boolean;
  backgroundStyle: CSSProperties;
  taskFiltersTargetType: TaskFiltersTargetType;
  onCloseButtonClick: VoidFunction;
};

type ParamsInterface = {
  rightPanelType: RightPanelType;
  projectPanelType: ProjectPanelType;
};

export default function useComponent(props: RightPanelChatInterface): RightPanelChatHookInterface {
  const history = useHistory();
  const params = useParams<ParamsInterface>();
  const { isRightPanelChatOpen, onSetIsRightPanelChatOpen } = useRightPanelChatPersister();

  const rightPanelType = getCurrentPanelType(isRightPanelChatOpen, params.rightPanelType, params.projectPanelType);
  const taskFiltersTargetType = getTaskFiltersTargetType(params.projectPanelType);

  const { onFetchSpaceOrConversationViewData, onInitFilters } = useDataPersister();

  const {
    projectId,
    filterId,
    objectId,
    isProjectExist,
    showArchived,
    isConversation,
    isProjectViewDataRequestSuccess,
    isFilterExists,
    background,
  } = useDataProvider(taskFiltersTargetType);

  const refreshControllerOptions = useMemo(
    () => ({
      action: onFetchSpaceOrConversationViewDataAction,
      paramsToInject: [
        { key: 'objectId', defaultValue: objectId },
        { key: 'filterId', defaultValue: filterId },
        { key: 'force', defaultValue: true },
        { key: 'purgeTasksOrder', defaultValue: true },
      ],
    }),
    [objectId, filterId]
  );

  useRefreshData({}, refreshControllerOptions);

  const location = useLocation();

  const isKanban = location.pathname.includes(`/${ProjectPanelType.KANBAN}`);
  const isCalendar = location.pathname.includes(`/${ProjectPanelType.CALENDAR}`);
  const isChat = location.pathname.includes(`/${ProjectPanelType.CHAT}`);
  const isTimeline = location.pathname.includes(`/${ProjectPanelType.TIMELINE}`);

  const isTaskList = location.pathname.includes(`/${ProjectPanelType.LIST}`);

  const isFileList = location.pathname.includes(`/${ProjectPanelType.FILES}`);

  const hasBackground = isKanban || isTaskList;
  const backgroundStyle = hasBackground && background ? getProjectBackgroundStyle(background) : {};

  const onCloseButtonClick = useCallback(() => {
    if (isChat) {
      return onSetIsRightPanelChatOpen(false);
    }

    const locationParts = location.pathname.split(`/${params.projectPanelType}/`);
    history.push(`${locationParts[0]}/${params.projectPanelType}`);
    onSetIsRightPanelChatOpen(false);

    return false;
  }, [isChat, location, params.projectPanelType, onSetIsRightPanelChatOpen, history]);

  const isProjectChanged = useCompare<Id>(objectId) && isProjectExist;

  const previousIsProjectExists = usePrevious<boolean>(isProjectExist);
  const isProjectBecomeExisting = !previousIsProjectExists && isProjectExist;

  const previousIsRightPanelChatOpen = usePrevious<boolean>(isRightPanelChatOpen);
  const isRightPanelBecomeOpened = !previousIsRightPanelChatOpen && isRightPanelChatOpen;
  const isFilterChanged = useCompare<boolean>(showArchived);

  useEffect(() => {
    props.onMount();
    onFetchSpaceOrConversationViewData(filterId);
    if (!isFilterExists) {
      onInitFilters(filterId);
    }
  }, []);

  useEffect(() => {
    if (!isFilterExists) {
      onInitFilters(filterId);
    }
  }, [filterId, onInitFilters, isFilterExists]);

  useEffect(() => {
    if (isProjectChanged || isProjectBecomeExisting || isRightPanelBecomeOpened || isFilterChanged) {
      onFetchSpaceOrConversationViewData(filterId);
    }
  }, [
    isRightPanelChatOpen,
    isProjectChanged,
    isProjectBecomeExisting,
    isRightPanelBecomeOpened,
    isFilterChanged,
    filterId,
    onFetchSpaceOrConversationViewData,
  ]);

  return {
    projectId,
    isKanban,
    isCalendar,
    isChat,
    isConversation,
    isTimeline,
    isTaskList,
    isFileList,
    rightPanelType,
    isProjectViewDataRequestSuccess,
    hasBackground,
    taskFiltersTargetType,
    backgroundStyle,
    onCloseButtonClick,
  };
}
