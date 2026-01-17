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
import { ChatNotificationSettingsType } from 'models/domain/NotificationsModel/types';

ManageSpaceChatNotifications.propTypes = {
  chatNotificationSettingsType: PropTypes.string.isRequired,
  onSetAllNotificationsEnabled: PropTypes.func,
  onSetMentionsOnlyNotificationsEnabled: PropTypes.func,
  onSetNoNotificationsEnabled: PropTypes.func,
};

ManageSpaceChatNotifications.defaultProps = {
  onSetAllNotificationsEnabled: doNothing,
  onSetMentionsOnlyNotificationsEnabled: doNothing,
  onSetNoNotificationsEnabled: doNothing,
};

function ManageSpaceChatNotifications(props) {
  return (
    <View style={styles.container}>
      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'All new messages'}
        right={props.chatNotificationSettingsType === ChatNotificationSettingsType.ALL ? renderTickIcon(props) : null}
        onPress={props.onSetAllNotificationsEnabled}
      />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsSectionDivider
        shouldRenderTopPadding={false}
        title={'Notify me about all new messages in this project.'}
      />

      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Just mentions'}
        right={
          props.chatNotificationSettingsType === ChatNotificationSettingsType.ONLY_MENTIONS
            ? renderTickIcon(props)
            : null
        }
        onPress={props.onSetMentionsOnlyNotificationsEnabled}
      />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsSectionDivider
        shouldRenderTopPadding={false}
        title={'Notify me about any mention used in project e.g. @yourname, @here.'}
      />

      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Nothing'}
        right={
          props.chatNotificationSettingsType === ChatNotificationSettingsType.NOTHING ? renderTickIcon(props) : null
        }
        onPress={props.onSetNoNotificationsEnabled}
      />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsSectionDivider
        shouldRenderTopPadding={false}
        title={'Mute all chat notifications. Muted project will appear grayed out on your menu.'}
      />
    </View>
  );
}

function renderTickIcon(props) {
  return <TickIOS style={styles.tickIcon} color={props.isProjectEditable ? undefined : cloudyBlueColor} />;
}

export default ManageSpaceChatNotifications;
