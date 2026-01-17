import React from 'react'
import { Text, View } from 'react-native'

import styles from './styles'

export default function Header(props) {
  return (
    <View style={styles.container}>
      <Text
        style={styles.header}
        numberOfLines={1}
      >
        {props.text}
      </Text>
    </View>
  )
}
