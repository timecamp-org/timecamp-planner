import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { doNothing } from 'common/utils'

import { View } from 'react-native'
import IOSSettingsSectionDivider from 'components/settings/IOSSettingsSectionDivider'
import IOSSettingsDivider from 'components/settings/IOSSettingsDivider'
import IOSSettingsTextInput from 'components/settings/IOSSettingsTextInput'

ChangePasswordScreen.propTypes = {
  currentPasswordInputValue: PropTypes.string.isRequired,
  currentPasswordInputValidationMessage: PropTypes.string,
  onChangeCurrentPassword: PropTypes.func,

  newPasswordInputValue: PropTypes.string.isRequired,
  newPasswordInputValidationMessage: PropTypes.string,
  onChangeNewPassword: PropTypes.func,
  onBlurNewPasswordInput: PropTypes.func,

  newPasswordRepeatedInputValue: PropTypes.string.isRequired,
  newPasswordRepeatedInputValidationMessage: PropTypes.string,
  onChangeNewPasswordRepeated: PropTypes.func,
  onBlurNewPasswordRepeatedInput: PropTypes.func,
}

ChangePasswordScreen.defaultProps = {
  onChangeCurrentPassword: doNothing,
  onChangeNewPassword: doNothing,
  onChangeNewPasswordRepeated: doNothing,
}

function ChangePasswordScreen(props) {
  return (
    <View style={styles.container}>

      <IOSSettingsSectionDivider title={'Current password'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        value={props.currentPasswordInputValue}
        secureTextEntry
        textContentType={'password'}
        validationMessage={props.currentPasswordInputValidationMessage}
        onChangeText={props.onChangeCurrentPassword}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider title={'New password'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        value={props.newPasswordInputValue}
        secureTextEntry
        textContentType={'newPassword'}
        validationMessage={props.newPasswordInputValidationMessage}
        onChangeText={props.onChangeNewPassword}
        onBlur={props.onBlurNewPasswordInput}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider title={'Repeat new password'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        value={props.newPasswordRepeatedInputValue}
        secureTextEntry
        textContentType={'newPassword'}
        validationMessage={props.newPasswordRepeatedInputValidationMessage}
        onChangeText={props.onChangeNewPasswordRepeated}
        onBlur={props.onBlurNewPasswordRepeatedInput}
      />
      <IOSSettingsDivider fullWidth />

    </View>
  )
}

export default ChangePasswordScreen
