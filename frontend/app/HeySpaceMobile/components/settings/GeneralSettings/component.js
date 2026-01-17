import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import styles from './styles';
import { doNothing } from 'common/utils';

import IOSSettingsButtonRightLink from '../IOSSettingsButtonRightLink';
import IOSSettingsItem from '../IOSSettingsItem';
import IOSSettingsDivider from '../IOSSettingsDivider';
import IOSSettingsSectionDivider from '../IOSSettingsSectionDivider';
import IOSSettingsSignOutButton from '../IOSSettingsSignOutButton';

GeneralSettings.propTypes = {
  // data
  userName: PropTypes.string,
  enabledNotificationsType: PropTypes.string,
  teamMembersCount: PropTypes.number,

  // handler fns
  onNavigateToProfileSettings: PropTypes.func.isRequired,
  onNavigateToNotificationsSettings: PropTypes.func.isRequired,
  onNavigateToTeamMembers: PropTypes.func.isRequired,
  onNavigateToSupportMessenger: PropTypes.func.isRequired,
  onNavigateToRateApp: PropTypes.func.isRequired,
};

GeneralSettings.defaultProps = {
  // data
  name: '',
  enabledNotificationsType: 'none',
  teamMembersCount: 1,

  // handler fns
  onNavigateToProfileSettings: doNothing,
  onNavigateToNotificationsSettings: doNothing,
  onNavigateToTeamMembers: doNothing,
  onNavigateToSupportMessenger: doNothing,
  onNavigateToRateApp: doNothing,
};

function GeneralSettings(props) {
  return (
    <ScrollView style={styles.container}>
      <IOSSettingsSectionDivider title={'Account'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Your profile'}
        right={<IOSSettingsButtonRightLink title={props.userName} />}
        onPress={props.onNavigateToProfileSettings}
      />
      <IOSSettingsDivider />
      <IOSSettingsItem
        title={'Notifications'}
        right={<IOSSettingsButtonRightLink title={props.enabledNotificationsType} />}
        onPress={props.onNavigateToNotificationsSettings}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider title={'Team'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Team members'}
        right={<IOSSettingsButtonRightLink title={props.teamMembersCount} />}
        onPress={props.onNavigateToTeamMembers}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Send feedback'}
        right={<IOSSettingsButtonRightLink />}
        onPress={props.onNavigateToSupportMessenger}
      />
      <IOSSettingsDivider />
      <IOSSettingsItem
        title={'Rate Planner'}
        right={<IOSSettingsButtonRightLink />}
        onPress={props.onNavigateToRateApp}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsSignOutButton />
      <IOSSettingsDivider fullWidth />
    </ScrollView>
  );
}

export default React.memo(GeneralSettings);
