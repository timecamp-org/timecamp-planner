import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isValidPassword, ValidationResult } from 'common/utils/validation';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import queryString from 'query-string';
import { fetchError } from 'common/utils/makeActionResult';
import { i18n } from 'i18n';

import BaseComponent from 'commonEnhancers/BaseComponent';

import { onSetPassword } from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';
import * as CredentialsModelSelectors from 'models/component/CredentialsModel/selectors';
import * as CredentialsModelActions from 'models/component/CredentialsModel/actions';

const EMPTY_CONFIRM_PASSWORD_MESSAGE = "Don't forget about confirm password!";

function enhance(Component) {
  class EnhanceChangePasswordForm extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      // withRouter
      history: PropTypes.object,
    };

    state = {
      isChanging: false,
      password: '',
      confirmPassword: '',

      passwordHumanMessageModel: null,
      confirmPasswordHumanMessageModel: null,
    };

    render() {
      return (
        <Component
          isChanging={this.state.isChanging}
          password={this.props.password}
          confirmPassword={this.state.confirmPassword}
          passwordHumanMessageModel={this.state.passwordHumanMessageModel}
          confirmPasswordHumanMessageModel={this.state.confirmPasswordHumanMessageModel}
          genericHumanMessageModel={this.props.genericHumanMessageModel}
          passwordChanged={this.props.passwordChanged}
          userEmail={this.props.userEmail}
          onSubmit={this.onSubmit}
          onPasswordBlur={this.onPasswordBlur}
          onConfirmPasswordBlur={this.onConfirmPasswordBlur}
          onChangePassword={this.onChangePassword}
          onChangeConfirmPassword={this.onChangeConfirmPassword}
        />
      );
    }

    onChangePassword(text) {
      this.props.onPasswordChange(text);
    }

    onChangeConfirmPassword(text) {
      this.setState({
        confirmPassword: text,
      });
    }

    onPasswordBlur() {
      const validationResult = isValidPassword(this.props.password, true) as ValidationResult;
      if (validationResult.isValid) {
        this.setState({
          passwordHumanMessageModel: null,
        });
      } else {
        this.setState({
          passwordHumanMessageModel: HumanMessage({
            text: validationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      }
    }

    onConfirmPasswordBlur() {
      const validationResult = isValidPassword(this.state.confirmPassword, true) as ValidationResult;

      if (!validationResult.isValid) {
        let text;
        if (this.state.confirmPassword === '') {
          text = EMPTY_CONFIRM_PASSWORD_MESSAGE;
        } else {
          text = validationResult.message;
        }
        this.setState({
          confirmPasswordHumanMessageModel: HumanMessage({
            text,
            kind: HumanMessageKind.error,
          }),
        });
      } else if (this.props.password !== this.state.confirmPassword) {
        this.setState({
          confirmPasswordHumanMessageModel: HumanMessage({
            text: i18n.t('Your password and confirmation password do not match'),
            kind: HumanMessageKind.error,
          }),
        });
      } else {
        this.setState({
          confirmPasswordHumanMessageModel: null,
        });
      }
    }

    onSubmit(event) {
      if (event) {
        event.preventDefault();
      }
      const { token } = queryString.parse(this.props.location.search);
      const passwordValidation = isValidPassword(this.props.password, true) as ValidationResult;
      const confirmPasswordValidation = this.isValidConfirmPassword(this.state.confirmPassword, true);

      this.setState({
        passwordHumanMessageModel: null,
        confirmPasswordHumanMessageModel: null,
      });

      if (passwordValidation.isValid && confirmPasswordValidation.isValid) {
        this.props.onSetPassword(token, this.props.password);
        this.setState({
          isChanging: true,
        });
      } else {
        if (!passwordValidation.isValid) {
          this.setState({
            passwordHumanMessageModel: HumanMessage({
              text: passwordValidation.message,
              kind: HumanMessageKind.error,
            }),
          });
        } else if (!confirmPasswordValidation.isValid) {
          this.setState({
            confirmPasswordHumanMessageModel: HumanMessage({
              text: confirmPasswordValidation.message,
              kind: HumanMessageKind.error,
            }),
          });
        }
      }
    }

    isValidConfirmPassword(confirmPassword, withMessage): ValidationResult {
      const confirmPasswordValidation = isValidPassword(confirmPassword, true) as ValidationResult;
      let validationResult;

      if (withMessage) {
        if (confirmPassword === this.props.password) {
          validationResult = confirmPasswordValidation;
        } else {
          validationResult = {
            isValid: false,
            message: i18n.t('Your password and confirmation password do not match'),
          };
        }
      } else {
        validationResult = confirmPasswordValidation.isValid;
      }

      return validationResult;
    }

    static getDerivedStateFromProps(props, state) {
      if ((props.passwordChanged || props.genericHumanMessageModel) && state.isChanging) {
        return { isChanging: false };
      }

      return null;
    }

    componentWillUnmount() {
      this.props.onPasswordChange('');
    }
  }

  function mapStateToProps(state, ownProps) {
    const onSetPasswordActionResult = CurrentUserModelSelectors.onSetPasswordActionResult(state);
    const props = {
      passwordChanged: false,
      userEmail: ownProps.userEmail,
      password: CredentialsModelSelectors.selectPassword(state),
    };

    if (onSetPasswordActionResult) {
      const { code, data } = onSetPasswordActionResult;
      if (onSetPasswordActionResult.isOk) {
        const { userEmail } = data;
        props.passwordChanged = true;
        props.userEmail = userEmail;
      } else {
        if (code === fetchError) {
          const { token } = queryString.parse(ownProps.location.search);
          ownProps.history.push(`/changePasswordOffline?token=${token}`);
        } else {
          ownProps.history.push('/changePasswordLinkExpired');
        }
      }
    } else {
      // ok
    }

    return props;
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSetPassword: (token, newPassword) => dispatch(onSetPassword({ token, newPassword })),
      onPasswordChange: (password) => dispatch(CredentialsModelActions.onPasswordChange(password)),
    };
  }
  //@ts-ignore
  return connect(mapStateToProps, mapDispatchToProps)(EnhanceChangePasswordForm);
}

export default enhance;
