import React from 'react'
import BaseComponent from 'BaseComponent'
import { connect } from 'react-redux'

import { NavigationService } from 'common/services'
import RouteName from '../../../../AppNavigation/routeNames'
import { selectIsRequestFinished } from 'models/domain/RequestModel/selectors'
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectFirstProjectData } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import getDefaultAppRoute from '../../../../../utils/getDefaultAppRoute'
import isInProjectRoute from '../../../../../utils/isInProjectRoute'

function Enhance(ComposedComponent) {
  class EnhanceProjectLoader extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    render() {
      return (
        <ComposedComponent />
      )
    }

    doRedirect() {
      const { firstProjectData } = this.props
      if (firstProjectData) {
        if (!isInProjectRoute()) {
          const defaultAppRoute = getDefaultAppRoute({ firstProjectData })
          NavigationService.navigate(defaultAppRoute.route, defaultAppRoute.props)
        }
      } else {
        NavigationService.reset(RouteName.FIRST_PROJECT_PLACEHOLDER)
      }
    }

    componentDidUpdate() {
      const isLoadingFinished = !this.props.isLoadingInitialData
      if (isLoadingFinished) {
        this.doRedirect()
      }
    }

    componentDidMount() {
      const isLoadingFinished = !this.props.isLoadingInitialData
      if (isLoadingFinished) {
        this.doRedirect()
      }
    }

  }

  const mapStateToProps = (state) => {
    const currentUserId = selectCurrentUserId(state)
    return {
      isLoadingInitialData: !selectIsRequestFinished(state, { requestType: RequestTypesConstants.getUserInitialData, objectId: currentUserId }),
      firstProjectData: selectFirstProjectData(state),
    }
  }

  return connect(mapStateToProps)(EnhanceProjectLoader)
}

export default Enhance
