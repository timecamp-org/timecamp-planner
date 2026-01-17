import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { doNothing } from 'common/utils';

import { View } from 'react-native';
import IOSSettingsItem from '../../settings/IOSSettingsItem';
import IOSSettingsDivider from '../../settings/IOSSettingsDivider';
import IOSSettingsSectionDivider from '../../settings/IOSSettingsSectionDivider';
import TickIOS from 'Icons/TickIOS';
import { cloudyBlueColor } from 'common/commonStyles/colors';

ManageSpacePrivacyScreen.propTypes = {
  isSpacePrivate: PropTypes.bool.isRequired,
  isProjectEditable: PropTypes.bool,
  onSetSpaceIsPublic: PropTypes.func,
  onSetSpaceIsPrivate: PropTypes.func,
};

ManageSpacePrivacyScreen.defaultProps = {
  isProjectEditable: true,
  onSetSpaceIsPublic: doNothing,
  onSetSpaceIsPrivate: doNothing,
};

function ManageSpacePrivacyScreen(props) {
  return (
    <View style={styles.container}>
      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Public to team'}
        right={props.isSpacePrivate ? null : renderTickIcon(props)}
        onPress={props.isProjectEditable ? props.onSetSpaceIsPublic : doNothing}
      />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsSectionDivider
        shouldRenderTopPadding={false}
        title={'Project is visible to your all team members. Only people added to the project can edit it.'}
      />

      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Private'}
        right={props.isSpacePrivate ? renderTickIcon(props) : null}
        onPress={props.isProjectEditable ? props.onSetSpaceIsPrivate : doNothing}
      />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsSectionDivider
        shouldRenderTopPadding={false}
        title={'Project is private. Only people added to the project can view and edit it.'}
      />
    </View>
  );
}

function renderTickIcon(props) {
  return <TickIOS style={styles.tickIcon} color={props.isProjectEditable ? undefined : cloudyBlueColor} />;
}

export default ManageSpacePrivacyScreen;
