import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isValidPassword } from 'common/utils/validation';

import { onPasswordChange } from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';
import { HumanMessage } from 'models/domain/HumanMessageModel/models'
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types'
import { onAddAlert } from 'models/component/PopUpAlertsModel/actions';
import { onPasswordChangeWrongPassword } from 'common/utils/makeActionResult';
import { i18n } from 'i18n';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(ComposedComponent) {
  class EnhanceUserProfilePasswordChange extends BaseComponent {
    static propTypes = {
      passwordChangeActionResult: PropTypes.object,

      onPasswordChange: PropTypes.func,
      onAddAlert: PropTypes.func,
    };

    state = {
      isFormVisible: false,
      isLoading: false,

      currentPasswordHumanMessage: null,
      newPasswordHumanMessage: null,
      confirmPasswordHumanMessage: null,
    };

    render() {
      return (
        <ComposedComponent
          isFormVisible={this.state.isFormVisible}
          isLoading={this.state.isLoading}
          currentPasswordHumanMessage={this.state.currentPasswordHumanMessage}
          newPasswordHumanMessage={this.state.newPasswordHumanMessage}
          confirmPasswordHumanMessage={this.state.confirmPasswordHumanMessage}
          currentPasswordRef={this.currentPasswordRef}
          newPasswordRef={this.newPasswordRef}
          confirmPasswordRef={this.confirmPasswordRef}
          onChangePassword={this.onChangePassword}
          onShowForm={this.onShowForm}
          onCurrentPasswordFocus={this.onCurrentPasswordFocus}
          onCurrentPasswordBlur={this.onCurrentPasswordBlur}
          onNewPasswordFocus={this.onNewPasswordFocus}
          onNewPasswordBlur={this.onNewPasswordBlur}
          onConfirmPasswordFocus={this.onConfirmPasswordFocus}
          onConfirmPasswordBlur={this.onConfirmPasswordBlur}
          onFormKeyDown={this.onFormKeyDown}
        />
      );
    }

    currentPasswordRef(ref) {
      this.currentPasswordInput = ref;
    }

    newPasswordRef(ref) {
      this.newPasswordInput = ref;
    }

    confirmPasswordRef(ref) {
      this.confirmPasswordInput = ref;
    }

    onFormKeyDown(event) {
      if (event.key === 'Enter') {
        this.onChangePassword();
      }
    }

    onCurrentPasswordBlur() {
      const currentPassword = this.currentPasswordInput.value;
      const validationResult = isValidPassword(currentPassword, true);

      if (currentPassword && !validationResult.isValid) {
        this.setState({
          currentPasswordHumanMessage: HumanMessage({
            text: validationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      } else {
        this.setState({
          currentPasswordHumanMessage: null,
        });
      }
    }

    onNewPasswordBlur() {
      const newPassword = this.newPasswordInput.value;
      const validationResult = isValidPassword(newPassword, true);

      if (!validationResult.isValid) {
        this.setState({
          newPasswordHumanMessage: HumanMessage({
            text: validationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      } else {
        this.setState({
          newPasswordHumanMessage: null,
        });
      }
    }

    onConfirmPasswordBlur() {
      const confirmPassword = this.confirmPasswordInput.value;
      const validationResult = isValidPassword(confirmPassword, true);

      if (!validationResult.isValid) {
        this.setState({
          confirmPasswordHumanMessage: HumanMessage({
            text: validationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      } else {
        this.setState({
          confirmPasswordHumanMessage: null,
        });
      }
    }

    onCurrentPasswordFocus() {
      this.setState({
        currentPasswordHumanMessage: null,
      });
    }

    onNewPasswordFocus() {
      this.setState({
        newPasswordHumanMessage: null,
      });
    }

    onConfirmPasswordFocus() {
      this.setState({
        confirmPasswordHumanMessage: null,
      });
    }

    onShowForm() {
      this.setState({
        isFormVisible: true,
      });
    }

    onChangePassword() {
      const currentPassword = this.currentPasswordInput.value;
      const newPassword = this.newPasswordInput.value;
      const confirmPassword = this.confirmPasswordInput.value;

      const currentPasswordValidationResult = isValidPassword(
        currentPassword,
        true
      );
      const newPasswordValidationResult = isValidPassword(newPassword, true);
      const confirmPasswordValidationResult = isValidPassword(
        confirmPassword,
        true
      );

      if (currentPassword && !currentPasswordValidationResult.isValid) {
        this.setState({
          currentPasswordHumanMessage: HumanMessage({
            text: currentPasswordValidationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      } else if (!newPasswordValidationResult.isValid) {
        this.setState({
          newPasswordHumanMessage: HumanMessage({
            text: newPasswordValidationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      } else if (!confirmPasswordValidationResult.isValid) {
        this.setState({
          confirmPasswordHumanMessage: HumanMessage({
            text: confirmPasswordValidationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      } else if (newPassword !== confirmPassword) {
        this.setState({
          confirmPasswordHumanMessage: HumanMessage({
            text: i18n.t('Your password and confirmation password do not match'),
            kind: HumanMessageKind.error,
          }),
        });
      } else {
        this.props.onPasswordChange(currentPassword, newPassword);

        this.setState({
          isLoading: true,
          currentPasswordHumanMessage: null,
          newPasswordHumanMessage: null,
          confirmPasswordHumanMessage: null,
        });
      }
    }

    componentDidUpdate(prevProps) {
      const state = {};
      if (
        this.props.passwordChangeActionResult &&
        this.props.passwordChangeActionResult !==
          prevProps.passwordChangeActionResult
      ) {
        const { isOk, humanMessage, code } =
          this.props.passwordChangeActionResult;

        if (isOk) {
          state.isFormVisible = false;
          this.props.onAddAlert({ humanMessage });
        } else if (code.indexOf(onPasswordChangeWrongPassword) !== -1) {
          state.currentPasswordHumanMessage = humanMessage;
        } else {
          this.props.onAddAlert({ humanMessage });
        }

        state.isLoading = false;

        this.setState(state);
      }
    }
  }

  function mapStateToProps(state) {
    return {
      passwordChangeActionResult:
        CurrentUserModelSelectors.onPasswordChangeActionResult(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onPasswordChange: (currentPassword, newPassword) => dispatch(onPasswordChange({ currentPassword, newPassword })),
      onAddAlert: (humanMessage) => dispatch(onAddAlert(humanMessage)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceUserProfilePasswordChange);
}

export default enhance;
