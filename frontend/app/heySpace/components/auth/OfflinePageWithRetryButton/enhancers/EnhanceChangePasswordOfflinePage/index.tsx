import React from 'react';

import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';

import { fetchError } from 'common/utils/makeActionResult';
import { isValidPassword } from 'common/utils/validation';
import BaseComponent from 'commonEnhancers/BaseComponent';
import * as CredentialsModelSelectors from 'models/component/CredentialsModel/selectors';
import * as CurrentUserModelActions from 'models/domain/CurrentUserModel/actions';
import * as CurrentUserModelSelectors from 'models/domain/CurrentUserModel/selectors';

function enhance(Component) {
  class EnhanceChangePasswordOfflinePage extends BaseComponent {
    static propTypes = {
      // withRouter
      history: PropTypes.object,
    };

    state = {
      isLoading: false,
    };

    render() {
      return <Component isLoading={this.state.isLoading} loadingType={'changePassword'} onRetry={this.onRetry} />;
    }

    onRetry() {
      const { token } = queryString.parse(this.props.location.search);
      if (!this.state.isLoading && this.areAllInputsValid()) {
        this.props.onSetPassword(token, this.props.password);
        this.setState({ isLoading: true });
      } else if (!this.areAllInputsValid()) {
        this.props.history.push(`/changePassword?token=${token}`);
      }
    }

    areAllInputsValid() {
      return isValidPassword(this.props.password);
    }

    componentDidUpdate() {
      if (this.props.actionResult && this.state.isLoading) {
        this.setState({ isLoading: false });
      }

      if (this.props.actionResult) {
        const { token } = queryString.parse(this.props.location.search);
        const { code } = this.props.actionResult;
        // redirect if online
        if (code !== fetchError) {
          this.props.history.push(`/changePassword?token=${token}`);
        }
      }
    }
  }

  function mapStateToProps(state) {
    const actionResult = CurrentUserModelSelectors.onSetPasswordActionResult(state);
    return {
      password: CredentialsModelSelectors.selectPassword(state),
      actionResult,
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSetPassword: (token: string, newPassword: string) =>
        dispatch(CurrentUserModelActions.onSetPassword({ token, newPassword })),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
    //@ts-ignore
  )(EnhanceChangePasswordOfflinePage);
}

export default enhance;
