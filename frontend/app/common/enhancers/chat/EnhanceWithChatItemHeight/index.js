import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { List } from 'immutable'

import BaseComponent from '../../BaseComponent'

import { selectMessagesIsContinuation } from '../../../models/domain/MessagesModel/selectors/domain'
import { selectObjectMessagesFiles, selectObjectMessagesReactionIds, selectObjectMessagesText } from '../../../models/domain/MessagesModel/selectors'
import { isImage, getThumbnailDimensions } from '../../../models/domain/FilesModel/helpers'
import { DATE_SEPARATOR, ACTIVITY } from '../../../models/domain/MessagesModel/constants/messageTypes'

const emptyList = new List()

function Enhance(ComposedComponent) {
  class EnhanceWithChatItemHeight extends BaseComponent {

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      elementsHeight: PropTypes.shape({
        emptyContinuationMessageMinHeight: PropTypes.number.isRequired,
        emptyFreshMessageMinHeight: PropTypes.number.isRequired,
        messageFileHeight: PropTypes.number.isRequired,
        textLineHeight: PropTypes.number.isRequired,
        reactionsHeight: PropTypes.number.isRequired,
        dateSeparatorHeight: PropTypes.number.isRequired,
        messageThumbnailMaxSize: PropTypes.number.isRequired,
        minActivityHeight: PropTypes.number,
        maxTextHeight: PropTypes.number,
      }).isRequired,
    }

    static defaultProps = {

    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          getChatItemHeight={this.getChatItemHeight}
        />
      )
    }

    getChatItemHeight(chatItem) {
      const chatItemType = chatItem.get('type')

      switch (chatItemType) {
        case DATE_SEPARATOR:
          return this.props.elementsHeight.dateSeparatorHeight

        case ACTIVITY:
          return this.props.elementsHeight.minActivityHeight

        default:
          return this.getMessageHeight(chatItem.get('id'))
      }
    }

    getMessageHeight(messageId) {
      let messageHeight = this.getEmptyMessageHeight(messageId)

      messageHeight += this.getMessageAttachmentsHeight(messageId)

      messageHeight += this.getMessageTextHeight(messageId)

      messageHeight += this.getMessageReactionsHeight(messageId)

      return messageHeight
    }

    getEmptyMessageHeight(messageId) {
      if (this.props.messagesIsContinuation.get(messageId)) {
        return this.props.elementsHeight.emptyContinuationMessageMinHeight
      }

      return this.props.elementsHeight.emptyFreshMessageMinHeight
    }

    getMessageReactionsHeight(messageId) {
      const messageReactionIds = this.props.messagesReactionIds.get(messageId) || emptyList

      return messageReactionIds.size > 0 ? this.props.elementsHeight.reactionsHeight : 0
    }

    getMessageTextHeight(messageId) {
      const text = this.props.messagesText.get(messageId)
      // fix of old quill messages
      if (!text || typeof text !== 'string') {
        return 0
      }

      const numberOfTextLines = text.trim().split('\n').filter(Boolean).length

      let textHeight = numberOfTextLines * this.props.elementsHeight.textLineHeight
      const { maxTextHeight } = this.props.elementsHeight
      if (maxTextHeight) {
        textHeight = Math.min(textHeight, maxTextHeight)
      }

      return textHeight
    }

    getMessageAttachmentsHeight(messageId) {
      const files = this.props.messagesFiles.get(messageId) || emptyList

      if (files.size === 0) {
        return 0
      }

      const file = files.first()
      const isFileImage = isImage(file.contentType)
      const { messageThumbnailMaxSize } = this.props.elementsHeight

      if (isFileImage) {
        const dimensions = getThumbnailDimensions(file.width, file.height, messageThumbnailMaxSize)
        return dimensions.height
      } else {
        return this.props.elementsHeight.messageFileHeight
      }
    }

  }

  const mapStateToProps = (state, props) => ({
    messagesIsContinuation: selectMessagesIsContinuation(state, { objectId: props.objectId }),
    messagesFiles: selectObjectMessagesFiles(state, { objectId: props.objectId }),
    messagesReactionIds: selectObjectMessagesReactionIds(state, { objectId: props.objectId }),
    messagesText: selectObjectMessagesText(state, { objectId: props.objectId }),
  })

  return connect(mapStateToProps)(EnhanceWithChatItemHeight)
}

export default (Enhance)
