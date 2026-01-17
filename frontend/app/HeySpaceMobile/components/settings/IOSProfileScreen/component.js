import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import { TouchableOpacity } from 'react-native'
import { doNothing } from 'common/utils'
import PersonIcon from "components/person/PersonIcon"
import IOSSettingsSectionDivider from "components/settings/IOSSettingsSectionDivider"
import IOSSettingsDivider from "components/settings/IOSSettingsDivider"
import IOSSettingsTextInput from "components/settings/IOSSettingsTextInput"
import IOSSettingsItem from "components/settings/IOSSettingsItem"
import IOSSettingsButtonRightLink from 'components/settings/IOSSettingsButtonRightLink'

IOSProfileScreen.propTypes = {
  currentUserId: PropTypes.string.isRequired,
  // fullName
  fullName: PropTypes.string,
  fullNameValidationMessage: PropTypes.string,
  onBlurFullNameInput: PropTypes.func,
  // nickname
  nickname: PropTypes.string,
  nicknameValidationMessage: PropTypes.string,
  onBlurNicknameInput: PropTypes.func,
  // email
  email: PropTypes.string,
  emailValidationMessage: PropTypes.string,
  onBlurEmailInput: PropTypes.func,

  onChangeFullName: PropTypes.func,
  onChangeNickname: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onNavigateToChangePassword: PropTypes.func,
}

IOSProfileScreen.defaultProps = {
  fullName: '',
  onBlurFullNameInput: doNothing,
  nickname: '',
  email: '',
  onChangeFullName: doNothing,
  onChangeNickname: doNothing,
  onChangeEmail: doNothing,
  onNavigateToChangePassword: doNothing,
  }

function IOSProfileScreen(props) {
  return (
    <KeyboardAwareScrollView style={styles.container}>


      <TouchableOpacity style={styles.avatarWrapper}>
        <PersonIcon
          userId={props.currentUserId}
          shouldRenderOnlineIndicator={false}
          size={100}
        />
      </TouchableOpacity>

      <IOSSettingsSectionDivider title={'Full name'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        value={props.fullName}
        validationMessage={props.fullNameValidationMessage}
        onChangeText={props.onChangeFullName}
        onBlur={props.onBlurFullNameInput}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider title={'Nickname'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        value={props.nickname}
        validationMessage={props.nicknameValidationMessage}
        onChangeText={props.onChangeNickname}
        onBlur={props.onBlurNicknameInput}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider title={'Email'} />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsTextInput
        value={props.email}
        validationMessage={props.emailValidationMessage}
        onChangeText={props.onChangeEmail}
        onBlur={props.onBlurEmailInput}
      />
      <IOSSettingsDivider fullWidth />

      <IOSSettingsSectionDivider />
      <IOSSettingsDivider fullWidth />
      <IOSSettingsItem
        title={'Change password'}
        right={<IOSSettingsButtonRightLink />}
        onPress={props.onNavigateToChangePassword}
      />
      <IOSSettingsDivider fullWidth />

    </KeyboardAwareScrollView>
  )
}

export default React.memo(IOSProfileScreen)
