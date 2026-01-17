import React from 'react'
import { Text, View, Image } from 'react-native'

import PrimaryButton from 'commonComponents/PrimaryButton'

import styles from './styles'
import Assets from 'common/commonAssets'

export default function OfflinePage(props) {
  return (
    <View style={styles.component}>
      <Image
        style={styles.image}
        source={{ uri: Assets.CHARACTER_36 }}
      />
      <Text style={styles.title}>{'Ooops, you are offline'}</Text>
      <Text style={styles.message}>
       {`Something has gone wrong with the internet connection. Let's try again!`}
      </Text>
      <PrimaryButton
        text={'Retry'}
        onPress={props.onRetry}
      />
    </View>
  )
}
