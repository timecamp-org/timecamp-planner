import React from 'react'
import styles from './styles'

import { TouchableOpacity, View, Text } from 'react-native'

UserSettingsNavigation.propTypes = {

}

function UserSettingsNavigation(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={props.onGoToProfileSettings}
      >
        <Text style={styles.buttonText}>{'Profile settings'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={props.onGoToNotificationSettings}
      >
        <Text style={styles.buttonText}>{'Notification settings'}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default UserSettingsNavigation
