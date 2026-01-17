import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchError } from 'common/utils/makeActionResult';
import { isValidEmail, ValidationResult } from 'common/utils/validation';
import BaseComponent from 'commonEnhancers/BaseComponent';
import * as CredentialsModelActions from 'models/component/CredentialsModel/actions';
import * as CredentialsModelSelectors from 'models/component/CredentialsModel/selectors';
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

function enhance(Component) {
  class EnhanceForgottenPasswordForm extends BaseComponent {
    static propTypes = {
      // withRouter
      history: PropTypes.object,
    };

    state = {
      isLoading: false,

      emailHumanMessageModel: null,
      genericHumanMessageModel: null,
    };

    render() {
      return (
        <Component
          email={this.props.email}
          isLoading={this.state.isLoading}
          emailHumanMessageModel={this.state.emailHumanMessageModel}
          genericHumanMessageModel={this.props.genericHumanMessageModel}
          sendLinkSuccess={this.props.sendLinkSuccess}
          onEmailChange={this.onEmailChange}
          onEmailInputBlur={this.onEmailInputBlur}
          onSubmit={this.onSubmit}
        />
      );
    }

    onEmailChange(email) {
      this.props.onClearAllActionResults();

      if (isValidEmail(email)) {
        this.props.onCheckIfEmailExist(email);
      }

      this.props.onEmailChange(email);
    }

    onEmailInputBlur() {
      const validationResult = isValidEmail(this.props.email, true) as ValidationResult;
      if (!validationResult.isValid) {
        this.setState({
          emailHumanMessageModel: HumanMessage({
            text: validationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      } else if (this.isEmailExist()) {
        this.setState({
          emailHumanMessageModel: null,
        });
      }
    }

    onSubmit(event) {
      let doesEmailExist = false;
      let hasEmailExistsRequestEnded = false;
      let hasEmailExistsResponseReceived = false;

      if (event) {
        event.preventDefault();
      }

      if (this.props.checkIfEmailExistActionResult) {
        doesEmailExist = !this.props.checkIfEmailExistActionResult.isOk;
        hasEmailExistsRequestEnded = true;
        hasEmailExistsResponseReceived = true;
      }

      const validationResult = isValidEmail(this.props.email, true) as ValidationResult;

      if (
        !this.state.isLoading &&
        validationResult.isValid &&
        (!hasEmailExistsRequestEnded || (hasEmailExistsResponseReceived && doesEmailExist))
      ) {
        this.props.onSendEmailWithPasswordChangeLink(this.props.email);
        this.setState({ isLoading: true });
      } else if (!validationResult.isValid) {
        this.setState({
          emailHumanMessageModel: HumanMessage({
            text: validationResult.message,
            kind: HumanMessageKind.error,
          }),
        });
      }
    }

    isEmailExist() {
      let isExist = true;
      if (this.props.checkIfEmailExistActionResult) {
        if (this.props.checkIfEmailExistActionResult.isOk) {
          this.setState({
            emailHumanMessageModel: this.props.checkIfEmailExistActionResult.humanMessage,
          });
          isExist = false;
        } else {
          // ok
        }
      }
      return isExist;
    }

    componentDidUpdate(prevProps) {
      if (this.props.genericHumanMessageModel && this.state.isLoading) {
        this.setState({ isLoading: false });
      }

      if (!this.props.checkIfEmailExistActionResult || !isValidEmail(this.props.email)) {
        return;
      }

      if (this.props.checkIfEmailExistActionResult.isOk) {
        if (this.state.isLoading) {
          this.setState({
            emailHumanMessageModel: this.props.checkIfEmailExistActionResult.humanMessage,
            isLoading: false,
          });
        }
      } else {
        if (this.state.emailHumanMessageModel !== null) {
          this.setState({
            emailHumanMessageModel: null,
          });
        }
      }
    }

    componentWillUnmount() {
      this.props.onClearAllActionResults();
    }
  }

  function mapStateToProps(state, ownProps) {
    const actionResult = CurrentUserModelSelectors.onSendEmailWithPasswordChangeLinkActionResult(state);
    const checkIfEmailExistActionResult = CurrentUserModelSelectors.onCheckIfEmailExistActionResult(state);

    var props = {
      email: CredentialsModelSelectors.selectEmail(state),
      genericHumanMessageModel: null,
      sendLinkSuccess: null,
      checkIfEmailExistActionResult,
    };

    if (actionResult) {
      const { humanMessage, code, isOk } = actionResult;
      // redirect if offline
      if (code === fetchError) {
        ownProps.history.push(`/forgottenPasswordOffline`);
      } else {
        props.genericHumanMessageModel = humanMessage;
        props.sendLinkSuccess = isOk;
      }
    } else {
      // ok
    }

    return props;
  }

  function mapDispatchToProps(dispatch) {
    return {
      onEmailChange: (email: string) => dispatch(CredentialsModelActions.onEmailChange(email)),
      onSendEmailWithPasswordChangeLink: (email: string) =>
        dispatch(CurrentUserModelActions.onSendEmailWithPasswordChangeLink({ email })),
      onClearAllActionResults: () => dispatch(CurrentUserModelActions.onResetToInitialState()),
      onCheckIfEmailExist: (email: string) => dispatch(CurrentUserModelActions.onCheckIfEmailExist({ email })),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
    //@ts-ignore
  )(EnhanceForgottenPasswordForm);
}

export default enhance;
