import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchError } from 'common/utils/makeActionResult';
import { isValidEmail } from 'common/utils/validation';
import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectEmail } from 'models/component/CredentialsModel/selectors';
import { onSendEmailWithPasswordChangeLink } from 'models/domain/CurrentUserModel/actions';
import { onSendEmailWithPasswordChangeLinkActionResult } from 'models/domain/CurrentUserModel/selectors';

function enhance(Component) {
  class EnhanceForgottenPasswordOfflinePage extends BaseComponent {
    static propTypes = {
      // withRouter
      history: PropTypes.object,
    };

    state = {
      isLoading: false,
    };

    render() {
      return <Component isLoading={this.state.isLoading} loadingType={'forgottenPassword'} onRetry={this.onRetry} />;
    }

    onRetry() {
      if (!this.state.isLoading && this.areAllInputsValid()) {
        this.props.onSendEmailWithPasswordChangeLink(this.props.email);
        this.setState({ isLoading: true });
      } else if (!this.areAllInputsValid()) {
        this.props.history.push(`/forgottenPassword`);
      }
    }

    areAllInputsValid() {
      return isValidEmail(this.props.email);
    }

    componentDidUpdate() {
      if (this.props.actionResult !== null && this.state.isLoading) {
        this.setState({ isLoading: false });
      }

      if (this.props.actionResult) {
        const { code } = this.props.actionResult;
        // redirect if online
        if (code !== fetchError) {
          this.props.history.push(`/forgottenPassword`);
        }
      }
    }
  }

  function mapStateToProps(state) {
    const actionResult = onSendEmailWithPasswordChangeLinkActionResult(state);
    return {
      email: selectEmail(state),
      actionResult,
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSendEmailWithPasswordChangeLink: (email: string) => dispatch(onSendEmailWithPasswordChangeLink({ email })),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
    //@ts-ignore
  )(EnhanceForgottenPasswordOfflinePage);
}

export default enhance;
