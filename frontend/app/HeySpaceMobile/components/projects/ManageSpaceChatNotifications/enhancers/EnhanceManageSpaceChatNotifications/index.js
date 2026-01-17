import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { ChatNotificationSettingsType } from 'models/domain/NotificationsModel/types'
import { selectChatNotificationSettingsType } from 'models/domain/NotificationsModel/selectors'
import { onSetChatNotificationSettingsType } from 'models/domain/NotificationsModel/actions'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

function enhance(ComposedComponent) {
  class EnhanceManageSpaceChatNotifications extends BaseComponent {

    static propTypes = {
      projectId: PropTypes.string.isRequired,
      chatNotificationSettingsType: PropTypes.string.isRequired,
      onSetChatNotificationSettingsType: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          isProjectEditable={this.props.isProjectEditable}
          chatNotificationSettingsType={this.props.chatNotificationSettingsType}

          onSetAllNotificationsEnabled={this.onSetAllNotificationsEnabled}
          onSetMentionsOnlyNotificationsEnabled={this.onSetMentionsOnlyNotificationsEnabled}
          onSetNoNotificationsEnabled={this.onSetNoNotificationsEnabled}
        />
      )
    }

    onSetAllNotificationsEnabled() {
      this.props.onSetChatNotificationSettingsType(ChatNotificationSettingsType.ALL)
    }

    onSetMentionsOnlyNotificationsEnabled() {
      this.props.onSetChatNotificationSettingsType(ChatNotificationSettingsType.ONLY_MENTIONS)
    }

    onSetNoNotificationsEnabled() {
      this.props.onSetChatNotificationSettingsType(ChatNotificationSettingsType.NOTHING)
    }

  }

  const mapStateToProps = (state, props) => ({
    chatNotificationSettingsType: selectChatNotificationSettingsType(state, { objectId: props.projectId }),
  })

  const mapDispatchToProps = (dispatch, props) => ({
    onSetChatNotificationSettingsType: (type) => dispatch(onSetChatNotificationSettingsType(props.projectId, type)),
  })

  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceManageSpaceChatNotifications))
}

export default enhance
