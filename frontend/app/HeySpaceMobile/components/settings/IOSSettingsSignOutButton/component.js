import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { Text, TouchableOpacity } from 'react-native'

IOSSettingsSignOutButton.propTypes = {
  onSignOut: PropTypes.func.isRequired,
}

function IOSSettingsSignOutButton(props) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onSignOut}>
      <Text style={styles.text}>{'Log out'}</Text>
    </TouchableOpacity>
  )
}

export default React.memo(IOSSettingsSignOutButton)
