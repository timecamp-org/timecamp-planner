import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { doNothing } from '../../../utils'

import BaseComponent from '../../BaseComponent'

import { onUpdateMessageRead } from '../../../models/domain/MessagesModel/actions'
import { selectIsPageVisible, selectIsUserIdle } from '../../../models/domain/AppModel/selectors'
import { onResetUnreadNotifications } from '../../../models/domain/NotificationsModel/actions'
import { selectAreThereUnreadObjectNotifications } from '../../../models/domain/NotificationsModel/selectors'
import * as RequestTypesConstants from '../../../models/domain/RequestModel/constants/requestTypes'
import { selectRequestIsLoading, selectIsRequestDirty } from '../../../models/domain/RequestModel/selectors'
import { selectLastReadMessageId } from '../../../models/domain/MessagesModel/selectors'
import { selectProjectHasUnreadMessages } from '../../../models/domain/ProjectsModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceWithOnMessageRead extends BaseComponent {

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      objectType: PropTypes.string.isRequired,
      chatItems: ImmutablePropTypes.list,

      onScrolledBottom: PropTypes.func,
      hasMoreNewerChatItemsToLoad: PropTypes.func,
      isScrolledToBottom: PropTypes.func,
      isRequestDirty: PropTypes.bool
    }

    static defaultProps = {
      chatItems: new List(),

      onScrolledBottom: doNothing,
      hasMoreNewerChatItemsToLoad: doNothing,
      isScrolledToBottom: doNothing,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onScrolledBottom={this.onScrolledBottom}
        />
      )
    }

    onScrolledBottom() {
      if (!this.props.hasMoreNewerChatItemsToLoad()) {
        this.onMessagesRead()
      }

      this.props.onScrolledBottom()
    }

    onMessagesRead() {
      const lastChatMessage = this.getLastChatMessage()
      const messageId = lastChatMessage ? lastChatMessage.get('id') : null
      if (messageId && (messageId !== this.props.lastReadMessageId || this.props.projectHasUnreadMessages)) {
        this.props.onUpdateMessageRead(messageId)
      }
      if (this.props.areThereUnreadObjectNotifications) {
        this.props.onResetUnreadNotifications()
      }
    }

    getLastChatMessage() {
      return this.props.chatItems
        .filter(item => item.get('type') === 'message')
        .last()
    }

    componentDidUpdate(prevProps) {
      const currentLastChatItem = this.props.chatItems.last()
      const currentLastChatItemId = currentLastChatItem ? currentLastChatItem.get('id') : null

      const prevLastChatItem = prevProps.chatItems.last()
      const prevLastChatItemId = prevLastChatItem ? prevLastChatItem.get('id') : null

      const wasUserNotFocused = prevProps.isUserIdle || !prevProps.isPageVisible
      const isLastMessageChanged = prevLastChatItemId !== currentLastChatItemId
      const areThereNewUnreadObjectNotifications = !prevProps.areThereUnreadObjectNotifications && this.props.areThereUnreadObjectNotifications

      if (this.props.chatItems.size > 0
        && this.props.isScrolledToBottom()
        && !this.props.hasMoreNewerChatItemsToLoad()
        && !this.props.isUserIdle
        && this.props.isPageVisible
        && !this.props.isLastMessageSending
        && (wasUserNotFocused || isLastMessageChanged || areThereNewUnreadObjectNotifications)
        && !this.props.isRequestDirty
        ) {
        this.onMessagesRead()
      }
    }

    componentDidMount() {
      if (this.props.chatItems.size > 0
        && !this.props.isLastMessageSending
        && this.props.isScrolledToBottom()
        && !this.props.hasMoreNewerChatItemsToLoad()
        && !this.props.isRequestDirty
        ) {
        this.onMessagesRead()
      }
    }

  }

  function mapStateToProps(state, props) {
    const lastChatItem = props.chatItems.last()
    const messageId = lastChatItem ? lastChatItem.get('id') : null
    return {
      isLastMessageSending: selectRequestIsLoading(state, { requestType: RequestTypesConstants.sendMessage, objectId: messageId }),
      isUserIdle: selectIsUserIdle(state),
      isPageVisible: selectIsPageVisible(state),
      areThereUnreadObjectNotifications: selectAreThereUnreadObjectNotifications(state, { objectId: props.objectId }),
      lastReadMessageId: selectLastReadMessageId(state, { objectId: props.objectId }),
      projectHasUnreadMessages: selectProjectHasUnreadMessages(state, { projectId: props.objectId }),
      isRequestDirty: selectIsRequestDirty(state, { requestType: RequestTypesConstants.initiallyFetchChatItems, objectId: props.objectId })
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUpdateMessageRead: (messageId) => dispatch(onUpdateMessageRead(props.objectId, messageId, props.objectType)),
      onResetUnreadNotifications: () => dispatch(onResetUnreadNotifications(props.objectId)),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceWithOnMessageRead)
}

export default (Enhance)
