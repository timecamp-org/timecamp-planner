import React, { lazy, memo } from 'react';

import { doNothing } from 'common/utils';
import SuspenseComponent from 'commonComponents/asyncRenderers/SuspenseComponent';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import LoadingDots from 'commonComponents/LoadingDots';
import SecondaryButton from 'components/buttons/SecondaryButton';
import SpaceTaskGroupsListView from 'components/projects/SpaceTaskGroupsListView';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { RightPanelType } from 'models/domain/ProjectsSettingsModel/types';

import { AddonsRightPanelChat } from '../addons/AddonsRightPanelChat';
import FiltersRightPanelChat from '../FiltersRightPanelChat';
import MembersRightPanelChat from '../MembersRightPanelChat';
import SpaceSettingsRightPanelChat from '../SpaceSettingsRightPanelChat';
import TaskListRightPanelChat from '../TaskListRightPanelChat';

import useComponent, { RightPanelChatHookInterface } from './hook';
import styles from './styles.css';

const SpaceCalendarView = lazy(() => import('components/projects/spaceCalendar/SpaceCalendarView'));
const SpaceTimelineView = lazy(() => import('components/projects/SpaceTimelineView'));
const SpaceTaskListView = lazy(() => import('components/projects/SpaceTaskListView'));
const SpaceFileListView = lazy(() => import('components/projects/SpaceFileListView'));

export type RightPanelChatInterface = {
  className?: string;
  onMount: VoidFunction;
};

const defaultProps = {
  onMount: doNothing,
};

const RightPanelChat: React.FC<RightPanelChatInterface> = (props) => {
  const hook = useComponent(props);
  const shouldRenderClosePanelButton = Object.values(RightPanelType).includes(hook.rightPanelType);

  return (
    <div className={`${styles.Component || props.className} ${styles.background}`} style={hook.backgroundStyle}>
      {isSectionsVisible(hook) && renderSections(hook)}
      {isCalendarVisible(hook) && renderCalendar(hook)}
      {hook.isTimeline && renderTimeline(hook)}
      {hook.isTaskList && renderTaskList(hook)}
      {hook.isFileList && renderFileListView(hook)}
      <div className={hook.isChat ? styles.ComponentWithChat : styles.ComponentWithoutChat}>
        {shouldRenderClosePanelButton && renderClosePanelButton(hook)}
        {renderPanel(hook)}
      </div>
    </div>
  );
};

function renderClosePanelButton(hook: RightPanelChatHookInterface) {
  return (
    <SecondaryButton className={styles.closeIcon} projectId={hook.projectId} onClick={hook.onCloseButtonClick}>
      <Xmark />
    </SecondaryButton>
  );
}

function isSectionsVisible(hook: RightPanelChatHookInterface) {
  return hook.isProjectViewDataRequestSuccess && (hook.isKanban || hook.rightPanelType === RightPanelType.TASKS);
}

function isCalendarVisible(hook: RightPanelChatHookInterface) {
  return hook.isProjectViewDataRequestSuccess && hook.isCalendar;
}

function renderSections(hook: RightPanelChatHookInterface) {
  return (
    <TaskListRightPanelChat projectId={hook.projectId} isConversation={hook.isConversation} isKanban={hook.isKanban} />
  );
}

function renderCalendar(hook: RightPanelChatHookInterface) {
  return (
    <SuspenseComponent fallback={renderDotsLoader()}>
      <SpaceCalendarView projectId={hook.projectId} isConversation={hook.isConversation} />
    </SuspenseComponent>
  );
}

function renderTimeline(hook: RightPanelChatHookInterface) {
  return (
    <SuspenseComponent fallback={renderDotsLoader()}>
      <SpaceTimelineView spaceId={hook.projectId} isConversation={hook.isConversation} />
    </SuspenseComponent>
  );
}

function renderTaskList(hook: RightPanelChatHookInterface) {
  return (
    <SuspenseComponent fallback={renderDotsLoader()}>
      <SpaceTaskGroupsListView spaceId={hook.projectId} isConversation={hook.isConversation} />
    </SuspenseComponent>
  );
}

function renderFileListView(hook: RightPanelChatHookInterface) {
  return <SpaceFileListView spaceId={hook.projectId} />;
}

function renderDotsLoader() {
  return (
    <div className={styles.dotsLoader}>
      <LoadingDots className={styles.loadingDots} />
    </div>
  );
}

function renderPanel(hook: RightPanelChatHookInterface) {
  switch (hook.rightPanelType) {
    case RightPanelType.MEMBERS:
      return <MembersRightPanelChat projectId={hook.projectId} isConversation={hook.isConversation} />;
    case RightPanelType.SETTINGS:
      return <SpaceSettingsRightPanelChat projectId={hook.projectId} isConversation={hook.isConversation} />;
    case RightPanelType.FILTERS:
      return (
        <FiltersRightPanelChat
          containerType={hook.isConversation ? TaskFiltersContainerType.CONVERSATION : TaskFiltersContainerType.PROJECT}
          containerId={hook.projectId}
          targetType={hook.taskFiltersTargetType}
        />
      );
    case RightPanelType.ADDONS:
      return <AddonsRightPanelChat projectId={hook.projectId} />;
    default:
      return null;
  }
}

RightPanelChat.defaultProps = defaultProps;

export default memo(RightPanelChat);
