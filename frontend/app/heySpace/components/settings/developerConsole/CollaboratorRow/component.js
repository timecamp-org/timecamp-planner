import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'i18n';
import { doNothing } from 'common/utils';

import PersonIcon from 'components/person/PersonIcon';
import PersonFullName from 'components/person/PersonFullName';
import { X as XIcon } from 'commonComponents/Icons';

import styles from './styles.css';

CollaboratorRow.propTypes = {
  isAssigned: PropTypes.bool,
  userId: PropTypes.string,
  userRole: PropTypes.string,
  isCurrentUserAppOwner: PropTypes.bool,
  onAddCollaborator: PropTypes.func,
  onRemoveCollaborator: PropTypes.func,
};

CollaboratorRow.defaultProps = {
  className: '',
  isAssigned: false,
  isCurrentUserAppOwner: false,
  onAddCollaborator: doNothing,
  onRemoveCollaborator: doNothing,
};

function CollaboratorRow(props) {
  const { t } = useTranslation();
  return (
    <>
      {props.isAssigned
        ? renderAssignedUserRow(props, t)
        : renderNotAssignedUserRow(props, t)}
    </>
  );
}

function renderAssignedUserRow(
  {
    userId,
    userRole,
    onRemoveCollaborator,
    isCurrentUserAppOwner,
    currentUserId,
  },
  t
) {
  const shouldRenderRemoveButton =
    isCurrentUserAppOwner && userId !== currentUserId;
  return (
    <div className={styles.userRow}>
      <div className={styles.userRowLeft}>
        <PersonIcon
          wrapperClassName={styles.searchRowPersonIcon}
          userId={userId}
        />
        <PersonFullName userId={userId} />
        <span className={styles.role}>{`(${t(userRole)})`}</span>
      </div>
      {shouldRenderRemoveButton && renderRemoveButton(onRemoveCollaborator)}
    </div>
  );
}

function renderRemoveButton(onRemoveCollaborator) {
  return (
    <div className={styles.assignedUserRowLabel} onClick={onRemoveCollaborator}>
      <XIcon width={12} />
    </div>
  );
}

function renderNotAssignedUserRow(
  { userId, onAddCollaborator, isCurrentUserAppOwner },
  t
) {
  return (
    <div className={styles.userRow} onClick={onAddCollaborator}>
      <div className={styles.userRowLeft}>
        <PersonIcon
          wrapperClassName={styles.searchRowPersonIcon}
          userId={userId}
        />
        <PersonFullName userId={userId} />
      </div>
      {isCurrentUserAppOwner && (
        <div className={styles.notAssignedUserRowLabel}>{t('INVITE')}</div>
      )}
    </div>
  );
}

export default CollaboratorRow;
