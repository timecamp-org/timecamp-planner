import React from 'react';

import { isAuthenticated } from 'models/domain/CurrentUserModel/selectors';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function enhance(ComposedComponent) {
  class EnhanceWithIsCurrentUserAuthenticated extends React.Component {

    static propTypes = {
      isCurrentUserAuthenticated: PropTypes.bool.isRequired,
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isCurrentUserAuthenticated: isAuthenticated(state),
    };
  }

  // @ts-ignore
  return connect(mapStateToProps)(EnhanceWithIsCurrentUserAuthenticated);
}

export default enhance;
