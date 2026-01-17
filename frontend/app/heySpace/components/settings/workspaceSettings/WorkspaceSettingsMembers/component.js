import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from 'common/utils';
import MultiInviteInput from 'commonComponents/MultiInviteInput';
import { useTranslation } from 'i18n';

import { Box, Checkbox } from '@mui/material';
import { CircleQuestion } from 'commonComponents/Icons/fontawesome/CircleQuestion';
import SpacePicker from 'components/projects/SpacePicker';
import styles from './styles.css';
import DisabledUsers from './usersTables/DisabledUsers';
import GuestUsers from './usersTables/GuestUsers';
import ActiveUsers from './usersTables/ActiveUsers';

const usersTableStyles = {
  padding: '0.7rem 1.5rem',
};

const subtitleElement = {
  flex: 1,
  paddingLeft: '1rem',
};

const subtitleElementRight = {
  flex: 1,
  paddingLeft: '2rem',

  '&>div': {
    display: 'inline-block',
  },
};

const emptyList = new List();

WorkspaceSettingsMembers.propTypes = {
  isCurrentUserOrganizationAdmin: PropTypes.bool.isRequired,
  userIdList: ImmutablePropTypes.list.isRequired,
  guestUserIds: ImmutablePropTypes.list.isRequired,
  deactivatedUserIds: ImmutablePropTypes.list.isRequired,
  isActiveUsersVisible: PropTypes.bool.isRequired,
  isGuestUsersVisible: PropTypes.bool.isRequired,
  isDisabledUsersVisible: PropTypes.bool.isRequired,
  userSeatCount: PropTypes.number.isRequired,
  guestSeatCount: PropTypes.number.isRequired,
  occupiedGuestSeats: PropTypes.number.isRequired,
  isGuestInfoVisible: PropTypes.bool.isRequired,

  onSendInvitations: PropTypes.func.isRequired,
  onActiveUsersSwitcherClick: PropTypes.func.isRequired,
  onGuestUsersSwitcherClick: PropTypes.func.isRequired,
  onDisabledUsersSwitcherClick: PropTypes.func.isRequired,
  onSetIsGuestInfoVisible: PropTypes.func.isRequired,
  shouldRenderWorkspaceMemberOptions: PropTypes.func.isRequired,
};

WorkspaceSettingsMembers.defaultProps = {
  isCurrentUserOrganizationAdmin: false,
  userIdList: emptyList,
  guestUserIds: emptyList,
  deactivatedUserIds: emptyList,
  isActiveUsersVisible: false,
  isGuestUsersVisible: false,
  isDisabledUsersVisible: false,
  userSeatCount: 0,
  guestSeatCount: 0,
  occupiedGuestSeats: 0,
  isGuestInfoVisible: false,

  onSendInvitations: doNothing,
  onActiveUsersSwitcherClick: doNothing,
  onGuestUsersSwitcherClick: doNothing,
  onDisabledUsersSwitcherClick: doNothing,
  onSetIsGuestInfoVisible: doNothing,
  shouldRenderWorkspaceMemberOptions: doNothing,
};

function WorkspaceSettingsMembers(props) {
  const { t } = useTranslation();

  const shouldRenderDisabledUsersSwitcher = props.isCurrentUserOrganizationAdmin && !props.deactivatedUserIds.isEmpty();
  const shouldRenderDisabledUsers = props.isCurrentUserOrganizationAdmin && props.isDisabledUsersVisible;

  return (
    <div className={props.className || styles.Component}>
      <div className={styles.title}>{t('Workspace members')}</div>
      <span className={styles.subtitle}>{t('Invite others to your workspace and start working together.')}</span>
      <div className={styles.inviteRow}>
        <MultiInviteInput
          className={styles.multiInviteInput}
          onSubmit={props.onSendInvitations}
          placeholder={t('User e-mail')}
          submitButtonLabel={t('Send invitation')}
        />
      </div>
      <div className={styles.subtitle}>
        <Box sx={subtitleElement}>
          <Checkbox
            onChange={(e, isChecked) => {
              props.onSetIsProjectDropdownShown(isChecked);
            }}
          />
          <span>{t('Invite as guest to a project.')}</span>
          <CircleQuestion className={styles.circleQuestion} />
        </Box>
        <Box sx={subtitleElementRight}>
          {props.isProjectDropdownVisible && (
            <div>
              <SpacePicker isDisabled={props.isGuestsExceeded} onSelectedSpacesChange={props.onSelectedSpacesChange} />
            </div>
          )}
        </Box>
      </div>
      {!props.userIdList.isEmpty() && (
        <Box sx={usersTableStyles}>
          <ActiveUsers
            isOpen={props.isActiveUsersVisible}
            onToggle={props.onActiveUsersSwitcherClick}
            count={`${props.userIdList.size}/${props.userSeatCount}`}
          />
        </Box>
      )}

      {!props.guestUserIds.isEmpty() && (
        <Box sx={usersTableStyles}>
          <GuestUsers
            isOpen={props.isGuestUsersVisible}
            onToggle={props.onGuestUsersSwitcherClick}
            records={props.guestUserIds}
            count={`${props.occupiedGuestSeats}/${props.guestSeatCount}`}
          />
        </Box>
      )}

      {shouldRenderDisabledUsersSwitcher && (
        <Box sx={usersTableStyles}>
          <DisabledUsers
            isOpen={shouldRenderDisabledUsers}
            onToggle={props.onDisabledUsersSwitcherClick}
            records={props.deactivatedUserIds}
            count={props.deactivatedUserIds.size}
          />
        </Box>
      )}
    </div>
  );
}

export default WorkspaceSettingsMembers;
