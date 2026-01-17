import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { AppEventEmitter } from 'common/services'
import { CHANGE_PASSWORD_EVENT } from 'components/settings/IOSSettingsNavButton/enhancers/EnhanceChangePasswordButton'

import BaseComponent from 'BaseComponent'
import { onPasswordChange, onPasswordChangeActonResultClear } from 'models/domain/CurrentUserModel/actions'
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors'
import { isValidNewPassword } from 'common/utils/validation'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class EnhanceChangePasswordScreen extends BaseComponent {

    static propTypes = {
      passwordChangeActionResult: PropTypes.object,

      onPasswordChange: PropTypes.func.isRequired,
      onPasswordChangeActonResultClear: PropTypes.func.isRequired,
    }

    state = {
      currentPasswordInputValue: '',
      currentPasswordInputValidationMessage: null,

      newPasswordInputValue: '',
      newPasswordInputValidationMessage: null,

      newPasswordRepeatedInputValue: '',
      newPasswordRepeatedInputValidationMessage: null,
    }

    render() {
      return (
        <ComposedComponent
          currentPasswordInputValue={this.state.currentPasswordInputValue}
          onChangeCurrentPassword={this.onChangeCurrentPassword}

          newPasswordInputValue={this.state.newPasswordInputValue}
          newPasswordInputValidationMessage={this.state.newPasswordInputValidationMessage}
          onChangeNewPassword={this.onChangeNewPassword}
          onBlurNewPasswordInput={this.onBlurNewPasswordInput}

          newPasswordRepeatedInputValue={this.state.newPasswordRepeatedInputValue}
          newPasswordRepeatedInputValidationMessage={this.state.newPasswordRepeatedInputValidationMessage}
          onChangeNewPasswordRepeated={this.onChangeNewPasswordRepeated}
          onBlurNewPasswordRepeatedInput={this.onBlurNewPasswordRepeatedInput}
        />
      )
    }

    onChangeCurrentPassword(currentPasswordInputValue) {
      this.setState({
        currentPasswordInputValue,
      })
    }

    onChangeNewPassword(newPasswordInputValue) {
      this.setState({
        newPasswordInputValue,
      })
    }

    validateNewPassword() {
      const {
        newPasswordInputValue: newPassword,
        currentPasswordInputValue: currentPassword,
      } = this.state

      return isValidNewPassword(currentPassword, newPassword, true)
    }

    onBlurNewPasswordInput() {
      const { isValid, message: newPasswordInputValidationMessage } = this.validateNewPassword()

      if (isValid) {
        this.setState({
          newPasswordInputValidationMessage: null,
        })
      } else {
        this.setState({
          newPasswordInputValidationMessage,
        })
      }
    }

    onChangeNewPasswordRepeated(newPasswordRepeatedInputValue) {
      this.setState({
        newPasswordRepeatedInputValue,
      })
    }

    validateNewPasswordRepeated() {
      const { newPasswordInputValue: newPassword, newPasswordRepeatedInputValue: newPasswordRepeated } = this.state

      if (newPasswordRepeated !== newPassword) {
        return {
          isValid: false,
          message: 'Passwords must match',
        }
      } else {
        return {
          isValid: true,
          message: null,
        }
      }
    }

    onBlurNewPasswordRepeatedInput() {
      const { isValid, message: newPasswordRepeatedInputValidationMessage } = this.validateNewPasswordRepeated()

      if (isValid) {
        this.setState({
          newPasswordRepeatedInputValidationMessage: null,
        })
      } else {
        this.setState({
          newPasswordRepeatedInputValidationMessage,
        })
      }
    }

    handleChangePasswordEvent() {
      const {
        newPasswordRepeatedInputValue: newPassword,
        currentPasswordInputValue: currentPassword,
      } = this.state

      const { isValid: isNewPasswordValid, message: newPasswordInputValidationMessage } = this.validateNewPassword()
      const { isValid: isNewPasswordRepeatedValid, message: newPasswordRepeatedInputValidationMessage } = this.validateNewPasswordRepeated()

      if (isNewPasswordValid && isNewPasswordRepeatedValid) {
        this.props.onPasswordChange(currentPassword, newPassword)
      } else {
        this.setState({
          newPasswordInputValidationMessage,
          newPasswordRepeatedInputValidationMessage,
        })
      }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      const passwordChangeIsOk = !prevProps.passwordChangeActionResult
        && this.props.passwordChangeActionResult
        && this.props.passwordChangeActionResult.get('isOk')

      const passwordChangeBecomeOk = prevProps.passwordChangeActionResult
        && !prevProps.passwordChangeActionResult.get('isOk')
        && this.props.passwordChangeActionResult
        && this.props.passwordChangeActionResult.get('isOk')

      if (passwordChangeIsOk || passwordChangeBecomeOk) {
        NavigationService.pop()
      }
    }

    componentDidMount() {
      AppEventEmitter.on(CHANGE_PASSWORD_EVENT, this.handleChangePasswordEvent)
    }

    componentWillUnmount() {
      this.props.onPasswordChangeActonResultClear()
      AppEventEmitter.removeListener(CHANGE_PASSWORD_EVENT, this.handleChangePasswordEvent)
    }

  }

  const mapStateToProps = (state, props) => ({
    passwordChangeActionResult: CurrentUserModelSelectors.onPasswordChangeActionResult(state),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onPasswordChange: (currentPassword, newPassword) => dispatch(onPasswordChange({ currentPassword, newPassword })),
    onPasswordChangeActonResultClear: () => dispatch(onPasswordChangeActonResultClear()),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceChangePasswordScreen)
}

export default enhance
