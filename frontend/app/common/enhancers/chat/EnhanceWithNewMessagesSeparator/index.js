import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'

import BaseComponent from '../../BaseComponent'

import { selectLastReadMessageId, selectLastMessageId, selectLastMessageUserId } from '../../../models/domain/MessagesModel/selectors'
import { selectObjectMessagesUser } from '../../../models/domain/MessagesModel/selectors/domain'
import { selectCurrentUserId } from '../../../models/domain/UsersModel/selectors/domain'

import { NEW_MESSAGES_SEPARATOR, MESSAGE } from '../../../models/domain/MessagesModel/constants/messageTypes'

const newMessageSeparatorItem = new Map({
  id: NEW_MESSAGES_SEPARATOR,
  type: NEW_MESSAGES_SEPARATOR,
})

function Enhance(ComposedComponent) {
  class EnhanceWithNewMessagesSeparator extends BaseComponent {

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      chatItems: ImmutablePropTypes.list,
    }

    static defaultProps = {
      chatItems: new List(),
      messagesUser: new Map(),
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          chatItems={this.getList()}
        />
      )
    }

    state = {
      lastReadMessageIdOnChatLoaded: this.props.lastReadMessageId,
    }

    getList() {
      const { chatItems } = this.props
      const lastReadItemIndex = this.getLastReadItemIndex()
      const newMessagesSeparatorIndex = lastReadItemIndex + 1

      if (lastReadItemIndex !== -1 && newMessagesSeparatorIndex < chatItems.size) {
        return chatItems.insert(newMessagesSeparatorIndex, newMessageSeparatorItem)
      } else {
        return chatItems
      }
    }

    getLastReadItemIndex() {
      let lastReadMessageId = this.state.lastReadMessageIdOnChatLoaded
      let nextItemId = this.getNextChatItemId(this.state.lastReadMessageIdOnChatLoaded)
      while (nextItemId && (!this.isMessage(nextItemId) || this.isMessageSentByCurrentUser(nextItemId))) {
        lastReadMessageId = nextItemId
        nextItemId = this.getNextChatItemId(nextItemId)
      }

      return this.getItemIndex(lastReadMessageId)
    }

    isMessage(id) {
      return this.props.chatItems.find(chatItem => chatItem.get('id') === id).get('type') === MESSAGE
    }

    getItemIndex(id) {
      return this.props.chatItems.map((item) => item.get('id')).indexOf(id)
    }

    getNextChatItemId(id) {
      const index = this.getItemIndex(id)
      if (index === -1) {
        return null
      }

      return this.props.chatItems.getIn([index + 1, 'id'])
    }

    isMessageSentByCurrentUser(messageId) {
      return this.props.messagesUser.get(messageId) === this.props.currentUserId
    }

    componentDidUpdate(prevProps) {
      const isLastReadMessageChanged = prevProps.lastReadMessageId !== this.props.lastReadMessageId
      const isLastMessageLastRead = this.props.lastReadMessageId === this.props.lastMessageId

      if (
        ((!prevProps.lastReadMessageId && this.props.lastReadMessageId)
          || prevProps.objectId !== this.props.objectId
          || (!isLastMessageLastRead && isLastReadMessageChanged))
        && this.props.lastReadMessageId !== this.state.lastReadMessageIdOnChatLoaded
      ) {
        this.setState({
          lastReadMessageIdOnChatLoaded: this.props.lastReadMessageId,
        })
      }
    }

  }

  const mapStateToProps = (state, props) => ({
    lastReadMessageId: selectLastReadMessageId(state, { objectId: props.objectId }),
    lastMessageId: selectLastMessageId(state, { objectId: props.objectId }),
    messagesUser: selectObjectMessagesUser(state, { objectId: props.objectId }),
    currentUserId: selectCurrentUserId(state),
    lastMessageUserId: selectLastMessageUserId(state, { objectId: props.objectId }),
  })

  return connect(mapStateToProps)(EnhanceWithNewMessagesSeparator)
}

export default (Enhance)
