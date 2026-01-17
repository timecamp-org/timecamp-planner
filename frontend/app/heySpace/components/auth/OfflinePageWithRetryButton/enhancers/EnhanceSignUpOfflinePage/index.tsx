import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchError } from 'common/utils/makeActionResult';
import { isValidEmail, isValidPassword } from 'common/utils/validation';
import BaseComponent from 'commonEnhancers/BaseComponent';
import * as CredentialsModelSelectors from 'models/component/CredentialsModel/selectors';
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';

function enhance(Component) {
  class EnhanceSignUpOfflinePage extends BaseComponent {
    static propTypes = {
      // withRouter
      history: PropTypes.object,
    };

    state = {
      isLoading: false,
    };

    render() {
      return <Component isLoading={this.state.isLoading} loadingType={'signUp'} onRetry={this.onRetry} />;
    }

    onRetry() {
      const { openIdAuthenticateActionResult } = this.props;
      const googleAuthFailed = openIdAuthenticateActionResult && openIdAuthenticateActionResult.code === fetchError;
      if (!this.state.isLoading && this.areAllInputsValid() && !googleAuthFailed) {
        this.props.onSignUp(this.props.email, this.props.password);
        this.setState({ isLoading: true });
      } else if (!this.areAllInputsValid()) {
        this.props.history.push(`/register`);
      }
    }

    areAllInputsValid() {
      return isValidEmail(this.props.email) && isValidPassword(this.props.password);
    }

    componentDidUpdate() {
      if (this.props.authenticateActionResult && this.state.isLoading) {
        this.setState({ isLoading: false });
      }

      if (this.props.authenticateActionResult) {
        const { code, isOk } = this.props.authenticateActionResult;
        // redirect if online but wrong email and password
        if (code !== fetchError && !isOk) {
          this.props.history.push(`/register`);
        }
      }
    }
  }

  function mapStateToProps(state) {
    const authenticateActionResult = CurrentUserModelSelectors.onSignUpActionResult(state);
    const openIdAuthenticateActionResult = CurrentUserModelSelectors.onSignInWithGoogleAccountActionResult(state);
    return {
      email: CredentialsModelSelectors.selectEmail(state),
      password: CredentialsModelSelectors.selectPassword(state),
      authenticateActionResult,
      openIdAuthenticateActionResult,
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSignUp: (username: string, password: string) =>
        dispatch(CurrentUserModelActions.onSignUp({ username, password })),
      onSignInWithGoogleAccount: () => dispatch(CurrentUserModelActions.onSignInWithGoogleAccount()),
    };
  }

  //@ts-ignore
  return connect(mapStateToProps, mapDispatchToProps)(EnhanceSignUpOfflinePage);
}

export default enhance;
