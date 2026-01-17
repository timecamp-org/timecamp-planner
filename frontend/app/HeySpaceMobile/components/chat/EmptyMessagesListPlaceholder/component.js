import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image } from 'react-native'
import styles from './styles'

import Assets from 'common/commonAssets'

EmptyMessagesListPlaceholder.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
}

function EmptyMessagesListPlaceholder(props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.mascot}
        source={{ uri: Assets.CHARACTER_2 }}
        resizeMode={'contain'}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.subTitle}>{props.subTitle}</Text>
      </View>
    </View>
  )
}


export default EmptyMessagesListPlaceholder
