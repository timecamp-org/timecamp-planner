import React from 'react';

import { User } from 'commonComponents/Icons/fontawesome/User';
import MeetController from 'components/meet/MeetController';
import ProjectIcon from 'components/projects/ProjectIcon';
import ProjectNameIO from 'components/projects/projectName/ProjectNameIO';
import { useTranslation } from 'i18n';
import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';

import RightPanelLink from '../../components/RightPanelLink';
import styles from '../../styles.css';

type GroupConversationHeaderProps = {
  projectId: string;
  conversationId: string;
  projectColor: string;
  projectPeopleSize: number;
  projectPanelType: ProjectPanelType;
  onOpenRightPanelChat: () => void;
  isRightPanelActive: (rightPanelType: RightPanelType) => boolean;
};

function GroupConversationHeader(props: GroupConversationHeaderProps) {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <ProjectIcon projectId={props.projectId} />
      <ProjectNameIO
        projectId={props.projectId}
        className={styles.groupConversationName}
        buttonClassName={styles.meetController}
      />

      <MeetController objectId={props.projectId} buttonClassName={styles.meetController} />

      <RightPanelLink
        onClick={props.onOpenRightPanelChat}
        isActive={props.isRightPanelActive(RightPanelType.MEMBERS)}
        color={props.projectColor}
        message={t('Members')}
      >
        <div className={styles.linkContent}>
          <User className={styles.membersIcon} />
          {props.projectPeopleSize}
        </div>
      </RightPanelLink>
    </React.Fragment>
  );
}

export default GroupConversationHeader;
