import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'

import BaseComponent from '../../BaseComponent'
import { doNothing } from '../../../utils'
import rerenderTypes from '../VirtualizeChatItems/rerenderTypes'

function Enhance(ComposedComponent) {
  class KeepCorrectScrollPosition extends BaseComponent {

    static propTypes = {
      chatItems: ImmutablePropTypes.list,

      isScrolledToBottom: PropTypes.func,
      getScrollOffsetFromBottom: PropTypes.func,
      setScrollOffsetFromBottom: PropTypes.func,
      onSetInitialScrollPosition: PropTypes.func,
      hasMoreNewerChatItemsToLoad: PropTypes.func,
      onScroll: PropTypes.func,
      onScrolledBottom: PropTypes.func,
      onResize: PropTypes.func,
    }

    static defaultProps = {
      chatItems: new List(),

      isScrolledToBottom: doNothing,
      getScrollOffsetFromBottom: doNothing,
      setScrollOffsetFromBottom: doNothing,
      onSetInitialScrollPosition: doNothing,
      hasMoreNewerChatItemsToLoad: doNothing,
      onScroll: doNothing,
      onScrolledBottom: doNothing,
      onResize: doNothing,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onResize={this.onResize}
          onSetInitialScrollPosition={this.onSetInitialScrollPosition}
          onScroll={this.onScroll}
          onScrolledBottom={this.onScrolledBottom}
        />
      )
    }

    scrollOffsetFromBottom = 0
    wasScrolledToBottom = false
    alreadyResizedAfterLoadingNewMessages = true

    onScrolledBottom() {
      this.wasScrolledToBottom = true
      this.props.onScrolledBottom()
    }

    onScroll(event) {
      this.updateScrollVariables(event)
      this.props.onScroll(event)
      if (this.props.isScrolledToTop()) {
        this.scrollOffsetFromBottom = this.props.getScrollOffsetFromBottom()
      }
    }

    onSetInitialScrollPosition() {
      this.updateScrollVariables()
      this.props.onSetInitialScrollPosition()
    }

    onResize(contentWidth, contentHeight) {
      if (this.wasScrolledToBottom && this.alreadyResizedAfterLoadingNewMessages) {
        this.props.setScrollOffsetFromBottom(0)
      }

      this.updateScrollVariables()
      this.alreadyResizedAfterLoadingNewMessages = true

      this.props.onResize(contentWidth, contentHeight)
    }

    updateScrollVariables(event) {
      const scrollVariables = this.getScrollVariables(event)
      this.wasScrolledToBottom = scrollVariables.wasScrolledToBottom
    }

    getScrollVariables(event) {
      return {
        wasScrolledToBottom: this.props.isScrolledToBottom(event),
      }
    }

    haveChatItemChanged(chatItemA, chatItemB) {
      return chatItemA && chatItemB
        && chatItemA.get('id') !== chatItemB.get('id')
    }

    isChatContainerSame(prevProps, currentProps) {
      return prevProps.objectId === currentProps.objectId
    }

    haveOlderChatItemsLoaded(prevProps, currentProps) {
      const oldestChatItemBeforeUpdate = prevProps.chatItems.first()
      const oldestChatItemAfterUpdate = currentProps.chatItems.first()

      return this.isChatContainerSame(prevProps, currentProps)
        && this.haveChatItemChanged(oldestChatItemBeforeUpdate, oldestChatItemAfterUpdate)
        && oldestChatItemBeforeUpdate.get('timestamp') > oldestChatItemAfterUpdate.get('timestamp')
    }

    haveLastMessageChanged(prevProps, currentProps) {
      const lastChatItemBeforeUpdate = prevProps.chatItems.last()
      const lastChatItemAfterUpdate = currentProps.chatItems.last()

      return this.isChatContainerSame(prevProps, currentProps)
        && this.haveChatItemChanged(lastChatItemBeforeUpdate, lastChatItemAfterUpdate)
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
      if (prevProps.chatItems.size > 0 && prevProps.chatItems.size !== this.props.chatItems.size) {
        return this.getScrollVariables()
      }

      return null
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevProps.chatItems.size !== this.props.chatItems.size && prevProps.objectId === this.props.objectId && snapshot) {
        this.wasScrolledToBottom = snapshot.wasScrolledToBottom
      }

      const loadedNewerMessages = this.props.rerenderType === rerenderTypes.LOADED_NEWER_MESSAGES

      if (this.haveOlderChatItemsLoaded(prevProps, this.props)) {
        this.props.setScrollOffsetFromBottom(this.scrollOffsetFromBottom)
      }

      if (this.wasScrolledToBottom && !loadedNewerMessages) {
        this.props.scrollToBottom()
      }

      if (this.haveLastMessageChanged(prevProps, this.props) && this.props.rerenderType === rerenderTypes.CURRENT_USER_SENT_MESSAGE) {
        this.props.scrollToBottom()
      }

      if (this.haveLastMessageChanged(prevProps, this.props) && loadedNewerMessages) {
        this.alreadyResizedAfterLoadingNewMessages = false
      }
    }

  }

  return (KeepCorrectScrollPosition)
}

export default (Enhance)
