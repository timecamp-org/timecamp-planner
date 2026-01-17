import React, { ReactNode } from 'react';

import { Box, SxProps } from '@mui/material';

import { Id } from 'common/utils/identifier';
import { AssigneesContainerEntityType } from 'commonComponents/AssigneesController/types';
import { AssigneeSearchHookInterface, useComponent } from 'commonComponents/AssigneeSearch/hook';
import InputIcon from 'commonComponents/InputIcon';
import ListItemAssign from 'commonComponents/ListItemAssign';
import ListLabel from 'commonComponents/ListLabel';
import { useTranslation } from 'i18n';
import { TranslateFunction } from 'i18n/types';
import { List } from 'immutable';

import PersonFullName from '../../person/PersonFullName';

import styles from './styles.css';

export type AssigneeSearchInterface = {
  objectType: AssigneesContainerEntityType;
  objectId: string;
  taskId?: string;
  assigneeIds: List<Id>;
  notAssignedUserIds: List<Id>;

  onAddAssignee: (userId: Id) => void;
  onRemoveAssignee: (userId: Id) => void;
  isCurrentUserAssigned: boolean;
  onQuickAssignButtonClick: () => void;
  poperInputPlaceholder?: ReactNode;
};

const boxStyles: SxProps = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginLeft: 'auto',
  marginRight: '3rem',
  paddingTop: '.5rem',
  color: 'var(--color-primary-500)',
  cursor: 'pointer',
};

const AssigneeSearch: React.FC<AssigneeSearchInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);

  const shouldRenderInvitationContent = hook.assigneeIds.size === 0 && hook.notAssignedUserIds.size === 0;

  return (
    <>
      <InputIcon
        placeholder={props.poperInputPlaceholder || t('Search person')}
        value={hook.searchPhrase}
        shouldFocusOnMount
        onChange={hook.onChangeSearchPhrase}
        className={styles.input}
      />
      <Box onClick={props.onQuickAssignButtonClick} sx={boxStyles}>
        <span>{`${props.isCurrentUserAssigned ? t('Unassign yourself') : t('Assign yourself')}`}</span>
      </Box>
      <Box>
        {hook.invitationError ? <div className={styles.error}>{hook.invitationError}</div> : null}

        {shouldRenderInvitationContent ? renderInvitationContent(hook, t) : renderUserListsContent(hook, t)}
      </Box>
    </>
  );
};

function renderUserListsContent(hook: AssigneeSearchHookInterface, t: TranslateFunction) {
  return (
    <div className={styles.userListsWrapper}>
      <UsersAssigned userIds={hook.assigneeIds} hook={hook} />
      {hook.notAssignedUserIds.size > 0 && (
        <div className={styles.notAssignedUsersWrapper}>
          {hook.notAssignedUserIds.map((userId) =>
            renderNotAssignedUserRow(userId, hook.onAddAssignee, hook.objectColor, t),
          )}
        </div>
      )}
    </div>
  );
}

const UsersAssigned = ({ userIds, hook }) => (
  <div className={styles.usersAssigned}>
    {userIds.map((userId) => (
      <ListLabel
        key={userId}
        label={<PersonFullName userId={userId} />}
        onRemove={() => hook.onRemoveAssignee(userId)}
        className={styles.listLabel}
      />
    ))}
  </div>
);

function renderNotAssignedUserRow(
  userId: Id,
  onClick: (userId: Id) => void,
  objectColor: string,
  t: TranslateFunction,
) {
  return <ListItemAssign key={userId} onClick={() => onClick(userId)} userId={userId} objectColor={objectColor} />;
}

function renderInvitationContent(hook: AssigneeSearchHookInterface, t: TranslateFunction) {
  return (
    <div className={styles.invite} onClick={hook.onInviteUser}>
      <div className={styles.inviteValue}>{hook.searchPhrase}</div>
      <div className={styles.inviteLabel} style={{ color: hook.objectColor }}>
        {t('Invite')}
      </div>
    </div>
  );
}

export default AssigneeSearch;
