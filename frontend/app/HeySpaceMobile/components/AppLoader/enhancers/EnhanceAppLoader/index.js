import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import BaseComponent from 'BaseComponent'
import * as AppModelSelectors from 'models/domain/AppModel/selectors'
import EnhanceWithIsCurrentUserAuthenticated from 'common/enhancers/EnhanceWithIsCurrentUserAuthenticated'

function enhance(ComposedComponent) {
  class EnhanceAppLoader extends BaseComponent {

    static propTypes = {
      isLoading: PropTypes.bool.isRequired,
    }

    render() {
      return <ComposedComponent
        isLoading={this.props.isLoading}
      />
    }

  }

  const mapStateToProps = (state) => {
    const appHasLoaded = AppModelSelectors.hasLoaded(state)
    return {
      isLoading: !appHasLoaded,
    }
  }

  return connect(mapStateToProps)(EnhanceWithIsCurrentUserAuthenticated(EnhanceAppLoader))
}

export default enhance
