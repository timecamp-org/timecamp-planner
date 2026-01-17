import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

import styles from './styles'

export default function TopBar(props) {
  return (
    <View style={styles.topBar}>
      <Text
        style={styles.topBarText}
        numberOfLines={1}
      >
        {props.text}
      </Text>
      <TouchableOpacity
        style={styles.topBarButton}
        onPress={props.onButtonClick}
      >
        <Text style={styles.topBarButtonText}>
          {props.buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
