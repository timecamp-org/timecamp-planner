import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { doNothing } from 'common/utils'

import { View, TextInput, Text, StyleSheet } from 'react-native'
import IOSSettingsDivider from "components/settings/IOSSettingsDivider"

IOSSettingsTextInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  validationMessage: PropTypes.string,
  autoFocus: PropTypes.bool,
  onChangeText: PropTypes.func,
  textContentType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onBlur: PropTypes.func,
  setInputRef: PropTypes.func,
}

IOSSettingsTextInput.defaultProps = {
  placeholder: '',
  value: '',
  autoFocus: false,
  onChangeText: doNothing,
  textContentType: 'none',
  secureTextEntry: false,
  isDisabled: false,
  onBlur: doNothing,
  setInputRef: doNothing,
}

function IOSSettingsTextInput(props) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        ref={props.setInputRef}
        autoFocus={props.autoFocus}
        placeholder={props.placeholder}
        style={StyleSheet.flatten([styles.textInput, props.isDisabled ? styles.disabled : {}])}
        value={props.value}
        secureTextEntry={props.secureTextEntry}
        textContentType={props.inputType}
        editable={!props.isDisabled}
        onChangeText={props.onChangeText}
        onBlur={props.onBlur}
      />
      {props.validationMessage && <IOSSettingsDivider/>}
      {props.validationMessage && 
        <View style={styles.validationMessageWrapper}>
          <Text style={styles.validationMessage}>
            {props.validationMessage}
          </Text>
        </View>
      }
    </View>
  )
}

export default IOSSettingsTextInput
