import { useContext } from 'react';

import { makeConversationLink } from 'common/utils/routerHelpers';
import { AlignLeft } from 'commonComponents/Icons/fontawesome/AlignLeft';
import { RightPanelContext } from 'components/chat/rightPanelChat/RightPanelChat/context';
import MeetController from 'components/meet/MeetController';
import DeactivateGuestController from 'components/projects/DeactivateGuestController';
import { useTranslation } from 'i18n';
import { RightPanelType } from 'models/domain/ProjectsSettingsModel/types';

import FilterNavlink from '../../components/FilterNavlink/FilterNavlink';
import RightPanelLink from '../../components/RightPanelLink';
import SearchOrIcon from '../../components/SearchOrIcon';
import { rightPanelTypes } from '../../const';
import styles from '../../styles.css';

import { DirectConversationViewHeaderProps } from './DirectConversationHeader';

type DirectConversationRightPanelLinksProps = Pick<
  DirectConversationViewHeaderProps,
  | 'isAbleToDeactivateUser'
  | 'projectPanelType'
  | 'projectId'
  | 'conversationId'
  | 'projectColor'
  | 'onOpenRightPanelChat'
  | 'isRightPanelActive'
  | 'isRightActionsVisible'
  | 'isTaskSearchFocused'
  | 'onSetIsTaskSearchFocused'
>;

const DirectConversationRightPanelLinks = (props: DirectConversationRightPanelLinksProps) => {
  const { t } = useTranslation();

  const isRightActionsPanelType = rightPanelTypes.includes(props.projectPanelType);
  const { isRightPanelChatOpen } = useContext(RightPanelContext);

  return (
    <div className={styles.panelFlexWrapper}>
      <MeetController objectId={props.projectId} buttonClassName={styles.meetController} />
      {props.isAbleToDeactivateUser && <DeactivateGuestController />}
      {isRightActionsPanelType && <SearchOrIcon {...props} />}
      {isRightActionsPanelType && (
        <FilterNavlink
          {...props}
          to={makeConversationLink(props.conversationId, props.projectPanelType, RightPanelType.FILTERS)}
        />
      )}

      {!isRightActionsPanelType && (
        <RightPanelLink
          onClick={props.onOpenRightPanelChat}
          isActive={props.isRightPanelActive(RightPanelType.TASKS)}
          color={props.projectColor}
          message={t('Task List')}
        >
          <AlignLeft color="var(--color-gray-900)" className={isRightPanelChatOpen ? styles.navLinkActive : ''} />
        </RightPanelLink>
      )}
    </div>
  );
};

export default DirectConversationRightPanelLinks;
