import React from 'react';

import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';

import { AnyDict } from 'common/types';
import { fetchError } from 'common/utils/makeActionResult';
import { getRegistrationParamsFromUrl, QueryStringWithUTMInterface } from 'common/utils/query';
import { isValidEmail, isValidPassword, ValidationResult } from 'common/utils/validation';
import BaseComponent from 'commonEnhancers/BaseComponent';
import * as CredentialsModelActions from 'models/component/CredentialsModel/actions';
import * as CredentialsModelSelectors from 'models/component/CredentialsModel/selectors';
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';
import { AuthStatus } from 'models/domain/CurrentUserModel/types';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

function enhance(Component) {
  class EnhanceSignInForm extends BaseComponent {
    static propTypes = {
      // withRouter
      history: PropTypes.object,
    };

    state = {
      isLoggingIn: false,
      isLoggingInWithGoogleAccount: false,
      passwordCleared: false,

      emailHumanMessageModel: null,
      passwordHumanMessageModel: null,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          email={this.props.email}
          password={this.props.password}
          genericHumanMessageModel={this.props.genericHumanMessageModel}
          emailHumanMessageModel={this.state.emailHumanMessageModel}
          passwordHumanMessageModel={this.state.passwordHumanMessageModel}
          googleHumanMessageModel={this.props.googleHumanMessageModel}
          isLoggingIn={this.state.isLoggingIn}
          isLoggingInWithGoogleAccount={this.state.isLoggingInWithGoogleAccount}
          shouldRenderForgotPasswordLink={this.props.shouldRenderForgotPasswordLink}
          showHeader={this.props.showHeader}
          innerRefEmail={this.innerRefEmail}
          innerRefPassword={this.innerRefPassword}
          onEmailChange={this.onEmailChange}
          onPasswordChange={this.onPasswordChange}
          onSignInWithGoogleAccount={this.onSignInWithGoogleAccount}
          onSubmit={this.onSubmit}
          onCustomSignInWithGoogle={this.props.onCustomSignInWithGoogle}
          submitButtonRenderer={this.props.submitButtonRenderer}
        />
      );
    }

    emailInput: HTMLInputElement;

    passwordInput: HTMLInputElement;

    innerRefEmail(ref) {
      this.emailInput = ref;
    }

    innerRefPassword(ref) {
      this.passwordInput = ref;
    }

    onEmailInvalid(text) {
      this.setState({
        emailHumanMessageModel: HumanMessage({
          text,
          kind: HumanMessageKind.error,
        }),
      });
    }

    onPasswordInvalid(text) {
      this.setState({
        passwordHumanMessageModel: HumanMessage({
          text,
          kind: HumanMessageKind.error,
        }),
      });
    }

    onSignInWithGoogleAccount() {
      this.setState({
        isLoggingInWithGoogleAccount: true,
      });
    }

    onSubmit(event) {
      if (event) {
        event.preventDefault();
      }
      if (this.props.onSubmit) {
        return this.props.onSubmit();
      }
      if (this.areAllInputsValid()) {
        if (!this.state.isLoggingIn && !this.state.isLoggingInWithGoogleAccount) {
          this.props.onSignIn(this.props.email, this.props.password);
          this.setState({
            isLoggingIn: true,
            passwordCleared: false,
            passwordHumanMessageModel: null,
            emailHumanMessageModel: null,
            genericHumanMessageModel: null,
          });
        }
      } else {
        const validationEmailResult = isValidEmail(this.props.email, true) as ValidationResult;
        const validationPasswordResult = isValidPassword(this.props.password, true) as ValidationResult;

        if (!validationEmailResult.isValid) {
          this.onEmailInvalid(validationEmailResult.message);
        } else if (!validationPasswordResult.isValid) {
          this.onPasswordInvalid(validationPasswordResult.message);
        }

        this.focusInvalidInputs();
      }
    }

    onEmailChange(email) {
      if (email !== '') {
        this.setState({
          emailHumanMessageModel: null,
        });
      }
      this.props.onEmailChange(email);
    }

    onPasswordChange(password) {
      this.props.onPasswordChange(password);
    }

    areAllInputsValid() {
      return isValidEmail(this.props.email) && isValidPassword(this.props.password);
    }

    focusInvalidInputs() {
      if (!isValidEmail(this.props.email) && this.emailInput) {
        this.emailInput.select();
        return;
      }

      if (!isValidPassword(this.props.password) && this.passwordInput) {
        this.passwordInput.select();
      }
    }

    redirectToOfflineLogin() {
      this.props.history.push(`/loginOffline`);
    }

    componentDidMount() {
      var parsedQueryString = queryString.parse(window.location.search);
      if (parsedQueryString) {
        getRegistrationParamsFromUrl(parsedQueryString as QueryStringWithUTMInterface);
        if (parsedQueryString.email) {
          this.props.onEmailChange(parsedQueryString.email);
        }
        if (parsedQueryString.fullName) {
          this.props.onFullNameChange(parsedQueryString.fullName);
        }
      }
    }

    static getDerivedStateFromProps(props, state) {
      let newState = {} as AnyDict;
      if (props.genericHumanMessageModel) {
        if (!state.passwordCleared && props.genericHumanMessageModel.kind === HumanMessageKind.error) {
          newState = {
            isLoggingIn: false,
            passwordCleared: true,
          };
        } else {
          newState = { isLoggingIn: false };
        }
      }

      if (props.openIdAuthenticateActionResult) {
        newState.isLoggingInWithGoogleAccount = false;
      }

      return newState;
    }

    componentDidUpdate(prevProps, prevState) {
      const { authenticateActionResult, openIdAuthenticateActionResult } = this.props;
      if (
        this.props.genericHumanMessageModel &&
        this.props.genericHumanMessageModel.kind === HumanMessageKind.error &&
        !prevState.passwordCleared
      ) {
        // On login error remove password and focus on password input
        this.props.onPasswordChange('');
        setImmediate(() => {
          this.passwordInput.focus();
        });
      }
      if (authenticateActionResult && !authenticateActionResult.isOk && authenticateActionResult.code === fetchError) {
        this.redirectToOfflineLogin();
      }
      if (openIdAuthenticateActionResult) {
        if (!openIdAuthenticateActionResult.isOk && openIdAuthenticateActionResult.code === fetchError) {
          this.redirectToOfflineLogin();
        }
        if (
          openIdAuthenticateActionResult.code === AuthStatus.ACCOUNT_DOES_NOT_EXIST &&
          !this.props.onCustomSignInWithGoogle
        ) {
          this.props.history.push(`/googleSignUp`);
        }
      }
    }
  }

  function mapStateToProps(state) {
    const authenticateActionResult = CurrentUserModelSelectors.onSignInActionResult(state);
    const openIdAuthenticateActionResult = CurrentUserModelSelectors.onSignInWithGoogleAccountActionResult(state);

    var props = {
      authenticateActionResult,
      openIdAuthenticateActionResult,
      genericHumanMessageModel: null,
      googleHumanMessageModel: null,
      email: CredentialsModelSelectors.selectEmail(state),
      password: CredentialsModelSelectors.selectPassword(state),
    };

    if (authenticateActionResult) {
      const { humanMessage, code, isOk } = authenticateActionResult;
      // redirect if offline
      if (!isOk && code !== fetchError) {
        props.genericHumanMessageModel = humanMessage;
      }
    }

    if (openIdAuthenticateActionResult && !openIdAuthenticateActionResult.isOk) {
      props.googleHumanMessageModel = openIdAuthenticateActionResult.humanMessage;
    }

    return props;
  }

  function mapDispatchToProps(dispatch) {
    return {
      onEmailChange: (email: string) => dispatch(CredentialsModelActions.onEmailChange(email)),
      onPasswordChange: (password: string) => dispatch(CredentialsModelActions.onPasswordChange(password)),
      onSignIn: (username: string, password: string) =>
        dispatch(CurrentUserModelActions.onSignIn({ username, password })),
      onFullNameChange: (fullName: string) => dispatch(CredentialsModelActions.onFullNameChange(fullName)),
    };
  }
  //@ts-ignore
  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSignInForm);
}

export default enhance;
