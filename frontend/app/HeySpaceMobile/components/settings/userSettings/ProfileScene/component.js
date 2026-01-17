import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'
import { cloudyBlueColor } from 'styles/colors'

import { TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view'
import Paperclip from 'components/Icons/Paperclip'
import FileUpload from 'commonComponents/FileUpload'
import PersonIcon from 'components/person/PersonIcon'

ProfileScene.propTypes = {
  currentUserId: PropTypes.string.isRequired,

  userFullName: PropTypes.string.isRequired,
  userFullNameIsValid: PropTypes.bool.isRequired,
  userFullNameValidationMessage: PropTypes.string,
  onChangeFullNameInput: PropTypes.func.isRequired,
  onBlurFullNameInput: PropTypes.func.isRequired,
  onSubmitEditingFullNameInput: PropTypes.func.isRequired,

  nickname: PropTypes.string.isRequired,
  nicknameIsValid: PropTypes.bool.isRequired,
  nicknameValidationMessage: PropTypes.string,
  onChangeNicknameInput: PropTypes.func.isRequired,
  onBlurNicknameInput: PropTypes.func.isRequired,
  onSubmitEditingNicknameInput: PropTypes.func.isRequired,

  email: PropTypes.string.isRequired,
  emailIsValid: PropTypes.bool.isRequired,
  emailValidationMessage: PropTypes.string,
  onChangeEmailInput: PropTypes.func.isRequired,
  onBlurEmailInput: PropTypes.func.isRequired,
  onSubmitEditingEmailInput: PropTypes.func.isRequired,

  onSetInitialsAvatar: PropTypes.func.isRequired,
  onChooseFile: PropTypes.func.isRequired,
}

function ProfileScene(props) {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'Profile'}</Text>

          <View>
            <Text style={styles.label}>{'Full name:'}</Text>
            <TextInput
              style={StyleSheet.flatten([styles.input, props.userFullNameIsValid ? {} : styles.inputInvalid])}
              value={props.userFullName}
              onChangeText={props.onChangeFullNameInput}
              onBlur={props.onBlurFullNameInput}
              onSubmitEditing={props.onSubmitEditingFullNameInput}
            />
            <View style={styles.validationWrapper}>
              {props.userFullNameIsValid
                ? null
                : <Text style={styles.validationMessage}>{props.userFullNameValidationMessage}</Text>}
            </View>
          </View>

          <View>
            <Text style={styles.label}>{'Nickname:'}</Text>
            <TextInput
              style={StyleSheet.flatten([styles.input, props.nicknameIsValid ? {} : styles.inputInvalid])}
              value={props.nickname}
              onChangeText={props.onChangeNicknameInput}
              onBlur={props.onBlurNicknameInput}
              onSubmitEditing={props.onSubmitEditingNicknameInput}
            />
            <View style={styles.validationWrapper}>
              {props.nicknameIsValid
                ? null
                : <Text style={styles.validationMessage}>{props.nicknameValidationMessage}</Text>}
            </View>
          </View>

          <View>
            <Text style={styles.label}>{'Email:'}</Text>
            <TextInput
              style={StyleSheet.flatten([styles.input, props.emailIsValid ? {} : styles.inputInvalid])}
              value={props.email}
              onChangeText={props.onChangeEmailInput}
              onBlur={props.onBlurEmailInput}
              onSubmitEditing={props.onSubmitEditingEmailInput}
            />
            <View style={styles.validationWrapper}>
              {props.emailIsValid
                ? null
                : <Text style={styles.validationMessage}>{props.emailValidationMessage}</Text>}
            </View>
          </View>

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'You avatar'}</Text>
          <View style={styles.avatarSettingsWrapper}>
            <PersonIcon
              userId={props.currentUserId}
              size={100}
              showOnlineIndicator={false}
            />
            <View style={styles.avatarControls}>
              <FileUpload onUploadFiles={props.onChooseFile}>
                {(openFilesPicker) => (
                  <TouchableOpacity onPress={openFilesPicker}>
                    <View style={styles.buttonContent}>
                      <Paperclip style={styles.icon} color={cloudyBlueColor} />
                      <Text style={styles.buttonText}>{'Upload photo'}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </FileUpload>
              <TouchableOpacity onPress={props.onSetInitialsAvatar}>
                <View style={styles.buttonContent}>
                  <PersonIcon
                    userId={props.currentUserId}
                    size={25}
                    shouldRenderImageAvatar={false}
                    showOnlineIndicator={false}
                  />
                  <Text style={styles.buttonText}>{'Initials (no avatar)'}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>

    </KeyboardAwareScrollView>
  )
}

export default ProfileScene
