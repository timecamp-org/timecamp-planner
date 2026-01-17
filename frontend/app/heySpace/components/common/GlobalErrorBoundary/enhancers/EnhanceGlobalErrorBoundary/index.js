import React from 'react';

import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import * as AppModelSelectors from 'models/domain/AppModel/selectors';

function enhance(Component) {
  class EnhanceGlobalErrorBoundary extends BaseComponent {

    render() {
      return <Component {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      appHasError: AppModelSelectors.hasError(state),
    };
  }

  return connect(mapStateToProps)(EnhanceGlobalErrorBoundary);
}

export default enhance;
