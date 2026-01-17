import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';

import { AnyDict } from 'common/types';
import { extractFullNameParts } from 'common/utils';
import { fetchError } from 'common/utils/makeActionResult';
import { getRegistrationParamsFromUrl, QueryStringWithUTMInterface } from 'common/utils/query';
import {
  isValidEmail,
  isValidFullName,
  isValidPassword,
  prepareFullName,
  ValidationResult,
} from 'common/utils/validation';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { i18n } from 'i18n';
import * as CredentialsModelActions from 'models/component/CredentialsModel/actions';
import * as CredentialsModelSelectors from 'models/component/CredentialsModel/selectors';
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';
import { AuthStatus } from 'models/domain/CurrentUserModel/types';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

import { FORM_ID, HONEYPOT_FIELD_NAME } from '../../component';
import getCookie from 'common/utils/getCookie';

function enhance(Component) {
  class EnhanceSignUpForm extends BaseComponent {
    static propTypes = {
      // withRouter
      history: PropTypes.object,
    };

    state = {
      isRegistering: false,
      isRegisteringWithGoogleAccount: false,
      passwordCleared: false,
      isAcceptingTerms: true,

      emailHumanMessageModel: null,
      passwordHumanMessageModel: null,
      fullNameHumanMessageModel: null,
      termsHumanMessageModel: null,

      isEmailEnteredEventTracked: false,
    };

    render() {
      const queryParams = this.getQueryParams();

      return (
        <Component
          email={queryParams.email || this.props.email}
          password={this.props.password}
          fullName={this.props.fullName}
          genericHumanMessageModel={this.props.genericHumanMessageModel}
          emailHumanMessageModel={this.state.emailHumanMessageModel}
          passwordHumanMessageModel={this.state.passwordHumanMessageModel}
          fullNameHumanMessageModel={this.state.fullNameHumanMessageModel}
          termsHumanMessageModel={this.state.termsHumanMessageModel}
          googleHumanMessageModel={this.props.googleHumanMessageModel}
          isRegistering={this.state.isRegistering}
          isRegisteringWithGoogleAccount={this.state.isRegisteringWithGoogleAccount}
          isEmailInputDisabled={!!queryParams.email}
          shouldRenderGoogleButton={!queryParams.email}
          isAcceptingTerms={this.state.isAcceptingTerms}
          showHeader={this.props.showHeader}
          innerRefEmail={this.innerRefEmail}
          innerRefPassword={this.innerRefPassword}
          innerRefFullName={this.innerRefFullName}
          onFullNameChange={this.onFullNameChange}
          onEmailChange={this.onEmailChange}
          onPasswordChange={this.onPasswordChange}
          onSignUpWithGoogleAccount={this.onSignUpWithGoogleAccount}
          onSubmit={this.onSubmit}
          onCustomSignInWithGoogle={this.props.onCustomSignInWithGoogle}
          onSetIsAcceptingTerms={this.onSetIsAcceptingTerms}
          submitButtonRenderer={this.props.submitButtonRenderer}
        />
      );
    }

    emailInput: HTMLInputElement;

    passwordInput: HTMLInputElement;

    fullNameInput: HTMLInputElement;

    innerRefEmail(ref) {
      this.emailInput = ref;
    }

    innerRefPassword(ref) {
      this.passwordInput = ref;
    }

    innerRefFullName(ref) {
      this.fullNameInput = ref;
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

    onFullNameInvalid(text) {
      this.setState({
        fullNameHumanMessageModel: HumanMessage({
          text,
          kind: HumanMessageKind.error,
        }),
      });
    }

    onTermsNotAccepted() {
      this.setState({
        termsHumanMessageModel: HumanMessage({
          text: i18n.t('You have to agree to the Terms of Service and Privacy Policy in order to use Planner.'),
          kind: HumanMessageKind.error,
        }),
      });
    }

    onSignUpWithGoogleAccount() {
      this.setState({
        isRegisteringWithGoogleAccount: true,
      });
    }

    onSetIsAcceptingTerms() {
      this.setState((prevState) => {
        this.props.onSetIsAcceptingTerms(!prevState.isAcceptingTerms);

        return {
          isAcceptingTerms: !prevState.isAcceptingTerms,
        };
      });
    }

    onSubmit(event) {
      if (event) {
        event.preventDefault();
      }
      var { value } = document.forms[FORM_ID][HONEYPOT_FIELD_NAME];
      if (value?.length) {
        return null;
      }

      if (this.props.onSubmit) {
        return this.props.onSubmit();
      }

      const queryParams = this.getQueryParams();

      this.setState({
        emailHumanMessageModel: null,
        passwordHumanMessageModel: null,
        fullNameHumanMessageModel: null,
        termsHumanMessageModel: null,
      });

      if (queryParams.token && queryParams.email) {
        if (
          isValidEmail(queryParams.email as string) &&
          isValidPassword(this.props.password) &&
          isValidFullName(this.props.fullName) &&
          this.state.isAcceptingTerms
        ) {
          if (!this.state.isRegistering && !this.state.isRegisteringWithGoogleAccount) {
            const [firstName, lastName] = extractFullNameParts(this.props.fullName);
            this.props.onInvitedUserSetPassword(this.props.password, firstName, lastName, queryParams.token);
            this.setState({
              isRegistering: true,
              passwordCleared: false,
            });
          }
        } else {
          this.validateForm(this.props.fullName, queryParams.email, this.props.password);
        }
      } else {
        if (this.areAllInputsValid()) {
          if (!this.state.isRegistering && !this.state.isRegisteringWithGoogleAccount) {
            const fullName = prepareFullName(this.props.fullName);
            const [firstName, lastName] = extractFullNameParts(fullName);
            const ref = getCookie('referer2')
            this.props.onSignUp(this.props.email, this.props.password, firstName, lastName, '', ref);
            this.setState({
              isRegistering: true,
              passwordCleared: false,
            });
          }
        } else {
          this.validateForm(this.props.fullName, this.props.email, this.props.password);
        }
      }
    }

    validateForm(fullName, email, password) {
      const validationEmailResult = isValidEmail(email, true) as ValidationResult;
      const validationPasswordResult = isValidPassword(password, true) as ValidationResult;
      const validationFullNameResult = isValidFullName(fullName, true) as ValidationResult;

      this.setState({
        emailHumanMessageModel: null,
        passwordHumanMessageModel: null,
        fullNameHumanMessageModel: null,
        termsHumanMessageModel: null,
      });

      if (!validationFullNameResult.isValid) {
        this.onFullNameInvalid(validationFullNameResult.message);
      } else if (!validationEmailResult.isValid) {
        this.onEmailInvalid(validationEmailResult.message);
      } else if (!validationPasswordResult.isValid) {
        this.onPasswordInvalid(validationPasswordResult.message);
      } else if (!this.state.isAcceptingTerms) {
        this.onTermsNotAccepted();
      }

      this.focusInvalidInputs(fullName, email, password);
    }

    onEmailChange(email) {
      if (!email) {
        this.setState({
          emailHumanMessageModel: null,
        });
      } else {
        // ok
      }

      if (isValidEmail(email)) {
        this.props.onCheckIfEmailExist(email);
      } else {
        // ok
      }

      this.props.onEmailChange(email);
    }

    onFullNameChange(event) {
      const fullName = event.target.value;

      if (!fullName) {
        this.setState({
          fullNameHumanMessageModel: null,
        });
      } else {
        // ok
      }

      this.props.onFullNameChange(fullName);
    }

    onPasswordChange(password) {
      if (!password) {
        this.setState({
          passwordHumanMessageModel: null,
        });
      } else {
        // ok
      }
      this.props.onPasswordChange(password);
    }

    areAllInputsValid() {
      return (
        isValidEmail(this.props.email) &&
        isValidPassword(this.props.password) &&
        isValidFullName(this.props.fullName) &&
        this.state.isAcceptingTerms
      );
    }

    focusInvalidInputs(fullName, email, password) {
      if (!isValidFullName(fullName) && this.fullNameInput) {
        this.fullNameInput.select();

        return;
      }

      if (!isValidEmail(email) && this.emailInput) {
        this.emailInput.select();

        return;
      }

      if (!isValidPassword(password) && this.passwordInput) {
        this.passwordInput.select();
      }
    }

    getQueryParams() {
      const { token, email } = queryString.parse(this.props.location.search);

      return { token, email };
    }

    redirectToOfflineRegister() {
      this.props.history.push(`/registerOffline`);
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

      if (this.props.fullName) {
        const validationFullNameResult = isValidFullName(this.props.fullName, true) as ValidationResult;
        if (!validationFullNameResult.isValid) {
          this.onFullNameInvalid(validationFullNameResult.message);
        }
      }
    }

    static getDerivedStateFromProps(props, state) {
      let newState = {} as AnyDict;
      if (props.genericHumanMessageModel) {
        if (!state.passwordCleared && props.genericHumanMessageModel.kind === HumanMessageKind.error) {
          newState = {
            isRegistering: false,
            passwordCleared: true,
          };
        } else {
          newState = { isRegistering: false };
        }
      }
      if (props.signUpWithGoogleAccountActionResult) {
        newState.isRegisteringWithGoogleAccount = false;
      }

      if (props.openIdAuthenticateActionResult && !props.openIdAuthenticateActionResult.isOk) {
        newState.isRegisteringWithGoogleAccount = false;
      }

      if (props.checkIfEmailExistActionResult) {
        if (!props.checkIfEmailExistActionResult.isOk) {
          newState.emailHumanMessageModel = props.checkIfEmailExistActionResult.humanMessage;
        } else {
          newState.emailHumanMessageModel = null;
        }
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
        this.redirectToOfflineRegister();
      }
      if (openIdAuthenticateActionResult) {
        if (!openIdAuthenticateActionResult.isOk && openIdAuthenticateActionResult.code === fetchError) {
          this.redirectToOfflineRegister();
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
    const authenticateActionResult = CurrentUserModelSelectors.onSignUpActionResult(state);
    const checkIfEmailExistActionResult = CurrentUserModelSelectors.onCheckIfEmailExistActionResult(state);
    const signUpWithGoogleAccountActionResult = CurrentUserModelSelectors.onSignUpWithGoogleAccountActionResult(state);
    const openIdAuthenticateActionResult = CurrentUserModelSelectors.onSignInWithGoogleAccountActionResult(state);
    const invitationActionResult = CurrentUserModelSelectors.onInvitedUserSetPasswordActionResult(state);

    var props = {
      authenticateActionResult,
      signUpWithGoogleAccountActionResult,
      openIdAuthenticateActionResult,
      checkIfEmailExistActionResult,
      genericHumanMessageModel: null,
      googleHumanMessageModel: null,
      email: CredentialsModelSelectors.selectEmail(state),
      password: CredentialsModelSelectors.selectPassword(state),
      fullName: CredentialsModelSelectors.selectFullName(state),
    };

    if (authenticateActionResult) {
      const { humanMessage, code, isOk } = authenticateActionResult;
      // redirect if offline
      if (!isOk && code !== fetchError) {
        props.genericHumanMessageModel = humanMessage;
      }
    } else if (invitationActionResult) {
      const { humanMessage, isOk } = invitationActionResult;

      if (!isOk) {
        props.genericHumanMessageModel = humanMessage;
      }
    }

    if (signUpWithGoogleAccountActionResult && !signUpWithGoogleAccountActionResult.isOk) {
      props.googleHumanMessageModel = signUpWithGoogleAccountActionResult.humanMessage;
    }

    if (openIdAuthenticateActionResult && !openIdAuthenticateActionResult.isOk) {
      props.googleHumanMessageModel = openIdAuthenticateActionResult.humanMessage;
    }

    return props;
  }

  function mapDispatchToProps(dispatch) {
    return {
      onEmailChange: (email: string) => dispatch(CredentialsModelActions.onEmailChange(email)),
      onFullNameChange: (fullName: string) => dispatch(CredentialsModelActions.onFullNameChange(fullName)),
      onPasswordChange: (password: string) => dispatch(CredentialsModelActions.onPasswordChange(password)),
      onSetIsAcceptingTerms: (password: string) => dispatch(CredentialsModelActions.onSetIsAcceptingTerms(password)),
      onSignUp: (username: string, password: string, firstName: string, lastName: string, phone: string, referrer: string) =>
        dispatch(
          CurrentUserModelActions.onSignUp({
            username,
            password,
            firstName,
            lastName,
            phone,
            referrer
          }),
        ),
      onInvitedUserSetPassword: (password: string, firstName: string, lastName: string, token: string) =>
        dispatch(
          CurrentUserModelActions.onInvitedUserSetPassword({
            password,
            firstName,
            lastName,
            token,
          }),
        ),
      onCheckIfEmailExist: (email: string) => dispatch(CurrentUserModelActions.onCheckIfEmailExist({ email })),
    };
  }

  //@ts-ignore
  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSignUpForm);
}

export default enhance;
