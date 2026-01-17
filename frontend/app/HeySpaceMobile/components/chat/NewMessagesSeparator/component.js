import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

export default function NewMessagesSeparator(props) {
  return (
    <View style={styles.separator}>
      <View style={styles.lineLeft} />
      <Text style={styles.text}>{'New messages'}</Text>
      <View style={styles.lineRight} />
    </View>
  )
}
