import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import RouteName from 'components/AppNavigation/routeNames'

import BaseComponent from 'BaseComponent'
import EnhanceWithIsCurrentUserAuthenticated from 'common/enhancers/EnhanceWithIsCurrentUserAuthenticated'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  class RedirectToSignInPageIfCurrentUserIsDeauthenticated extends BaseComponent {

    static propTypes = {
      isCurrentUserAuthenticated: PropTypes.bool.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }

    onNavigateToSignInPage() {
      if (NavigationService.getCurrentRouteName() !== RouteName.SIGN_IN) {
        NavigationService.navigate(RouteName.SIGN_IN)
      }
    }

    componentDidMount() {
      if (!this.props.isCurrentUserAuthenticated) {
        this.onNavigateToSignInPage()
      }
    }

    componentDidUpdate() {
      if (!this.props.isCurrentUserAuthenticated) {
        this.onNavigateToSignInPage()
      }
    }

  }

  return EnhanceWithIsCurrentUserAuthenticated(connect()(RedirectToSignInPageIfCurrentUserIsDeauthenticated))
}

export default enhance
