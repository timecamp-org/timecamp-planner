import React from 'react';

import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AnyDict } from 'common/types';
import { fetchError } from 'common/utils/makeActionResult';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { i18n } from 'i18n';
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';

function enhance(Component) {
  class EnhanceGoogleSignUpForm extends BaseComponent {
    static propTypes = {
      // withRouter
      history: PropTypes.object,
    };

    state = {
      isRegistering: false,
      isRegisteringWithGoogleAccount: false,
      isAcceptingTerms: false,

      termsHumanMessageModel: null,
    };

    render() {
      return (
        <Component
          fullName={this.props.fullName}
          avatar={this.props.avatar}
          termsHumanMessageModel={this.state.termsHumanMessageModel}
          isRegistering={this.state.isRegistering}
          isRegisteringWithGoogleAccount={this.state.isRegisteringWithGoogleAccount}
          isAcceptingTerms={this.state.isAcceptingTerms}
          onSubmit={this.onSubmit}
          onSetIsAcceptingTerms={this.onSetIsAcceptingTerms}
        />
      );
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
      if (this.state.isAcceptingTerms) {
        this.setState({
          isRegisteringWithGoogleAccount: true,
        });
      } else {
        this.onTermsNotAccepted();
      }
    }

    onSetIsAcceptingTerms() {
      this.setState((prevState) => ({
        isAcceptingTerms: !prevState.isAcceptingTerms,
      }));
    }

    onSubmit(event) {
      if (event) {
        event.preventDefault();
      }

      this.setState({
        termsHumanMessageModel: null,
      });

      if (this.state.isAcceptingTerms) {
        if (!this.state.isRegistering && !this.state.isRegisteringWithGoogleAccount) {
          if (this.props.onCustomSignUpWithGoogleAccount) {
            this.props.onCustomSignUpWithGoogleAccount(this.props.token);
          } else {
            this.props.onSignUpWithGoogleAccount(this.props.token, '');
          }
          this.setState({
            isRegistering: true,
          });
        }
      } else {
        this.validateForm();
      }
    }

    validateForm() {
      this.setState({
        termsHumanMessageModel: null,
      });

      if (!this.state.isAcceptingTerms) {
        this.onTermsNotAccepted();
      }
    }

    redirectToOfflineRegister() {
      this.props.history.push(`/registerOffline`);
    }

    static getDerivedStateFromProps(props, state) {
      const newState = {} as AnyDict;
      if (props.genericHumanMessageModel) {
        newState.isRegistering = false;
      }

      if (props.signUpWithGoogleAccountActionResult) {
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

    componentDidMount() {
      const { signInWithGoogleAccountActionResult } = this.props;

      if (!signInWithGoogleAccountActionResult) {
        this.props.history.push(`/register`);
      }
    }

    componentDidUpdate() {
      const { authenticateActionResult, signInWithGoogleAccountActionResult } = this.props;

      if (!signInWithGoogleAccountActionResult) {
        this.props.history.push(`/register`);
      }

      if (authenticateActionResult && !authenticateActionResult.isOk && authenticateActionResult.code === fetchError) {
        this.redirectToOfflineRegister();
      }
      if (signInWithGoogleAccountActionResult) {
        if (!signInWithGoogleAccountActionResult.isOk && signInWithGoogleAccountActionResult.code === fetchError) {
          this.redirectToOfflineRegister();
        }
      }
    }
  }

  function mapStateToProps(state, ownProps) {
    const authenticateActionResult = CurrentUserModelSelectors.onSignUpActionResult(state);
    const signUpWithGoogleAccountActionResult = CurrentUserModelSelectors.onSignUpWithGoogleAccountActionResult(state);
    const signInWithGoogleAccountActionResult = CurrentUserModelSelectors.onSignInWithGoogleAccountActionResult(state);
    const invitationActionResult = CurrentUserModelSelectors.onInvitedUserSetPasswordActionResult(state);

    var props = {
      signUpWithGoogleAccountActionResult,
      signInWithGoogleAccountActionResult,
      genericHumanMessageModel: null,
      googleHumanMessageModel: null,
      fullName: get(signInWithGoogleAccountActionResult, 'data.userProfile.displayName'),
      avatar: get(signInWithGoogleAccountActionResult, 'data.userProfile.avatar'),
      token: get(signInWithGoogleAccountActionResult, 'data.idToken'),
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

    if (signUpWithGoogleAccountActionResult) {
      props.googleHumanMessageModel = signUpWithGoogleAccountActionResult.humanMessage;
    }

    return props;
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSignUpWithGoogleAccount: (token: string, phone: string) =>
        dispatch(CurrentUserModelActions.onSignUpWithGoogleAccount({ token, phone })),
    };
  }
  //@ts-ignore
  return connect(mapStateToProps, mapDispatchToProps)(EnhanceGoogleSignUpForm);
}

export default enhance;
