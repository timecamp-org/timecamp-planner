import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AppEventEmitter } from 'common/services'
import RouteName from 'components/AppNavigation/routeNames'

import BaseComponent from 'BaseComponent'
import {
  selectCurrentUserEmail,
  selectCurrentUserFullName,
  selectCurrentUserId,
  selectCurrentUserNickname,
} from 'models/domain/UsersModel/selectors/domain'
import { SAVE_PROFILE_SETTINGS_EVENT } from 'components/settings/IOSSettingsNavButton/enhancers/EnhanceSaveProfileSettingsButton'
import { isValidEmail, isValidFullName, prepareFullName, isValidNickname } from 'common/utils/validation'
import * as UsersModelActions from 'models/domain/UsersModel/actions'
import handleError from 'common/utils/handleError'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceProfileScreen extends BaseComponent {

    static propTypes = {
      currentUserId: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      nickname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }

    state = {
      fullName: this.props.fullName,
      fullNameValidationMessage: null,

      nickname: this.props.nickname,
      nicknameValidationMessage: null,

      email: this.props.email,
      emailValidationMessage: null,
    }

    render() {
      return (
        <ComposedComponent
          currentUserId={this.props.currentUserId}

          // fullName
          fullName={this.state.fullName}
          fullNameValidationMessage={this.state.fullNameValidationMessage}
          onBlurFullNameInput={this.onBlurFullNameInput}

          nickname={this.state.nickname}
          nicknameValidationMessage={this.state.nicknameValidationMessage}
          onBlurNicknameInput={this.onBlurNicknameInput}

          email={this.state.email}
          emailValidationMessage={this.state.emailValidationMessage}
          onBlurEmailInput={this.onBlurEmailInput}

          onChangeFullName={this.onChangeFullName}
          onChangeNickname={this.onChangeNickname}
          onChangeEmail={this.onChangeEmail}
          onNavigateToChangePassword={this.onNavigateToChangePassword}
        />
      )
    }

    // full name handlers

    onChangeFullName(fullName) {
      this.setState({
        fullName,
      })
    }

    onBlurFullNameInput() {
      const { isValid, message } = this.validateFullNameInput()

      if (!isValid) {
        this.setState({
          fullNameValidationMessage: message,
        })
      } else {
        this.setState({
          fullNameValidationMessage: null,
        })
      }
    }

    validateFullNameInput() {
      return isValidFullName(this.state.fullName, true)
    }

    onUpdateFullName() {
      const fullName = prepareFullName(this.state.fullName)
      const [firstName, lastName] = fullName.split(' ')
      this.props.onFirstNameUpdate(this.props.currentUserId, firstName)
      this.props.onLastNameUpdate(this.props.currentUserId, lastName)
    }

    // nickname handlers

    onChangeNickname(nickname) {
      this.setState({
        nickname,
      })
    }

    validateNickname() {
      return isValidNickname(this.state.nickname, true)
    }

    onBlurNicknameInput() {
      const { isValid, message } = this.validateNickname()
      if (!isValid) {
        this.setState({
          nicknameValidationMessage: message,
        })
      } else {
        this.setState({
          nicknameValidationMessage: null,
        })
      }
    }

    updateNickname() {
      this.props.onNicknameUpdate(this.props.currentUserId, this.state.nickname)
    }


    // email handlers

    onChangeEmail(email) {
      this.setState({
        email,
      })
    }

    validateEmail() {
      return isValidEmail(this.state.email, true)
    }

    onBlurEmailInput() {
      const { isValid, message } = this.validateEmail()
      if (!isValid) {
        this.setState({
          emailIsValid: isValid,
          emailValidationMessage: message,
        })
      } else {
        this.setState({
          emailIsValid: true,
          emailValidationMessage: null,
        })
      }
    }

    updateEmail() {
      const { email } = this.state
      this.props.onEmailUpdate(email)
    }

    // avatar handlers

    onSetInitialsAvatar() {
      this.props.onAvatarUpdate(this.props.currentUserId, null)
    }

    onChooseFile(files) {
      if (files && files.length > 0) {
        this.props.onAvatarUpload(files[0])
      } else {
        handleError(new Error('Error selecting file'))
      }
    }

    handleSaveSettingsEvent() {
      if (!this.state.fullNameValidationMessage
        && !this.state.nicknameValidationMessage
        && !this.state.emailValidationMessage) {
        let didAnythingChange = false

        if (this.state.fullName !== this.props.fullName) {
          this.onUpdateFullName()
          didAnythingChange = true
        }

        if (this.state.nickname !== this.props.nickname) {
          this.updateNickname()
          didAnythingChange = true
        }

        if (this.state.email !== this.props.email) {
          this.updateEmail()
          didAnythingChange = true
        }

        if (didAnythingChange) {
          this.props.onUpdateUser()
        }
        NavigationService.pop()
      }
    }

    componentDidMount() {
      AppEventEmitter.on(SAVE_PROFILE_SETTINGS_EVENT, this.handleSaveSettingsEvent)
    }

    componentWillUnmount() {
      AppEventEmitter.removeListener(SAVE_PROFILE_SETTINGS_EVENT, this.handleSaveSettingsEvent)
    }

    onNavigateToChangePassword() {
      NavigationService.navigate(RouteName.CHANGE_PASSWORD)
    }

  }

  const mapStateToProps = (state, props) => ({
    currentUserId: selectCurrentUserId(state),
    fullName: selectCurrentUserFullName(state),
    nickname: selectCurrentUserNickname(state),
    email: selectCurrentUserEmail(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onFirstNameUpdate: (userId, firstName) => dispatch(UsersModelActions.onFirstNameUpdate(userId, firstName)),
    onLastNameUpdate: (userId, lastName) => dispatch(UsersModelActions.onLastNameUpdate(userId, lastName)),
    onNicknameUpdate: (userId, nickname) => dispatch(UsersModelActions.onNicknameUpdate(userId, nickname)),
    onEmailUpdate: (userId, email) => dispatch(UsersModelActions.onEmailUpdate(userId, email)),
    onUpdateUser: () => dispatch(UsersModelActions.onUpdateUser(null, true)),
    onAvatarUpdate: (userId, avatarUrl) => dispatch(UsersModelActions.onAvatarUpdate(userId, avatarUrl)),
    onAvatarUpload: (file) => dispatch(UsersModelActions.onAvatarUpload(file)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceProfileScreen)
}

export default enhance
