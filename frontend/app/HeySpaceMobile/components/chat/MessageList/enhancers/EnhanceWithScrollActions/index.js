import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, Map } from 'immutable'
import isNil from 'lodash/isNil'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import BaseComponent from 'BaseComponent'
import { doNothing } from 'common/utils'

const scrollThreshold = 10
const minChatItemHeight = 50
const emptyMap = new Map()

function Enhance(ComposedComponent) {
  class EnhanceWithScrollActions extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      chatItems: ImmutablePropTypes.list.isRequired,

      onSetVirtualizedListRef: PropTypes.func,
      onSetChatItemRef: PropTypes.func,
      onListWrapperLayout: PropTypes.func,
      onResize: PropTypes.func,
      onScroll: PropTypes.func,
    }

    static defaultProps = {
      chatItems: new List(),

      onSetChatItemRef: doNothing,
      onSetVirtualizedListRef: doNothing,
      onListWrapperLayout: doNothing,
      onResize: doNothing,
      onScroll: doNothing,
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onScroll={this.onScroll}
          onSetVirtualizedListRef={this.onSetVirtualizedListRef}
          onListWrapperLayout={this.onListWrapperLayout}
          onResize={this.onResize}
          scrollToBottom={this.scrollToBottom}
          getScrollOffsetFromBottom={this.getScrollOffsetFromBottom}
          isScrolledToBottom={this.isScrolledToBottom}
          setScrollOffsetFromBottom={this.setScrollOffsetFromBottom}
          setScrollOffsetFromTop={this.setScrollOffsetFromTop}
          getScrollOffsetFromTop={this.getScrollOffsetFromTop}
          getTopVisibleItemIdAndOffset={this.getTopVisibleItemIdAndOffset}
          scrollToItem={this.scrollToItem}
          onSetChatItemRef={this.onSetChatItemRef}
          getNumberOfMessagesFittingOnPage={this.getNumberOfMessagesFittingOnPage}
          isScrolledToTop={this.isScrolledToTop}
          scrollThreshold={scrollThreshold}
          getListHeight={this.getListHeight}
          getChatItemHeight={this.getChatItemHeight}
        />
      )
    }

    chatItemRefs = emptyMap

    listRef = null

    listWrapperHeight = 0

    listContentHeight = 0

    scrollPosition = 0

    listPageY = 0

    getChatItemHeight() {
      // TODO: use EnhanceWithChatItemHeight and optimize mobile chat
      return minChatItemHeight
    }

    getListHeight() {
      // TODO: calculate actual height of chat
      return hp('100%')
    }

    getNumberOfMessagesFittingOnPage() {
      const listHeight = this.getListHeight()
      return listHeight / minChatItemHeight + 1
    }

    onListWrapperLayout(event) { // onLayout is invoked on mount and resize of react native element
      this.listWrapperHeight = event.nativeEvent.layout.height

      this.props.onListWrapperLayout(event)
    }

    onResize(contentWidth, contentHeight) {
      this.listContentHeight = contentHeight

      this.props.onResize(contentWidth, contentHeight)
    }

    onSetChatItemRef(ref, id) {
      if (id) {
        this.chatItemRefs = this.chatItemRefs.set(id, ref)
        this.props.onSetChatItemRef(ref, id)
      }
    }

    onSetVirtualizedListRef(ref) {
      this.listRef = ref
      this.props.onSetVirtualizedListRef(ref)
      this.setVirtualizedListRefTimeout = setTimeout(() => {
        if (this.listRef && this.listRef._scrollViewRef) {
          this.listRef._scrollViewRef.measure((listX, listY, listWidth, listHeight, listPageX, listPageY) => {
            this.listPageY = listPageY
          })
        }
      })
    }

    async getTopVisibleItemIdAndOffset(chatItems, objectId) {
      return new Promise(async (resolve, reject) => {
        if (!this.listRef) {
          return resolve({ objectId, idAndOffset: null })
        }

        const promises = chatItems.map(chatItem => this.getItemOffsetFromTop(chatItem.get('id'))).toArray()
        const idsAndOffsets = await Promise.all(promises)
        let topIdAndOffset = idsAndOffsets
          .filter(idAndOffset => idAndOffset.offset !== null)

        // prevent TypeError: reduce of empty array with no initial value
        // when .filter() returns an empty array
        if (topIdAndOffset.length) {
          topIdAndOffset = topIdAndOffset
            .reduce((top, offsetAndId) => ((offsetAndId.offset > top.offset) ? offsetAndId : top))
        }

        return resolve({ objectId, idAndOffset: topIdAndOffset })
      })
    }

    getItemOffsetFromTop(chatItemId) {
      return new Promise((resolve, reject) => {
        const ref = this.chatItemRefs.get(chatItemId)
        if (!ref) {
          return resolve({ id: chatItemId, offset: null })
        }

        ref.measure((itemX, itemy, itemWidth, itemHeight, itemPageX, itemPageY) => {
          if (isNil(this.listPageY) || isNil(itemPageY)) {
            return resolve({ id: chatItemId, offset: null })
          }
          if ((itemPageY + itemHeight) - this.listPageY <= 0) {
            return resolve({ id: chatItemId, offset: null })
          }
          return resolve({ id: chatItemId, offset: this.listPageY - itemPageY })
        })
      })
    }

    scrollToItem(id, offset = 0) {
      const itemRef = this.chatItemRefs.get(id)

      this.scrollToItemTimeout = setTimeout(() => {
        if (itemRef) {
          itemRef.measure((itemX, itemy, itemWidth, itemHeight, itemPageX, itemPageY) => {
            const newScrollPosition = ((this.scrollPosition + itemPageY) - this.listPageY) + offset
            this.scrollTo(newScrollPosition)
          })
        }
      })
    }

    scrollToBottom() {
      this.scrollToBottomTimeout = setTimeout(() => {
        if (this.listRef) {
          this.listRef.scrollToEnd({ animated: false })
        }
      })
    }

    getScrollOffsetFromBottom() {
      if (this.listRef) {
        return this.listContentHeight - this.scrollPosition - this.listWrapperHeight
      }

      return null
    }

    getScrollOffsetFromTop() {
      if (this.listRef) {
        return this.scrollPosition
      }

      return null
    }

    isScrolledToTop(scrollPosition = this.scrollPosition) {
      return scrollPosition - scrollThreshold <= 0
    }

    isScrolledToBottom(event) {
      const scrollPosition = event ? event.nativeEvent.contentOffset.y : this.scrollPosition
      if (this.listContentHeight === 0 || this.listContentHeight === this.listWrapperHeight) {
        return false
      }

      return this.listContentHeight - scrollPosition - this.listWrapperHeight - scrollThreshold <= 0
    }

    onScroll(event) {
      this.scrollPosition = event.nativeEvent.contentOffset.y

      this.props.onScroll(event)
    }

    setScrollOffsetFromBottom(offsetFromBottom) {
      this.scrollFromBottomTimeout = setTimeout(() => {
        if (this.listRef && this.listRef._innerViewRef) {
          this.listRef._innerViewRef.measure((listContentX, listContentY, listContentWidth, listContentHeight) => {
            this.scrollTo(listContentHeight - this.listWrapperHeight - offsetFromBottom)
          })
        }
      })
    }

    setScrollOffsetFromTop(offsetFromTop) {
      this.scrollTo(offsetFromTop)
    }

    scrollTo(y) {
      if (this.listRef && typeof y === 'number') {
        this.listRef.scrollTo({ y, animated: false })
      }
    }

    componentWillUnmount() {
      if (this.setVirtualizedListRefTimeout) {
        clearTimeout(this.setVirtualizedListRefTimeout)
      }
      if (this.scrollToItemTimeout) {
        clearTimeout(this.scrollToItemTimeout)
      }
      if (this.scrollToBottomTimeout) {
        clearTimeout(this.scrollToBottomTimeout)
      }
      if (this.scrollFromBottomTimeout) {
        clearTimeout(this.scrollFromBottomTimeout)
      }
    }

    getSnapshotBeforeUpdate(prevProps) {
      if (prevProps.objectId !== this.props.objectId) {
        this.chatItemRefs = emptyMap
      }
      return null
    }

  }

  return (EnhanceWithScrollActions)
}

export default (Enhance)
