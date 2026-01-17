import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as AppModelSelectors from 'models/domain/AppModel/selectors'

import BaseComponent from 'BaseComponent'

function enhance(Component) {
  class EnhanceGlobalErrorBoundary extends BaseComponent {

    static propTypes = {
      className: PropTypes.string,
    }


    render() {
      return (
        <Component
          {...this.props}
        />
      )
    }

  }

  function mapStateToProps(state) {
    return {
      appHasError: AppModelSelectors.hasError(state),
    }
  }

  return connect(mapStateToProps)(EnhanceGlobalErrorBoundary)
}

export default enhance
