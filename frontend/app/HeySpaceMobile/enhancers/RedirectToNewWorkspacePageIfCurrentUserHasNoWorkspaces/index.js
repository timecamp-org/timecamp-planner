import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List } from 'immutable'

import RouteName from 'components/AppNavigation/routeNames'
import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors'
import { NavigationService } from 'common/services'
import { selectIsRequestFinished } from 'models/domain/RequestModel/selectors'
import { getOrganizations } from 'models/domain/RequestModel/constants/requestTypes'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'

function enhance(ComposedComponent) {
  class RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces extends React.Component {

    static propTypes = {
      currentUserOrganizationIds: ImmutablePropTypes.list.isRequired,
      isCurrentUserAuthenticated: PropTypes.bool.isRequired,
    }

    static defaultProps = {
      currentUserOrganizationIds: new List(),
      isCurrentUserAuthenticated: false,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }

    onNavigateToCreateNewWorkspacePage() {
      NavigationService.reset(RouteName.CREATE_NEW_WORKSPACE)
    }

    componentDidMount() {
      if (this.props.currentUserOrganizationIds.size === 0 && this.props.isCurrentUserAuthenticated && this.props.isGetOrganizationRequestFinished) {
        this.onNavigateToCreateNewWorkspacePage()
      }
    }

    componentDidUpdate(prevProps) {
      if ((!prevProps.isCurrentUserAuthenticated || prevProps.currentUserOrganizationIds.size > 0)
        && this.props.currentUserOrganizationIds.size === 0
        && this.props.isCurrentUserAuthenticated
        && this.props.isGetOrganizationRequestFinished
      ) {
        this.onNavigateToCreateNewWorkspacePage()
      }
    }

  }

  function mapStateToProps(state) {
    const currentUserId = selectCurrentUserId(state)
    return {
      currentUserOrganizationIds: selectCurrentUserExistingOrganizationIds(state),
      isGetOrganizationRequestFinished: selectIsRequestFinished(state, {
        requestType: getOrganizations,
        objectId: currentUserId,
      })
    }
  }

  return connect(mapStateToProps)(RedirectToNewWorkspacePageIfCurrentUserHasNoWorkspaces)
}

export default enhance
