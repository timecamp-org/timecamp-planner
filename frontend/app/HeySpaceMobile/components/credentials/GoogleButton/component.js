import React from 'react'
import { View, TouchableHighlight, Text, Image } from 'react-native'
import { whiteThreeColor } from 'styles/colors'

import styles from './styles'
import GoogleIcons from './assets'

export default function GoogleButton(props) {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={
          props.isDisabled
            ? styles.googleButtonDisabledWrapper
            : styles.googleButtonWrapper
        }
        underlayColor={whiteThreeColor}
        onPress={props.onSignIn}
        disabled={props.isDisabled}
      >
        <View style={styles.googleButton}>
          {renderIcon(props)}
          {renderText(props)}
        </View>
      </TouchableHighlight>
    </View>
  )
}

function renderIcon({ isDisabled }) {
  return (
    <Image
      style={styles.googleButtonIcon}
      source={isDisabled ? GoogleIcons.GIconGrey : GoogleIcons.GIcon}
    />
  )
}

function renderText({ isDisabled, text }) {
  return (
    <Text style={
      isDisabled
        ? styles.googleButtonDisabledText
        : styles.googleButtonText
    }>
      {text}
    </Text>
  )
}
