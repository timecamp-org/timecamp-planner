import React from 'react';

import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { ProjectType } from 'models/domain/ProjectsModel/types';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';

import useRightPanelChatPersister from '../../chat/rightPanelChat/RightPanelChat/useRightPanelChatPersister';

import DirectConversationHeader from './headers//DirectConversationHeader';
import GroupConversationHeader from './headers//GroupConversationHeader';
import SpaceViewHeader from './headers/SpaceViewHeader';
import styles from './styles.css';

ProjectViewHeader.propTypes = {
  projectId: PropTypes.string.isRequired,
  conversationPartnerId: PropTypes.string,
  isTaskSearchFocused: PropTypes.bool,
  isSectionInputFocused: PropTypes.bool,
  projectIsPrivate: PropTypes.bool,
  isInternalCalendarEnabled: PropTypes.bool,
  isTimelineEnabled: PropTypes.bool,
  isFileListEnabled: PropTypes.bool,
  conversationType: PropTypes.string,

  projectColor: PropTypes.string,
  onSetIsTaskSearchFocused: PropTypes.func,
  onOpenAddCardModal: PropTypes.func,
};

ProjectViewHeader.defaultProps = {
  projectIsPrivate: false,
  isTaskSearchFocused: false,
  isSectionInputFocused: false,
  isInternalCalendarEnabled: false,
  onSetIsTaskSearchFocused: doNothing,
  onOpenAddCardModal: doNothing,
  conversationType: ProjectType.PROJECT,
};

function ProjectViewHeader(props) {
  const { onOpenRightPanelChat } = useRightPanelChatPersister();

  return (
    <div className={props.projectPanelType === ProjectPanelType.CHAT ? styles.chatHeader : styles.header}>
      {renderContent(props, onOpenRightPanelChat)}
    </div>
  );
}

const renderContent = (props, onOpenRightPanelChat) => {
  switch (props.conversationType) {
    case ProjectType.DIRECT_CHAT:
      return (
        <DirectConversationHeader
          conversationId={props.conversationId}
          projectId={props.projectId}
          fullName={props.fullName}
          workspaceName={props.workspaceName}
          conversationPartnerId={props.conversationPartnerId}
          projectColor={props.projectColor}
          isTaskSearchFocused={props.isTaskSearchFocused}
          isAbleToDeactivateUser={props.isAbleToDeactivateUser}
          projectPanelType={props.projectPanelType}
          isInternalCalendarEnabled={props.isInternalCalendarEnabled}
          projectType={props.conversationType}
          isRightPanelActive={props.isRightPanelActive}
          isTaskListEnabled={props.isTaskListEnabled}
          isTimelineEnabled={props.isTimelineEnabled}
          isFileListEnabled={props.isFileListEnabled}
          onSetIsTaskSearchFocused={props.onSetIsTaskSearchFocused}
          onOpenRightPanelChat={onOpenRightPanelChat}
        />
      );
    case ProjectType.GROUP_CHAT:
      return (
        <GroupConversationHeader
          projectId={props.projectId}
          conversationId={props.conversationId}
          projectColor={props.projectColor}
          projectPeopleSize={props.projectPeopleSize}
          projectPanelType={props.projectPanelType}
          projectType={props.conversationType}
          isRightPanelActive={props.isRightPanelActive}
          onOpenRightPanelChat={onOpenRightPanelChat}
        />
      );
    default:
      return (
        <SpaceViewHeader
          projectId={props.projectId}
          projectColor={props.projectColor}
          projectPeopleSize={props.projectPeopleSize}
          projectIsPrivate={props.projectIsPrivate}
          isTaskSearchFocused={props.isTaskSearchFocused}
          isSectionInputFocused={props.isSectionInputFocused}
          projectPanelType={props.projectPanelType}
          isRightActionsVisible={props.isRightActionsVisible}
          isInternalCalendarEnabled={props.isInternalCalendarEnabled}
          isTimelineEnabled={props.isTimelineEnabled}
          isTaskListEnabled={props.isTaskListEnabled}
          isFileListEnabled={props.isFileListEnabled}
          isRightPanelActive={props.isRightPanelActive}
          projectType={props.conversationType}
          onSetIsTaskSearchFocused={props.onSetIsTaskSearchFocused}
          onOpenAddCardModal={props.onOpenAddCardModal}
          onDownloadSpaceAsCSV={props.onDownloadSpaceAsCSV}
          onOpenRightPanelChat={onOpenRightPanelChat}
        />
      );
  }
};

export default ProjectViewHeader;
