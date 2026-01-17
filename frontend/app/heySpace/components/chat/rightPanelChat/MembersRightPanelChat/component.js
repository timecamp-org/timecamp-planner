import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from 'common/utils';
import Checkbox from 'commonComponents/Checkbox';
import GuestHintIcon from 'commonComponents/GuestHintIcon';
import ListSearch from 'commonComponents/ListSearch';
import TooltipedDisabledElement from 'commonComponents/TooltipedDisabledElement';
import SecondaryButton from 'components/buttons/SecondaryButton';
import LeaveSpaceController from 'components/chat/rightPanelChat/LeaveSpaceController';
import MemberListItem from 'components/chat/rightPanelChat/MemberListItem';
import RightPanelLabel from 'components/chat/rightPanelChat/RightPanelLabel';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import { useTranslation } from 'i18n';
import commonStyles from 'styles/common.css';

import { MEMBERS } from '../utils/panelNames';

import styles from './styles.css';

const avatarSize = 6 * parseInt(commonStyles.gridCellSize, 10);
const emptyList = new List();

MembersRightPanelChat.propTypes = {
  projectId: PropTypes.string.isRequired,
  memberIds: ImmutablePropTypes.list.isRequired,
  guestIds: ImmutablePropTypes.list.isRequired,
  organizationGuestIds: ImmutablePropTypes.list.isRequired,
  isInviteUserSearchVisible: PropTypes.bool.isRequired,
  isInvitingGuestChecked: PropTypes.bool.isRequired,
  isInvitingGuestDirectly: PropTypes.bool.isRequired,
  isOrganizationUsersLoading: PropTypes.bool.isRequired,
  isConversation: PropTypes.bool.isRequired,
  isProjectEditable: PropTypes.bool.isRequired,
  canCurrentUserAddMember: PropTypes.bool.isRequired,
  isWorkspaceGuestSeatsAvailable: PropTypes.bool.isRequired,
  color: PropTypes.string,

  onMemberClick: PropTypes.func,
  onMemberRemove: PropTypes.func,
  onSetIsInviteUserSearchVisible: PropTypes.func,
  onSetIsInviteGuestSearchVisible: PropTypes.func,
  onAddUserToSubscribers: PropTypes.func,
  onCreateUserAndAddToSubscribers: PropTypes.func,
  shouldRenderMoreButton: PropTypes.func,
  onSetIsInvitingGuest: PropTypes.func,
};

MembersRightPanelChat.defaultProps = {
  memberIds: emptyList,
  guestIds: emptyList,
  organizationGuestIds: emptyList,
  onMemberClick: doNothing,
  isInviteUserSearchVisible: false,
  isOrganizationUsersLoading: false,
  isProjectEditable: true,
  isConversation: true,
  canCurrentUserAddMember: true,
  isWorkspaceGuestSeatsAvailable: false,
  isInvitingGuestChecked: false,
  isInvitingGuestDirectly: false,

  onMemberRemove: doNothing,
  onSetIsInviteUserSearchVisible: doNothing,
  onSetIsInviteGuestSearchVisible: doNothing,
  onAddUserToSubscribers: doNothing,
  onCreateUserAndAddToSubscribers: doNothing,
  shouldRenderMoreButton: doNothing,
  onSetIsInvitingGuest: doNothing,
};

