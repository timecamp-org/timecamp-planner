import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { View, TouchableOpacity } from 'react-native'
import Badge from '../../notifications/Badge/allUnreadNotifications'
import Bell from 'Icons/Bell'
import { darkTwoColor, coralPinkColor, cloudyBlueColor } from 'common/commonStyles/colors'

NotificationsCenterIcon.propTypes = {
  areThereUnreadNotifications: PropTypes.bool,
  onNavigateToNotificationsCenter: PropTypes.func.isRequired,
}

NotificationsCenterIcon.defaultProps = {
  areThereUnreadNotifications: false,
}

function NotificationsCenterIcon(props) {
  return (
    <TouchableOpacity onPress={props.onNavigateToNotificationsCenter}>
      <View style={styles.container}>
        <Bell style={styles.icon} color={props.areThereUnreadNotifications ? coralPinkColor : cloudyBlueColor} />
        <Badge style={styles.badge} color={coralPinkColor} textColor={darkTwoColor} />
      </View>
    </TouchableOpacity>
  )
}

export default NotificationsCenterIcon
