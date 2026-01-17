import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectIsWorkspaceMembersValidForSubscription } from 'models/domain/SubscriptionLimitsModel/selectors'
import RouteName from 'components/AppNavigation/routeNames'
import { NavigationService } from 'common/services'
import { selectIsRequestFinished } from 'models/domain/RequestModel/selectors'
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'

function RedirectToSubscriptionExpiredIfMembersNotValid(ComposedComponent) {
  class RedirectToSubscriptionExpiredIfMembersNotValid extends React.Component {

    static propTypes = {
      isWorkspaceMembersValidForSubscription: PropTypes.bool,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
        />
      )
    }

    onNavigateToSubscriptionExpired() {
      NavigationService.navigate(RouteName.SUBSCRIPTION_EXPIRED)
    }

    componentDidMount() {
      if (!this.props.isWorkspaceMembersValidForSubscription && !this.props.isLoading) {
        this.onNavigateToSubscriptionExpired()
      }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.isWorkspaceMembersValidForSubscription && !this.props.isWorkspaceMembersValidForSubscription && !this.props.isLoading) {
        this.onNavigateToSubscriptionExpired()
      }
    }
}

  const mapStateToProps = (state, props) => {
    const organizationId = selectCurrentOrganizationId(state)

    return {
      isLoading: !selectIsRequestFinished(state, { requestType: RequestTypesConstants.getOrganizationPeople, objectId: organizationId }),
      isWorkspaceMembersValidForSubscription: selectIsWorkspaceMembersValidForSubscription(state),

    }
  }

  return connect(mapStateToProps)(RedirectToSubscriptionExpiredIfMembersNotValid)
}

export default RedirectToSubscriptionExpiredIfMembersNotValid
