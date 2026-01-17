import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { wisteria50Color, wisteriaColor, cloudyBlue50Color } from 'styles/colors'

import { ActivityIndicator, View  } from 'react-native'
import { doNothing } from 'common/utils/index'
import IOSSettingsSectionDivider from "components/settings/IOSSettingsSectionDivider";
import IOSSettingsDivider from "components/settings/IOSSettingsDivider";
import IOSSettingsItem from "components/settings/IOSSettingsItem";
import IOSSettingsSwitch from "components/settings/IOSSettingsSwitch";

const trackColor = { true: wisteria50Color, false: cloudyBlue50Color }

NotificationSettings.propTypes = {
  isEnableMobileNotifications: PropTypes.bool,
  isEnableEmailNotifications: PropTypes.bool,
  isNotificationsSettingsLoading: PropTypes.bool,

  onSwitchEmailNotifications: PropTypes.func,
  onSwitchMobileNotifications: PropTypes.func,
}

NotificationSettings.defaultProps = {
  isEnableMobileNotifications: false,
  isEnableEmailNotifications: false,
  isNotificationsSettingsLoading: false,

  onSwitchEmailNotifications: doNothing,
  onSwitchMobileNotifications: doNothing,
}

function NotificationSettings(props) {
  return props.isNotificationsSettingsLoading
    ? renderLoader()
    : (
      <View style={styles.iOSWrapper}>
        <IOSSettingsSectionDivider title={'You will receive notifications to your mobile device'} />
        <IOSSettingsDivider fullWidth />
        <IOSSettingsItem
          title={'Show push notifications'}
          right={<IOSSettingsSwitch value={props.isEnableMobileNotifications} onChange={props.onSwitchMobileNotifications} />}
        />
        <IOSSettingsDivider fullWidth />

        <IOSSettingsSectionDivider title={'You will receive email notifications when you’re not active'} />
        <IOSSettingsDivider fullWidth />
        <IOSSettingsItem
          title={'Send email notifications'}
          right={<IOSSettingsSwitch value={props.isEnableEmailNotifications} onChange={props.onSwitchEmailNotifications} />}
        />
        <IOSSettingsDivider fullWidth />
      </View>
    )
}

function renderLoader() {
  return (
    <View style={styles.loaderWrapper}>
      <ActivityIndicator size="large" color={wisteriaColor} />
    </View>
  )
}

export default NotificationSettings
