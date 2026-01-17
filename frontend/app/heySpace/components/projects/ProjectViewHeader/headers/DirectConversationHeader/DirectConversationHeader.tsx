import UserStatus from 'commonComponents/UserStatus';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';

import LeftPanelLinks from '../../components/LeftPanelLinks';
import styles from '../../styles.css';
import { BaseHeaderProps } from '../../types';

import DirectConversationRightPanelLinks from './DirectConversationRightPanelLinks';
import { useDirectConversationLeftPanelLinks } from './useDirectConversationLeftPanelLinks';

DirectConversationViewHeader.defaultProps = {
  isAbleToDeactivateUser: false,
  isTaskListEnabled: false,
  isTimelineEnabled: false,
  projectColor: '',
  fullName: '',
  workspaceName: '',
  projectPanelType: ProjectPanelType.CHAT,
};

export type DirectConversationViewHeaderProps = {
  conversationPartnerId: string;
  isAbleToDeactivateUser?: boolean;
  fullName?: string;
  workspaceName?: string;
  conversationId: string;
} & BaseHeaderProps;

function DirectConversationViewHeader(props: DirectConversationViewHeaderProps) {
  const leftPanelLinks = useDirectConversationLeftPanelLinks(props);

  return (
    <>
      <div className={styles.projectInfo}>
        <div className={styles.descriptorsAndNavigation}>
          <div className={`${styles.descriptors} ${styles.clickable}`}>
            <PersonIcon
              className={styles.conversationPartnerIcon}
              wrapperClassName={styles.conversationPartnerIcon}
              userId={props.conversationPartnerId}
            />
            <PersonFullName userId={props.conversationPartnerId} className={styles.directProjectName} />
            <UserStatus userId={props.conversationPartnerId} className={styles.userStatus} />
          </div>
          <LeftPanelLinks leftPanelLinks={leftPanelLinks} />
        </div>
      </div>

      <DirectConversationRightPanelLinks {...props} />
    </>
  );
}

export default DirectConversationViewHeader;
