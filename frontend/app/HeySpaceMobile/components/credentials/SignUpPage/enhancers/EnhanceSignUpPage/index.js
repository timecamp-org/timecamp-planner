import React from 'react';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BaseComponent from 'BaseComponent';

import RouteName from '../../../../AppNavigation/routeNames';
import { isValidEmail, isValidPassword, isValidFullName, prepareFullName } from 'common/utils/validation';

import { onSignUp } from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';
import { AuthStatus } from 'models/domain/CurrentUserModel/types';

import { NavigationService } from 'common/services';

function Enhance(ComposedComponent) {
  class EnhanceSignUpPage extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      onSignUp: PropTypes.func.isRequired,
    };

    state = {
      isAcceptingTerms: false,
      termsAndConditionsMessage: null,
    };

    render() {
      return (
        <ComposedComponent
          isAcceptingTerms={this.state.isAcceptingTerms}
          termsAndConditionsMessage={this.state.termsAndConditionsMessage}
          onSetFullNameInputOuterRef={this.onSetFullNameInputOuterRef}
          onSetEmailInputOuterRef={this.onSetEmailInputOuterRef}
          onSetPasswordInputOuterRef={this.onSetPasswordInputOuterRef}
          onSetFullNameInputInnerRef={this.onSetFullNameInputInnerRef}
          onSetEmailInputInnerRef={this.onSetEmailInputInnerRef}
          onSetPasswordInputInnerRef={this.onSetPasswordInputInnerRef}
          // TODO: pass value from requestModel
          isLoading={false}
          validateFullName={this.validateFullName}
          validateEmail={this.validateEmail}
          validatePassword={this.validatePassword}
          onSubmitEditingFullNameInput={this.focusEmailInput}
          onSubmitEditingEmailInput={this.focusPasswordInput}
          onSubmitEditingPasswordInput={this.onSubmit}
          onSubmit={this.onSubmit}
          onGoToSignInPage={this.onGoToSignInPage}
          onSetIsAcceptingTerms={this.onSetIsAcceptingTerms}
        />
      );
    }

    onSetIsAcceptingTerms() {
      this.setState((prevState) => ({
        isAcceptingTerms: !prevState.isAcceptingTerms,
      }));
    }

    onSetFullNameInputOuterRef(ref) {
      this.fullNameInputOuterRef = ref;
    }

    onSetEmailInputOuterRef(ref) {
      this.emailInputOuterRef = ref;
    }

    onSetPasswordInputOuterRef(ref) {
      this.passwordInputOuterRef = ref;
    }

    onSetFullNameInputInnerRef(ref) {
      this.fullNameInputInnerRef = ref;
    }

    onSetEmailInputInnerRef(ref) {
      this.emailInputInnerRef = ref;
    }

    onSetPasswordInputInnerRef(ref) {
      this.passwordInputInnerRef = ref;
    }

    focusEmailInput() {
      if (this.emailInputInnerRef) {
        this.emailInputInnerRef.focus();
      }
    }

    focusPasswordInput() {
      if (this.passwordInputInnerRef) {
        this.passwordInputInnerRef.focus();
      }
    }

    validateFullName(fullName) {
      const { isValid, message } = isValidFullName(fullName, true);
      return {
        isValid: isValid,
        message: isValid ? null : message,
      };
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
      const fullName = this.fullNameInputOuterRef.getValue();
      const email = this.emailInputOuterRef.getValue();
      const password = this.passwordInputOuterRef.getValue();
      const isFullNameValid = isValidFullName(fullName);
      const isEmailValid = isValidEmail(email);
      const isPasswordValid = isValidPassword(password);

      if (isFullNameValid && isEmailValid && isPasswordValid && this.state.isAcceptingTerms) {
        const preparedFullName = prepareFullName(fullName).split(' ');
        Keyboard.dismiss();
        this.props.onSignUp({
          username: email,
          password,
          firstName: preparedFullName[0],
          lastName: preparedFullName[1],
        });
      }

      if (this.state.isAcceptingTerms) {
        this.setState({ termsAndConditionsMessage: null });
      } else {
        this.setState({
          termsAndConditionsMessage:
            'You have to agree to the Terms of Service and Privacy Policy in order to use Planner.',
        });
      }
    }

    onGoToSignInPage() {
      NavigationService.navigate(RouteName.SIGN_IN);
    }

    componentDidUpdate(prevProps) {
      const { openIdAuthenticateActionResult, signUpActionResult } = this.props;
      if (
        !prevProps.openIdAuthenticateActionResult &&
        openIdAuthenticateActionResult &&
        openIdAuthenticateActionResult.code === AuthStatus.ACCOUNT_DOES_NOT_EXIST
      ) {
        NavigationService.navigate(RouteName.GOOGLE_SIGN_UP);
        return;
      }

      if (!prevProps.signUpActionResult && signUpActionResult && !signUpActionResult.get('isOk')) {
        this.emailInputOuterRef.onSetValidation({
          isValid: false,
          message: signUpActionResult.getIn(['humanMessage', 'text']),
        });
      }
    }
  }

  function mapStateToProps(state) {
    return {
      openIdAuthenticateActionResult: CurrentUserModelSelectors.onSignInWithGoogleAccountActionResult(state),
      signUpActionResult: CurrentUserModelSelectors.onSignUpActionResult(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSignUp: (username, password, firstName, lastName) =>
        dispatch(onSignUp({ username, password, firstName, lastName })),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSignUpPage);
}

export default Enhance;
