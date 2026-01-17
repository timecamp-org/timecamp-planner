import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { cloudyBlueColor, wisteria50Color, wisteriaColor, cloudyBlue50Color } from 'styles/colors'

import { ActivityIndicator, View, Text, Switch, StyleSheet } from 'react-native'
import { doNothing } from 'common/utils/index'

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
    : renderSettings()

  function renderLoader() {
    return (
      <View style={styles.loaderWrapper}>
        <ActivityIndicator size="large" color={wisteriaColor} />
      </View>
    )
  }

  function renderSettings() {
    return (
      <View style={styles.container}>
        <View style={styles.settings}>
          {renderHeader()}
          {renderMobileNotificationSetting()}
          {renderEmailNotificationSetting()}
        </View>
      </View>
    )
  }

  function renderHeader() {
    return (
      <Text style={styles.header}>{'Get notify through…'}</Text>
    )
  }

  function renderMobileNotificationSetting() {
    return (
      <React.Fragment>
        <View style={styles.inline}>
          <Switch
            value={props.isEnableMobileNotifications}
            onValueChange={props.onSwitchMobileNotifications}
            thumbColor={props.isEnableMobileNotifications ? wisteriaColor : cloudyBlueColor}
            trackColor={trackColor}
          />
          <Text style={styles.switchTitle}>{'Show pop up notifications '}</Text>
        </View>
        <Text style={styles.description}>{'You will receive notifications to your mobile device.'}</Text>
      </React.Fragment>
    )
  }

  function renderEmailNotificationSetting() {
    return (
      <React.Fragment>
        <View style={styles.inline}>
          <Switch
            value={props.isEnableEmailNotifications}
            onValueChange={props.onSwitchEmailNotifications}
            thumbColor={props.isEnableEmailNotifications ? wisteriaColor : cloudyBlueColor}
            trackColor={trackColor}
          />
          <Text style={styles.switchTitle}>{'Send email notifications'}</Text>
        </View>
        <Text style={StyleSheet.flatten([styles.description, styles.bottomDescription])}>{'You will receive an email notification when you’re not active on desktop.'}</Text>
      </React.Fragment>
    )
  }

}

export default NotificationSettings
