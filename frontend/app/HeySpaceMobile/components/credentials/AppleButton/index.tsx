import React from 'react'
import { View, TouchableHighlight, Text, Image } from 'react-native';
import useComponent from './hook'
import styles from './styles'
import { whiteThreeColor } from 'styles/colors'
import appleLogo from './assets/apple_logo.png'
import { AppleButton } from '@invertase/react-native-apple-authentication'

export type AppleButtonInterface = {
  buttonType: AppleButton.Type,
  isDisabled?: boolean,
}

const AppleButtonComponent = (props: AppleButtonInterface) => {
  const {
    buttonType,
    onAppleButtonPress,
  } = useComponent(props)
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={
          props.isDisabled
            ? styles.appleButtonDisabledWrapper
            : styles.appleButtonWrapper
        }
        underlayColor={whiteThreeColor}
        onPress={onAppleButtonPress}
        disabled={props.isDisabled}
      >
        <View style={styles.appleButton}>
          {renderIcon()}
          {renderText(props.isDisabled, buttonType)}
        </View>
      </TouchableHighlight>
    </View>
  )
}


function renderIcon() {
  return (
    <Image
      style={styles.appleButtonIcon}
      source={appleLogo}
    />
  )
}

function renderText(isDisabled: boolean, buttonType: AppleButton.Type) {
  return (
    <Text style={
      isDisabled
        ? styles.appleButtonDisabledText
        : styles.appleButtonText
    }>
      { buttonType === AppleButton.Type.SIGN_IN ? 'Sign in with Apple' : 'Sign up with Apple'}
    </Text>
  )
}

export default AppleButtonComponent