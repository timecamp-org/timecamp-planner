import React from 'react';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';

import { ScrollView, StyleSheet, View } from 'react-native';
import IOSSettingsButtonRightLink from '../../settings/IOSSettingsButtonRightLink';
import IOSSettingsItem from '../../settings/IOSSettingsItem';
import IOSSettingsDivider from '../../settings/IOSSettingsDivider';
import IOSSettingsSectionDivider from '../../settings/IOSSettingsSectionDivider';
import IOSSettingsTextInput from '../../settings/IOSSettingsTextInput';
import IOSSettingsSwitch from '../../settings/IOSSettingsSwitch';
import styles from './styles';
import Info from 'Icons/Info';

ManageSpace.propTypes = {
  isSpaceBeingCreated: PropTypes.bool,
  spaceName: PropTypes.string,
  spacePurpose: PropTypes.string,
  spaceMembersCount: PropTypes.number,
  spaceColor: PropTypes.string,
  isCurrentUserFollowingSpace: PropTypes.bool,
  isProjectEditable: PropTypes.bool,

  onChangeSpaceName: PropTypes.func,
  onChangeSpacePurpose: PropTypes.func,
  onChangeIsCurrentUserFollowingSpace: PropTypes.func,
  onNavigateToSpaceMembers: PropTypes.func,
  onNavigateToSpaceColor: PropTypes.func,
  onNavigateToSpacePrivacy: PropTypes.func,
  onNavigateToSpaceChatNotifications: PropTypes.func,
};

ManageSpace.defaultProps = {
  isSpaceBeingCreated: false,
  spaceName: '',
  spacePurpose: '',
  spaceMembersCount: 0,
  spaceColor: '',
  isCurrentUserFollowingSpace: true,
  isProjectEditable: true,

  onChangeSpaceName: doNothing,
  onChangeSpacePurpose: doNothing,
  onChangeIsCurrentUserFollowingSpace: doNothing,
  onNavigateToSpaceMembers: doNothing,
  onNavigateToSpaceColor: doNothing,
  onNavigateToSpacePrivacy: doNothing,
  onNavigateToSpaceChatNotifications: doNothing,
};

function ManageSpace(props) {
  return (
    <ScrollView style={styles.container} keyboardDismissMode={'on-drag'}>
      <IOSSettingsSectionDivider title={'Project name'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        placeholder={'Project name'}
        value={props.spaceName}
        isDisabled={!props.isProjectEditable}
        onChangeText={props.onChangeSpaceName}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider title={'Purpose'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        placeholder={'Project purpose'}
        value={props.spacePurpose}
        isDisabled={!props.isProjectEditable}
        onChangeText={props.onChangeSpacePurpose}
      />

      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Members'}
        onPress={props.onNavigateToSpaceMembers}
        right={<IOSSettingsButtonRightLink title={props.spaceMembersCount} />}
      />

      <IOSSettingsDivider />
      <IOSSettingsItem
        title={'Project Color'}
        right={<IOSSettingsButtonRightLink additionalElement={renderColorSquare(props.spaceColor)} />}
        onPress={props.onNavigateToSpaceColor}
      />

      <IOSSettingsDivider />
      <IOSSettingsItem
        title={'Project Privacy'}
        onPress={props.onNavigateToSpacePrivacy}
        right={<IOSSettingsButtonRightLink additionalElement={<Info style={styles.infoIcon} />} />}
      />

      {props.isSpaceBeingCreated ? null : (
        <>
          <IOSSettingsDivider />
          <IOSSettingsItem
            title={'Project Chat Notifications'}
            onPress={props.onNavigateToSpaceChatNotifications}
            right={<IOSSettingsButtonRightLink additionalElement={<Info style={styles.infoIcon} />} />}
          />
        </>
      )}

      <IOSSettingsDivider />
      <IOSSettingsItem
        title={'Follow Project'}
        right={
          <IOSSettingsSwitch
            value={props.isCurrentUserFollowingSpace}
            onChange={props.onChangeIsCurrentUserFollowingSpace}
          />
        }
      />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsSectionDivider title={'Receive notifications when people make important changes to the project'} />
    </ScrollView>
  );
}

function renderColorSquare(color) {
  return <View style={StyleSheet.flatten([styles.colorSquare, { backgroundColor: color }])} />;
}

export default ManageSpace;
