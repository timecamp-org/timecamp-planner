import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as NotificationsModelSelectors from 'models/domain/NotificationsModel/selectors'
import { NotificationType } from 'models/domain/NotificationsModel/types'

import BaseComponent from 'BaseComponent'

function Enhance(ComposedComponent) {
  class EnhanceNotificationIcon extends BaseComponent {

    static propTypes = {
      notificationId: PropTypes.string.isRequired,
      actorId: PropTypes.string,
    }

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          actorId={this.props.actorId}
          activityChanges={this.props.activityChanges}
          shouldRenderPersonIcon={this.shouldRenderPersonIcon()}
        />
      )
    }

    shouldRenderPersonIcon() {
      return this.props.actorId && ![NotificationType.INVITATION_JOINED].includes(this.props.notificationType)
    }

  }

  function mapStateToProps(state, props) {
    return {
      actorId: NotificationsModelSelectors.selectNotificationActorId(state, { notificationId: props.notificationId }),
      activityChanges: NotificationsModelSelectors.selectNotificationActivityChanges(state, { notificationId: props.notificationId }),
      notificationType: NotificationsModelSelectors.selectNotificationType(state, { notificationId: props.notificationId }),
    }
  }

  return connect(mapStateToProps)(EnhanceNotificationIcon)
}

export default Enhance
