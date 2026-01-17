import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import RouteName from 'components/AppNavigation/routeNames'

import BaseComponent from 'BaseComponent'
import EnhanceWithIsCurrentUserAuthenticated from 'common/enhancers/EnhanceWithIsCurrentUserAuthenticated'
import { NavigationService } from 'common/services'
import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors'

function enhance(ComposedComponent) {
  class NavigateToDefaultPageIfCurrentUserIsAuthenticated extends BaseComponent {

    static propTypes = {
      isCurrentUserAuthenticated: PropTypes.bool.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onNavigateToDefaultPage={this.onNavigateToDefaultPage}
          isCurrentUserAuthenticated={this.props.isCurrentUserAuthenticated}
        />
      )
    }

    onNavigateToDefaultPage() {
      NavigationService.navigate(RouteName.PROJECT_LOADER)
    }

    shouldNavigateToDefaultPage(prevProps) {
      const userBecameAuthenticated = (!prevProps.isCurrentUserAuthenticated && this.props.isCurrentUserAuthenticated && this.props.currentUserOrganizationIds.size > 0)
      const userHaveWorkspace = prevProps.currentUserOrganizationIds.size === 0 && this.props.currentUserOrganizationIds.size > 0

      return userBecameAuthenticated || userHaveWorkspace
    }

    componentDidMount() {
      if (this.props.isCurrentUserAuthenticated && this.props.currentUserOrganizationIds.size > 0) {
        this.onNavigateToDefaultPage()
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.shouldNavigateToDefaultPage(prevProps, prevState)) {
        this.onNavigateToDefaultPage()
      }
    }

  }

  function mapStateToProps(state, props) {
    return {
      currentUserOrganizationIds: selectCurrentUserExistingOrganizationIds(state)
    }
  }

  return EnhanceWithIsCurrentUserAuthenticated(connect(mapStateToProps)(NavigateToDefaultPageIfCurrentUserIsAuthenticated))
}

export default enhance
