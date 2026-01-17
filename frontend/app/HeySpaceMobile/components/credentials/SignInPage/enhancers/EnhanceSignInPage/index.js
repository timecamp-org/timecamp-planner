import React from "react";
import { Keyboard } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "BaseComponent";
import { isValidEmail, isValidPassword } from "common/utils/validation";
import RouteName from "../../../../AppNavigation/routeNames";

import { onSignIn } from "models/domain/CurrentUserModel/actions";
import * as CurrentUserModelSelectors from "models/domain/CurrentUserModel/selectors";
import * as CredentialsModelSelectors from "models/component/CredentialsModel/selectors";
import { fetchError } from "common/utils/makeActionResult";
import { AuthStatus } from "models/domain/CurrentUserModel/types";

import { NavigationService } from "common/services";

function Enhance(ComposedComponent) {
  class EnhanceSignInPage extends BaseComponent {
    static propTypes = {
      onSignIn: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          isLoading={this.props.isLoggingIn}
          validateEmail={this.validateEmail}
          validatePassword={this.validatePassword}
          genericHumanMessageModel={this.props.genericHumanMessageModel}
          isFetchError={this.isFetchError()}
          onSubmitEditingEmailInput={this.focusPasswordInput}
          onSubmitEditingPasswordInput={this.onSubmit}
          onSubmit={this.onSubmit}
          onGoToSignUpPage={this.onGoToSignUpPage}
          onGoToForgottenPassword={this.onGoToForgottenPassword}
          onSetEmailInputOuterRef={this.onSetEmailInputOuterRef}
          onSetPasswordInputOuterRef={this.onSetPasswordInputOuterRef}
          onSetEmailInputInnerRef={this.onSetEmailInputInnerRef}
          onSetPasswordInputInnerRef={this.onSetPasswordInputInnerRef}
        />
      );
    }

    isFetchError() {
      const { authenticateActionResult } = this.props;
      return (
        authenticateActionResult && authenticateActionResult.code === fetchError
      );
    }

    onSetEmailInputOuterRef(ref) {
      this.emailInputOuterRef = ref;
    }

    onSetPasswordInputOuterRef(ref) {
      this.passwordInputOuterRef = ref;
    }

    onSetEmailInputInnerRef(ref) {
      this.emailInputInnerRef = ref;
    }

    onSetPasswordInputInnerRef(ref) {
      this.passwordInputInnerRef = ref;
    }

    focusPasswordInput() {
      if (this.passwordInputOuterRef) {
        this.passwordInputInnerRef.focus();
      }
    }

    validateEmail(email) {
      const { isValid, message } = isValidEmail(email, true);
      return {
        isValid: isValid,
        message: isValid ? null : message,
      };
    }

    validatePassword(password) {
      const { isValid, message } = isValidPassword(password, true);
      return {
        isValid: isValid,
        message: isValid ? null : message,
      };
    }

    onSubmit() {
      const email = this.emailInputOuterRef.getValue();
      const password = this.passwordInputOuterRef.getValue();
      const isEmailValid = isValidEmail(email);
      const isPasswordValid = isValidPassword(password);

      if (isEmailValid && isPasswordValid) {
        if (!this.props.isLoggingIn) {
          Keyboard.dismiss();
          this.props.onSignIn(email, password);
        }
      }
    }

    onGoToSignUpPage() {
      NavigationService.navigate(RouteName.SIGN_UP);
    }

    onGoToForgottenPassword() {
      NavigationService.navigate(RouteName.FORGOT_PASSWORD);
    }

    componentDidUpdate(prevProps) {
      const { openIdAuthenticateActionResult } = this.props;
      if (
        !prevProps.openIdAuthenticateActionResult &&
        openIdAuthenticateActionResult &&
        openIdAuthenticateActionResult.code ===
        AuthStatus.ACCOUNT_DOES_NOT_EXIST
      ) {
        NavigationService.navigate(RouteName.GOOGLE_SIGN_UP);
      }
    }
  }

  function mapStateToProps(state) {
    const authenticateActionResult =
      CurrentUserModelSelectors.onSignInActionResult(state);
    const openIdAuthenticateActionResult =
      CurrentUserModelSelectors.onSignInWithGoogleAccountActionResult(state);
    const isLoggingIn = CurrentUserModelSelectors.selectIsLoggingIn(state);

    var props = {
      authenticateActionResult,
      openIdAuthenticateActionResult,
      genericHumanMessageModel: null,
      email: CredentialsModelSelectors.selectEmail(state),
      password: CredentialsModelSelectors.selectPassword(state),
      isLoggingIn,
    };
    if (authenticateActionResult) {
      const { humanMessage, code, isOk } = authenticateActionResult;
      // redirect if offline
      if (!isOk && code !== fetchError) {
        props.genericHumanMessageModel = humanMessage;
      }
    }

    if (
      openIdAuthenticateActionResult &&
      !openIdAuthenticateActionResult.isOk
    ) {
      props.googleHumanMessageModel =
        openIdAuthenticateActionResult.humanMessage;
    }

    return props;
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSignIn: (username, password) => dispatch(onSignIn({ username, password })),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSignInPage);
}

export default Enhance;
