import { List } from 'immutable';
import ImmutablePropTypes from 'immutable-prop-types';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import { useTranslation } from 'i18n';
import { organizationRoleLabels } from 'models/domain/OrganizationsModel/types';

import UnderlinedDropdown from 'commonComponents/UnderlinedDropdown';
import GuestProfileModal from '../GuestProfileModal';

WorkspaceRolesDropdown.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string,
  isDisabled: PropTypes.bool,
  isOpen: PropTypes.bool,
  isUserRegistered: PropTypes.bool,
  shouldRenderDropdown: PropTypes.bool,
  isGuestProfileVisible: PropTypes.bool,
  availableUserRoles: ImmutablePropTypes.list,
  onSelectRole: PropTypes.func,
  onClickDropdownButton: PropTypes.func,
  onClick: PropTypes.func,
  onSetIsModalVisible: PropTypes.func,
};

WorkspaceRolesDropdown.defaultProps = {
  className: '',
  isDisabled: false,
  isOpen: false,
  isUserRegistered: false,
  shouldRenderDropdown: false,
  isGuestProfileVisible: false,
  availableUserRoles: new List(),
  onSelectRole: doNothing,
  onClick: doNothing,
  onSetIsModalVisible: doNothing,
};

function WorkspaceRolesDropdown(props) {
  const { t } = useTranslation();

  return (
    <>
      <UnderlinedDropdown
        header={t('Change role')}
        isDisabled={props.isDisabled}
        label={
          props.isUserRegistered
            ? props.shouldRenderDropdown
              ? t(organizationRoleLabels[props.userOrganizationRole])
              : t(organizationRoleLabels[props.userOrganizationRole])
            : t('pending invitation')
        }
        items={props.availableUserRoles.map((availableUserRole) => {
          return {
            label: t(organizationRoleLabels[availableUserRole]),
            isSelected: props.userOrganizationRole === availableUserRole,
            props: {
              onClick: () => props.onSelectRole(availableUserRole),
            },
          };
        })}
      />
      <GuestProfileModal
        isModalVisible={props.isGuestProfileVisible}
        userId={props.userId}
        isConvertingToGuest={true}
        onSetIsModalVisible={props.onSetIsModalVisible}
      />
    </>
  );
}

export default WorkspaceRolesDropdown;
