import { useCallback } from 'react';

import ListContentSkeletonLoader from 'commonComponents/ListContentSkeletonLoader';
import { useTranslation } from 'i18n';
import { ConversationDescriptorRecordInterface, ProjectType } from 'models/domain/ProjectsModel/types';
import colors from 'styles/colors.css';

import UniversalModal from '../../../common/UniversalModal';
import DirectChatNavLink from '../DirectChatNavLink';
import GroupChatNavLink from '../GroupChatNavLink';

import useComponent from './hook';
import styles from './styles.css';

const UserNavLinkList = () => {
  const { t } = useTranslation();
  const hook = useComponent();

  const renderRow = useCallback(
    (descriptor: ConversationDescriptorRecordInterface) => {
      const id = descriptor.conversationId;

      switch (descriptor.type) {
        case ProjectType.GROUP_CHAT: {
          return (
            <GroupChatNavLink
              key={`UserNavLinkList_${id}`}
              isSelected={hook.getIsConversationSelected(id)}
              conversationId={id}
            />
          );
        }
        case ProjectType.DIRECT_CHAT: {
          return (
            <DirectChatNavLink
              people={descriptor.people}
              key={`UserNavLinkList_${id}`}
              isSelected={hook.getIsConversationSelected(id)}
              conversationId={id}
            />
          );
        }
        default: {
          return null;
        }
      }
    },
    [hook.getIsConversationSelected]
  );

  if (hook.isLoading) {
    return renderSkeleton();
  }

  return (
    <div className={styles.Component}>
      {hook.conversationDescriptors.map(renderRow)}
      <UniversalModal
        isModalOpen={!!hook.selectedUserIdToResendInvitation}
        header={t('Are you sure you want to resend invitation?')}
        cancelButtonCaption={t('Cancel')}
        saveButtonCaption={t('Resend')}
        onModalSave={hook.onResendInvitation}
        onSetIsModalOpen={hook.onCloseResendInvitationModal}
        shouldRenderCloseIcon={false}
        shouldFocusOnOpen={true}
      />
    </div>
  );
};

function renderSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <ListContentSkeletonLoader backgroundColor={colors.darkTwoColor} foregroundColor={colors.duskColor} />
    </div>
  );
}

export default UserNavLinkList;
