import React from 'react';

import { connect } from 'react-redux';

import {
  isValidEmail,
  isValidPassword,
  isValidFullName,
} from 'common/utils/validation';
import BaseComponent from 'commonEnhancers/BaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import {
  selectEmail,
  selectPassword,
  selectFullName,
  selectIsAcceptingTerms,
} from 'models/component/CredentialsModel/selectors';
import {
  onFetchInvitationData,
  onJoinChat,
} from 'models/domain/ChatWithMeModel/actions';
import {
  selectInvitationUserId,
  selectInvitationOrganizationId,
  selectInvitationOrganizationName,
} from 'models/domain/ChatWithMeModel/selectors';
import {
  isAuthenticated,
  onSignInWithGoogleAccountActionResult,
} from 'models/domain/CurrentUserModel/selectors';
import { AuthStatus } from 'models/domain/CurrentUserModel/types';
import {
  getChatWithMeInvitationData,
  joinChatWithMe,
} from 'models/domain/RequestModel/constants/requestTypes';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';
import { selectCurrentUserEmail } from 'models/domain/UsersModel/selectors/domain';

function Enhance(ComposedComponent) {
  // @ts-ignore
  @EnhanceWithRouter()
  class EnhanceJoinChatWithMePage extends BaseComponent {
    static propTypes = {};

    state = {
      isSigningUp: false,
      showGoogleSignUpConfirmation: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          userId={this.props.userId}
          isAuthenticated={this.props.isAuthenticated}
          userEmail={this.props.userEmail}
          organizationName={this.props.organizationName}
          isLoaded={this.props.isLoaded}
          isJoining={this.props.isJoining}
          isJoinButtonDisabled={this.isJoinButtonDisabled()}
          isSigningUp={this.state.isSigningUp}
          showGoogleSignUpConfirmation={this.state.showGoogleSignUpConfirmation}
          onJoinChat={this.onJoinChat}
          onSwitchToSignUp={this.onSwitchToSignUp}
          onSwitchToSignIn={this.onSwitchToSignIn}
          onJoinAfterGoogleSignIn={this.onJoinAfterGoogleSignIn}
          onJoinAfterGoogleSignUp={this.onJoinAfterGoogleSignUp}
        />
      );
    }

    onJoinChat(event) {
      event.preventDefault();
      const { inviteToken } = this.props.match.params;
      this.props.onJoinChat(inviteToken, this.state.isSigningUp);
    }

    onJoinAfterGoogleSignIn() {
      const { inviteToken } = this.props.match.params;
      this.props.onJoinChat(inviteToken, false, true);
    }

    onJoinAfterGoogleSignUp(token) {
      const { inviteToken } = this.props.match.params;
      this.props.onJoinChat(inviteToken, true, true, token);
    }

    onSwitchToSignUp() {
      this.setState({
        isSigningUp: true,
      });
    }

    onSwitchToSignIn() {
      this.setState({
        isSigningUp: false,
      });
    }

    areSignInInputsValid() {
      return (
        isValidEmail(this.props.email) && isValidPassword(this.props.password)
      );
    }

    areSignUpInputsValid() {
      return (
        isValidEmail(this.props.email) &&
        isValidPassword(this.props.password) &&
        isValidFullName(this.props.fullName) &&
        this.props.isAcceptingTerms
      );
    }

    isJoinButtonDisabled() {
      const areInputsInvalid =
        (this.state.isSigningUp && !this.areSignUpInputsValid()) ||
        !this.areSignInInputsValid();
      return !this.props.isAuthenticated && areInputsInvalid;
    }

    componentDidMount() {
      const { inviteToken } = this.props.match.params;
      if (inviteToken) {
        this.props.onFetchInvitationData(inviteToken);
      }
      if (!this.props.isAuthenticated) {
        this.onSwitchToSignUp();
      }
    }

    componentDidUpdate(prevProps, prevState) {
      const { openIdAuthenticateActionResult } = this.props;
      const { showGoogleSignUpConfirmation } = this.state;
      if (
        openIdAuthenticateActionResult &&
        openIdAuthenticateActionResult.code ===
        AuthStatus.ACCOUNT_DOES_NOT_EXIST &&
        !showGoogleSignUpConfirmation
      ) {
        this.setState({
          showGoogleSignUpConfirmation: true,
        });
      }
    }
  }

  function mapStateToProps(state, props) {
    const { inviteToken } = props.match.params;
    return {
      openIdAuthenticateActionResult:
        onSignInWithGoogleAccountActionResult(state),
      userId: selectInvitationUserId(state),
      isLoaded: selectRequestIsSuccess(state, {
        requestType: getChatWithMeInvitationData,
        objectId: inviteToken,
      }),
      isJoining: selectRequestIsSuccess(state, {
        requestType: joinChatWithMe,
        objectId: inviteToken,
      }),
      organizationId: selectInvitationOrganizationId(state),
      organizationName: selectInvitationOrganizationName(state),
      isAuthenticated: isAuthenticated(state),
      userEmail: selectCurrentUserEmail(state),
      fullName: selectFullName(state),
      email: selectEmail(state),
      password: selectPassword(state),
      isAcceptingTerms: selectIsAcceptingTerms(state),
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onFetchInvitationData: (inviteToken: string) =>
        dispatch(onFetchInvitationData(inviteToken)),
      onJoinChat: (
        inviteToken: string,
        isSigningUp: boolean,
        isAuthenticatingWithGoogle: boolean,
        token: string
      ) =>
        dispatch(
          onJoinChat(
            inviteToken,
            isSigningUp,
            isAuthenticatingWithGoogle,
            token
          )
        ),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceJoinChatWithMePage);
}

export default Enhance;
