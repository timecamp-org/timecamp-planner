import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import RouteName from '../../../../AppNavigation/routeNames'
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions'
import { selectAllUnreadNotificationsSinceLastDisplayCount } from 'models/domain/NotificationsModel/selectors'
import { NotificationCenterType } from 'models/domain/NotificationsModel/types'
import { selectIsWorkspaceMembersValidForSubscription } from 'models/domain/SubscriptionLimitsModel/selectors'
import { NavigationService } from 'common/services'
import { getNotificationTypesByNotificationCenterType } from 'models/domain/NotificationsModel/utils'

function enhance(ComposedComponent) {
  class EnhanceNotificationsCenterIcon extends BaseComponent {

    static propTypes = {
      unreadNotificationsCount: PropTypes.number.isRequired,
      onSetUnreadNotificationsDisplay: PropTypes.func,
    }

    render() {
      // TODO: ugly ash f*** but this is the only way. This component is rendered directly from AppRouting (unenhanceable)
      if (this.props.isWorkspaceMembersValidForSubscription) {
        return (
          <ComposedComponent
            onNavigateToNotificationsCenter={this.onNavigateToNotificationsCenter}
            areThereUnreadNotifications={this.props.unreadNotificationsCount > 0}
          />
        )
      } else {
        return null
      }

    }

    onNavigateToNotificationsCenter() {
      NavigationService.navigate(RouteName.NOTIFICATIONS_CENTER)
      this.props.onSetUnreadNotificationsDisplay()
    }

  }

  function mapStateToProps(state, props) {
    const includedNotificationTypes = getNotificationTypesByNotificationCenterType(NotificationCenterType.ALL)
    return {
      unreadNotificationsCount: selectAllUnreadNotificationsSinceLastDisplayCount(state, { includedNotificationTypes }),
      isWorkspaceMembersValidForSubscription: selectIsWorkspaceMembersValidForSubscription(state),
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      onSetUnreadNotificationsDisplay: () => dispatch(NotificationsModelActions.onSetUnreadNotificationsDisplay(NotificationCenterType.ALL)),
    }
  }


  return connect(mapStateToProps, mapDispatchToProps)(EnhanceNotificationsCenterIcon)
}

export default enhance
