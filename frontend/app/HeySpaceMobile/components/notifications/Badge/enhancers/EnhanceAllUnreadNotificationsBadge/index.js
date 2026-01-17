import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectAllUnreadNotificationsSinceLastDisplayCount } from 'models/domain/NotificationsModel/selectors'
import { getNotificationTypesByNotificationCenterType } from 'models/domain/NotificationsModel/utils'
import { NotificationCenterType } from 'models/domain/NotificationsModel/types'

function enhance(ComposedComponent) {

  class EnhanceAllUnreadNotificationsBadge extends BaseComponent {

    static propTypes = {
      count: PropTypes.number.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          count={this.props.count}
          style={this.props.style}
          textColor={this.props.textColor}
          color={this.props.color}
        />
      )
    }

  }

  const mapStateToProps = (state) => {
    const includedNotificationTypes = getNotificationTypesByNotificationCenterType(NotificationCenterType.ALL)
    return {
      count: selectAllUnreadNotificationsSinceLastDisplayCount(state, { includedNotificationTypes }),
    }
  }


  return connect(mapStateToProps)(EnhanceAllUnreadNotificationsBadge)
}

export default enhance
