import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { doNothing } from 'common/utils';
import handleError from 'common/utils/handleError';

import { onSignInWithGoogleAccount } from 'models/domain/CurrentUserModel/actions';
import { GoogleApiClient } from 'common/services';

import BaseComponent from 'commonEnhancers/BaseComponent';

function enhance(Component) {
  class EnhanceGoogleButton extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,

      buttonText: PropTypes.string,

      onClick: PropTypes.func,
      onCustomSignIn: PropTypes.func,
    };

    static defaultProps = {
      onClick: doNothing,
    };

    state = {
      isDisabled: false,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          buttonText={this.props.buttonText}
          isDisabled={this.state.isDisabled}
          onClick={this.onClick}
        />
      );
    }

    componentDidMount() {
      // disable button if gac is not available
      GoogleApiClient.initIfNotInitialized((error) => {
        if (error) {
          handleError(error);
          this.setState({
            isDisabled: true,
          });
        }
      });
    }

    onClick() {
      this.props.onClick();

      if (this.props.onCustomSignIn) {
        this.props.onCustomSignIn();
      } else {
        this.props.onSignInWithGoogleAccount();
      }
    }
  }

  function mapStateToProps(state) {
    return {};
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onSignInWithGoogleAccount: () => dispatch(onSignInWithGoogleAccount()),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceGoogleButton);
}

export default enhance;
