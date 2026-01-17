import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';
import commonStyles from 'styles/common.css';

import { AssignUser as AssignUserIcon } from 'commonComponents/Icons';
import PopoverContent from 'commonComponents/PopoverContent';
import UniversalPopover from 'commonComponents/UniversalPopover';
import UserInput from 'commonComponents/UserInput';
import SecondaryButton from 'components/buttons/SecondaryButton';
import PersonIcon from 'components/person/PersonIcon';
import CollaboratorRow from '../CollaboratorRow';

import { List } from 'immutable';
import styles from './styles.css';

const avatarSize = 7 * parseInt(commonStyles.gridCellSize, 10);
const emptyList = new List();

AppCollaborators.propTypes = {
  className: PropTypes.string,
  appId: PropTypes.string.isRequired,
  isCollaboratorsPickerOpen: PropTypes.bool,
  isCurrentUserAppOwner: PropTypes.bool,
  shouldRenderInvitationContent: PropTypes.bool,
  searchPhrase: PropTypes.string,
  userIds: ImmutablePropTypes.list,
  notAssignedUserIds: ImmutablePropTypes.list,
  onCloseCollaboratorsPicker: PropTypes.func,
  onOpenCollaboratorsPicker: PropTypes.func,
  onChangeSearchPhrase: PropTypes.func,
  onInviteCollaborator: PropTypes.func,
  onKeyDown: PropTypes.func,
  onLeaveAppCollaborators: PropTypes.func,
};

AppCollaborators.defaultProps = {
  className: '',
  userIds: emptyList,
  notAssignedUserIds: emptyList,
  isCollaboratorsPickerOpen: false,
  isCurrentUserAppOwner: false,
  shouldRenderInvitationContent: false,
  searchPhrase: '',
  onCloseCollaboratorsPicker: doNothing,
  onOpenCollaboratorsPicker: doNothing,
  onChangeSearchPhrase: doNothing,
  onInviteCollaborator: doNothing,
  onKeyDown: doNothing,
  onLeaveAppCollaborators: doNothing,
};

function AppCollaborators(props) {
  const { t } = useTranslation();
  return (
    <div className={props.className || styles.Component}>
      {props.isCollaboratorsPickerOpen ? renderPopover(props, t) : renderTarget(props, t)}
    </div>
  );
}

function renderTarget(props) {
  return (
    <SecondaryButton
      className={`${styles.assigneesPickerController} ${props.userIds.size ? styles.assigneePicked : ''}`}
      color={props.color}
      isActive={props.isCollaboratorsPickerOpen}
      onClick={props.onOpenCollaboratorsPicker}
      activeClassName={styles.activeController}
    >
      {props.userIds.map(renderCollaboratorIcon)}

      {renderAssignUserIcon(props)}
    </SecondaryButton>
  );
}

function renderCollaboratorIcon(collaboratorId, index) {
  return (
    <div className={index !== 0 ? styles.assigneeIconWrapper : ''} key={collaboratorId}>
      <PersonIcon userId={collaboratorId} wrapperClassName={styles.personIcon} width={avatarSize} height={avatarSize} />
    </div>
  );
}

function renderAssignUserIcon(props) {
  return (
    <div
      className={`${
        props.userIds.size ? styles.assigneesPickerControllerIcon : styles.assigneesPickerControllerIconTransparent
      }`}
    >
      <AssignUserIcon width={22} />
    </div>
  );
}

function renderPopover(props, t) {
  return (
    <UniversalPopover
      isPopoverOpened={props.isCollaboratorsPickerOpen}
      targetComponent={renderTarget(props, t)}
      popperComponent={renderPopperContent(props, t)}
      popperPlacement={'right'}
      popperModifiers={{
        offset: {
          offset: `-16, 16`,
        },
        preventOverflow: {
          boundariesElement: 'window',
        },
      }}
    />
  );
}

function renderPopperContent(props, t) {
  return (
    <PopoverContent isVisible={props.isCollaboratorsPickerOpen} onClickOutside={props.onCloseCollaboratorsPicker}>
      <>
        <div className={styles.header}>
          {props.isCurrentUserAppOwner ? t('Assign user to collaborate in app') : t('App collaborators')}
        </div>
        {props.isCurrentUserAppOwner && renderUserSearchInput(props, t)}
        {props.shouldRenderInvitationContent ? renderInvitationContent(props, t) : renderUserListsContent(props, t)}
        {!props.isCurrentUserAppOwner && renderLeaveButton(props, t)}
      </>
    </PopoverContent>
  );
}

function renderUserSearchInput(props, t) {
  return (
    <UserInput
      value={props.searchPhrase}
      shouldFocusOnMount
      placeholder={t('Type in user email...')}
      onChange={props.onChangeSearchPhrase}
      onKeyDown={props.onKeyDown}
    />
  );
}

function renderUserListsContent({ filteredUserIds, notAssignedUserIds, appId, isCurrentUserAppOwner }, t) {
  return (
    <div className={styles.userListsWrapper}>
      {filteredUserIds.size > 0 && isCurrentUserAppOwner && (
        <div className={styles.listTitle}>{t('Already assigned')}</div>
      )}
      {filteredUserIds.map(renderAssignedUserRow)}
      {isCurrentUserAppOwner && notAssignedUserIds.size > 0 && (
        <div className={styles.listTitle}>{t('Not assigned')}</div>
      )}
      {isCurrentUserAppOwner && notAssignedUserIds.map(renderNotAssignedUserRow)}
    </div>
  );

  function renderAssignedUserRow(userId) {
    return <CollaboratorRow key={`AppCollaboratorsSearch-${userId}`} userId={userId} appId={appId} isAssigned />;
  }

  function renderNotAssignedUserRow(userId) {
    return <CollaboratorRow key={`AppCollaboratorsSearch-${userId}`} userId={userId} appId={appId} />;
  }
}

function renderInvitationContent({ searchPhrase, onInviteCollaborator }, t) {
  return (
    <div className={styles.invite} onClick={onInviteCollaborator}>
      <div className={styles.inviteValue}>{searchPhrase}</div>
      <div className={styles.inviteLabel}>{t('Invite')}</div>
    </div>
  );
}

function renderLeaveButton(props, t) {
  return (
    <SecondaryButton className={styles.leaveButton} onClick={props.onLeaveAppCollaborators}>
      {t('Leave')}
    </SecondaryButton>
  );
}

export default AppCollaborators;