function MembersRightPanelChat(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component}>
      {props.isInviteUserSearchVisible ? (
        renderListSearch()
      ) : (
        <div className={styles.lists}>
          {renderMemberList()}
          {!props.isConversation && renderGuestList()}
          {!props.isConversation && renderLeaveSpace()}
        </div>
      )}
    </div>
  );

  function renderListSearch() {
    return (
      <ListSearch
        list={props.isInvitingGuestChecked ? props.organizationGuestIds : props.userIds}
        excludedList={props.memberIds.concat(props.guestIds)}
        shouldRenderCloseIcon
        classNameHeader={styles.listSearch}
        placeholder={t('Email address or name')}
        listFilter={props.userListFilter}
        rowRenderer={searchRowRenderer}
        footerRenderer={searchFooterRenderer}
        onClickDelete={props.onCloseUserSearch}
        onClickOutside={props.onSearchClickOutside}
      />
    );
  }

  function searchRowRenderer({ item }) {
    return (
      <div
        key={`MembersRightPanelChatSearchRow_${item}`}
        className={styles.searchRow}
        onClick={() => props.onAddUserToSubscribers(item)}
      >
        <PersonIcon userId={item} className={styles.searchRowPersonIcon} width={avatarSize} height={avatarSize} />
        <PersonFullName userId={item} className={styles.searchRowPersonName} />
        <div className={styles.searchRowLabel} style={{ color: props.color }}>
          {t('Add to project')}
        </div>
      </div>
    );
  }

  function searchFooterRenderer(list, value) {
    if (!value || value === '') {
      return null;
    }

    return (
      <div
        className={`
          ${styles.searchFooterWrapper}
          ${list.size === 0 ? styles.searchFooterWrapperEmptyList : undefined}
        `}
      >
        <div className={styles.searchFooter} onClick={() => props.onClickInvite(value)}>
          <div className={styles.searchFooterValue}>{value}</div>
          <div className={styles.searchFooterLabel} style={{ color: props.color }}>
            {props.isInvitingGuestChecked ? t('Invite guest') : t('Invite member')}
          </div>
        </div>
        {!props.isInvitingGuestDirectly && renderGuestCheckbox()}
      </div>
    );
  }

  function renderGuestCheckbox() {
    return (
      <div className={styles.guestCheckbox} onClick={() => props.onSetIsInvitingGuest(!props.isInvitingGuestChecked)}>
        <TooltipedDisabledElement
          isDisabled={!props.isWorkspaceGuestSeatsAvailable}
          message={t(
            `You have reached the maximum guests number. You can change this limit by changing the number of seats on subscription page or by removing other guests.`,
          )}
        >
          <Checkbox
            className={styles.checkbox}
            color={props.color}
            isChecked={props.isInvitingGuestChecked}
            isDisabled={!props.isWorkspaceGuestSeatsAvailable}
          />
        </TooltipedDisabledElement>
        {t('Invite as a guest')}
        <GuestHintIcon />
      </div>
    );
  }

  function renderMemberList() {
    return (
      <>
        {renderMembersHeader()}
        {props.memberIds.size > 0 && (
          <div className={props.guestIds.size > 0 ? styles.list : styles.longList}>
            {props.memberIds.map(renderMemberListItem)}
          </div>
        )}
        {props.isOrganizationUsersLoading ? <div className={styles.loader}></div> : null}
      </>
    );
  }

  function renderGuestList() {
    return (
      <>
        {renderGuestHeader()}
        {props.guestIds.size > 0 && <div className={styles.list}>{props.guestIds.map(renderMemberListItem)}</div>}
        {props.isOrganizationUsersLoading ? <div className={styles.loader}></div> : null}
      </>
    );
  }

  function renderMemberListItem(userId) {
    return (
      <MemberListItem
        key={`MemberListItem_${userId}`}
        projectId={props.projectId}
        userId={userId}
        onMemberRemove={props.onMemberRemove}
        onMemberClick={props.onMemberClick}
        shouldRenderMoreButton={props.shouldRenderMoreButton(userId)}
      />
    );
  }

  function renderMembersHeader() {
    return (
      <div className={styles.header}>
        <div className={styles.leftActions}>
          <RightPanelLabel objectId={props.projectId} currentPanelName={MEMBERS} />
        </div>
        {props.canCurrentUserAddMember && !props.isConversation && (
          <div className={styles.rightActions}>
            <SecondaryButton className={styles.plusButton} color={props.color} onClick={props.onOpenUserSearch}>
              {t('Add member')}
            </SecondaryButton>
          </div>
        )}
      </div>
    );
  }

  function renderGuestHeader() {
    return (
      <div className={styles.guestsHeader}>
        <span className={styles.guestsHeaderText} style={{ color: props.color }}>
          {t('Guests')}
          <GuestHintIcon />
        </span>
        {props.canCurrentUserAddMember && (
          <div className={styles.rightActions}>
            <TooltipedDisabledElement
              isDisabled={!props.isWorkspaceGuestSeatsAvailable}
              message={t(
                `You have reached the maximum guests number. You can change this limit by changing the number of seats on subscription page or by removing other guests.`,
              )}
            >
              <SecondaryButton
                className={styles.plusButton}
                color={props.color}
                isDisabled={!props.isWorkspaceGuestSeatsAvailable}
                onClick={() => {
                  props.onSetIsInviteGuestSearchVisible(true);
                }}
              >
                {t('Add guest')}
              </SecondaryButton>
            </TooltipedDisabledElement>
          </div>
        )}
      </div>
    );
  }

  function renderLeaveSpace() {
    return (
      <div className={styles.leaveSpaceRow}>
        <LeaveSpaceController projectId={props.projectId} color={props.color} />
      </div>
    );
  }
}

export default MembersRightPanelChat;
