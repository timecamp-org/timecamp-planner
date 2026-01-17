import React from 'react'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'

import {
  selectEnableEmailNotifications,
  selectEnableMobileNotifications,
} from 'models/domain/NotificationsModel/selectors/domain'
import { NotificationMethod } from 'models/domain/NotificationsModel/types'

import {
  onUpdateNotificationSettings,
  onFetchNotificationSettings,
} from 'models/domain/NotificationsModel/actions'
import { selectRequestIsLoading } from 'models/domain/RequestModel/selectors'
import { getNotificationsSettings } from 'models/domain/RequestModel/constants/requestTypes'

function enhance(ComposedComponent) {
  class EnhanceNotificationSettings extends BaseComponent {

    render() {
      return (
        <ComposedComponent
          isEnableEmailNotifications={this.props.isEnableEmailNotifications}
          isEnableMobileNotifications={this.props.isEnableMobileNotifications}
          isNotificationsSettingsLoading={this.props.isNotificationsSettingsLoading}

          onSwitchEmailNotifications={this.onSwitchEmailNotifications}
          onSwitchMobileNotifications={this.onSwitchMobileNotifications}
        />
      )
    }

    onSwitchEmailNotifications() {
      this.props.onUpdateNotificationSettings(NotificationMethod.EMAIL, !this.props.isEnableEmailNotifications)
    }

    onSwitchMobileNotifications() {
      this.props.onUpdateNotificationSettings(NotificationMethod.MOBILE, !this.props.isEnableMobileNotifications)
    }

    componentDidMount() {
      this.props.onFetchNotificationSettings()
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      isEnableEmailNotifications: selectEnableEmailNotifications(state),
      isEnableMobileNotifications: selectEnableMobileNotifications(state),
      isNotificationsSettingsLoading: selectRequestIsLoading(state, { requestType: getNotificationsSettings, objectId: props.currentOrganizationId }),
    }
  }

  function mapDispatchToProps(dispatch) {
    return {
      onUpdateNotificationSettings: (notificationMethod, isEnabled) => dispatch(onUpdateNotificationSettings(notificationMethod, isEnabled)),
      onFetchNotificationSettings: () => dispatch(onFetchNotificationSettings()),
    }
  }


  return connect(mapStateToProps, mapDispatchToProps)(EnhanceNotificationSettings)
}

export default enhance
