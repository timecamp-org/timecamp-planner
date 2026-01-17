import React from 'react'
import BaseComponent from 'BaseComponent'
import { connect } from 'react-redux'

import { NavigationService } from 'common/services'
import RouteName from '../../AppNavigation/routeNames'
import { selectIsRequestFinished } from 'models/domain/RequestModel/selectors'
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectFirstProjectData } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectIsNavigationStateLoaded } from 'models/mobile/NavigationModel/selectors'
import { selectCurrentUserExistingOrganizationIds } from 'models/domain/UsersModel/selectors'
import getDefaultAppRoute from '../../../utils/getDefaultAppRoute'
import isInProjectRoute from '../../../utils/isInProjectRoute'


class NavigationController extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <></>
    )
  }

  doRedirect() {
    const { currentUserOrganizationIds, firstProjectData } = this.props
    const hasUserOrganizations = currentUserOrganizationIds.size > 0
    if (firstProjectData) {
      if (!isInProjectRoute()) {
        const defaultAppRoute = getDefaultAppRoute({ firstProjectData })
        NavigationService.navigate(defaultAppRoute.route, defaultAppRoute.props)
      }
    } else if (hasUserOrganizations) {
      NavigationService.reset(RouteName.FIRST_PROJECT_PLACEHOLDER)
    } else {
      NavigationService.reset(RouteName.CREATE_NEW_WORKSPACE)
    }
  }

  componentDidUpdate(prevProps) {
    const isLoadingFinished = prevProps.isLoadingInitialData && !this.props.isLoadingInitialData

    if (isLoadingFinished) {
      this.doRedirect()
    }
  }

  componentDidMount() {
    const { firstProjectData } = this.props
    if (!this.props.isLoadingInitialData && this.props.isNavigationStateLoaded) {
      if (firstProjectData && !isInProjectRoute()) {
        const defaultAppRoute = getDefaultAppRoute({ firstProjectData })
        NavigationService.navigate(defaultAppRoute.route, defaultAppRoute.props)
      }
    }
  }

}

const mapStateToProps = (state) => {
  const currentUserId = selectCurrentUserId(state)
  return {
    isLoadingInitialData: !selectIsRequestFinished(state, { requestType: RequestTypesConstants.getUserInitialData, objectId: currentUserId }),
    firstProjectData: selectFirstProjectData(state),
    isNavigationStateLoaded: selectIsNavigationStateLoaded(state),
    currentUserOrganizationIds: selectCurrentUserExistingOrganizationIds(state),
  }
}

export default connect(mapStateToProps)(NavigationController)
