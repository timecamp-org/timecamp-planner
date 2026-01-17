import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, Image } from 'react-native'
import styles from './styles'

import Assets from 'common/commonAssets'
import PrimaryButton from 'commonComponents/PrimaryButton'

AccessForbiddenScreen.propTypes = {
  text: PropTypes.string,
  onNavigateBack: PropTypes.func.isRequired,
}

AccessForbiddenScreen.defaultProps = {
  text: `You don't have permissions to view this resource`,
}

function AccessForbiddenScreen(props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.mascot}
        source={{ uri: Assets.CHARACTER_32 }}
        resizeMode={'contain'}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{`Access Forbidden!`}</Text>
        <Text style={styles.subTitle}>{props.text}</Text>
        <PrimaryButton
          text={'Go back'}
          onPress={props.onNavigateBack}
        />
      </View>
    </View>
  )
}


export default AccessForbiddenScreen
