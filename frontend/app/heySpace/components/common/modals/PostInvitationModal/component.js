import React from 'react';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';

import UniversalModal from 'commonComponents/UniversalModal';
import { useTranslation } from 'i18n';
import styles from './styles.css';
import profileImage from './assets/profile.png';
import teamImage from './assets/team.png';

PostInvitationModal.propTypes = {
  isModalOpen: PropTypes.bool,
  onCloseModal: PropTypes.func,
};

PostInvitationModal.defaultProps = {
  isModalOpen: false,
  onCloseModal: doNothing,
};

function PostInvitationModal(props) {
  const { t } = useTranslation();

  return (
    <UniversalModal
      isModalOpen={props.isModalOpen}
      shouldRenderHeader={true}
      shouldRenderFooter={true}
      header={t('Welcome to our Planner family!')}
      onSetIsModalOpen={props.onCloseModal}
      innerModalDialogClassName={styles.innerModalDialog}
      headerClassName={styles.modalHeader}
      saveButtonCaption={t('Dive into Planner')}
      shouldRenderCancelButton={false}
      saveButtonClassName={styles.saveButton}
    >
      {renderModalContent(props, t)}
    </UniversalModal>
  );
}

function renderModalContent(props, t) {
  return (
    <div className={styles.content}>
      <div className={styles.row}>
        <div className={styles.column}>
          <span className={styles.mascot} />
        </div>
        <div className={styles.column}>
          <span className={styles.mainText}>
            {t(
              `Good to see You here!\nLet us introduce the place you landed in.\nThere are 2 main things you need to know to get on board with us.`
            )}
          </span>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.column}>
          <span className={styles.text}>
            {t(`Starting chat with a person, who invited you to the Workspace - this can be done in the left panel. 
          You have access to the direct chat only, untill you’ll be added to Projects, where the project collaboration usually takes place.`)}
          </span>
        </div>
        <div className={styles.column}>
          <img src={teamImage} className={styles.image} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.column}>
          <img src={profileImage} className={styles.image} />
        </div>
        <div className={styles.column}>
          <span className={styles.textWithList}>
            <span className={styles.listHeader}>
              {t(
                `You’ve been also granted with your own, free Workspace, which can be accesed in the left sidebar. There you can go beyond any limits :)`
              )}
            </span>
            <ul className={styles.list}>
              <li className={styles.listItem}>{t('private and group chats')}</li>
              <li className={styles.listItem}>{t('collaboration in projects')}</li>
              <li className={styles.listItem}>{t('tasks with estimates')}</li>
              <li className={styles.listItem}>{t('kanban and calendar')}</li>
            </ul>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PostInvitationModal;
