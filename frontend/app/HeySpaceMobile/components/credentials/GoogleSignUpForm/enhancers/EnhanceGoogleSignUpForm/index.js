import React from 'react';
import { connect } from 'react-redux';
import { fetchError } from 'common/utils/makeActionResult';
import get from 'lodash/get';

import BaseComponent from 'BaseComponent';
import RouteName from '../../../../AppNavigation/routeNames';

import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';
import { NavigationService } from 'common/services';

function enhance(Component) {
  class EnhanceGoogleSignUpForm extends BaseComponent {
    state = {
      isRegistering: false,
      isRegisteringWithGoogleAccount: false,
      isAcceptingTerms: false,

      message: null,
    };

    render() {
      return (
        <Component
          fullName={this.props.fullName}
          avatar={this.props.avatar}
          message={this.state.message}
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
        message: 'You have to agree to the Terms of Service and Privacy Policy in order to use Planner.',
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

    onSubmit() {
      this.setState({
        message: null,
      });
      if (this.state.isAcceptingTerms) {
        if (!this.state.isRegistering && !this.state.isRegisteringWithGoogleAccount) {
          this.props.onSignUpWithGoogleAccount(this.props.token);
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
        message: null,
      });

      if (!this.state.isAcceptingTerms) {
        this.onTermsNotAccepted();
      }
    }

    redirectToOfflineRegister() {
      this.setState({
        message: 'Something went wrong. Please check your internet connection',
      });
    }

    static getDerivedStateFromProps(props, state) {
      const newState = {};
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
        NavigationService.navigate(RouteName.SIGN_UP);
      }
    }

    componentDidUpdate() {
      const { authenticateActionResult, signInWithGoogleAccountActionResult } = this.props;

      if (!signInWithGoogleAccountActionResult) {
        NavigationService.navigate(RouteName.SIGN_UP);
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
      onSignUpWithGoogleAccount: (token) => dispatch(CurrentUserModelActions.onSignUpWithGoogleAccount(token)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceGoogleSignUpForm);
}

export default enhance;
