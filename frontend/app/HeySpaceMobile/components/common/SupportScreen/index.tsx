import React from 'react'
import { FC } from 'react'
import { View, Text, Linking } from 'react-native'
import styles from './styles'
import PrimaryButton from '../PrimaryButton'

const messengerUrl = 'https://m.me/heyspaceapp'
const email = 'planner@timecamp.com'

const SupportScreen: FC = () => (
  <View style={styles.Component}>
    <Text style={styles.header}>{'Need support?'}</Text>
    <PrimaryButton
      onPress={onOpenMessenger}
      style={styles.option}
    >
      <Text style={styles.text}>
        {'Contact us on Messeneger'}
      </Text>
    </PrimaryButton>
    <PrimaryButton
      onPress={onOpenMailto}
      style={styles.option}
    >
      <Text style={styles.text}>{'Write us an email'}</Text>
    </PrimaryButton>

  </View>
)

function onOpenMessenger() {
  Linking.openURL(messengerUrl)
}

function onOpenMailto() {
  Linking.openURL(`mailto:${email}?subject=[Mobile App]`)
}

export default SupportScreen