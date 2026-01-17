import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles'

import Message from '../Message'
import NewMessagesSeparator from '../NewMessagesSeparator'
import { NEW_MESSAGES_SEPARATOR, MESSAGE, DATE_SEPARATOR } from 'models/domain/MessagesModel/constants/messageTypes'
import { doNothing } from 'common/utils'
import DateSeparator from '../DateSeparator'
import EmptyMessagesListPlaceholder from '../EmptyMessagesListPlaceholder'
import ChatSkeletonLoader from '../../skeletons/ChatSkeletonLoader'

MessageList.propTypes = {
  chatItems: ImmutablePropTypes.list.isRequired,
  objectId: PropTypes.string.isRequired,
  onEndReached: PropTypes.func,
}

MessageList.defaultProps = {
  onEndReached: doNothing,
}

const scrollEventThrottle = 400

export default function MessageList(props) {
  return (
    <View
      style={{ ...styles.container, ...props.style }}
      onLayout={props.onListWrapperLayout}
    >
      {/* TODO: !!! when activities will get their renderers remove filter !!!*/}
      {props.chatItems.filter(item => item.get('type') === MESSAGE).size === 0
        ? <EmptyMessagesListPlaceholder objectId={props.objectId} />
        : renderVirtualizedList()
      }
      {
        props.isFirstRequestLoading && renderSkeleton()
      }
    </View>
  )

  function renderVirtualizedList() {
    return (
      <ScrollView
        ref={props.onSetVirtualizedListRef}
        contentContainerStyle={styles.virtualizedList}
        onContentSizeChange={props.onResize}
        onScroll={props.onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {
          props.hasMoreToFetch || props.hasMoreOlderChatItemsToLoad()
            ? null
            : renderBeginningOfConversationTitle()
        }
        {
          props.isFetchingMoreChatItems ?
            renderLoadingMoreTitle()
            : null
        }
        {
          props.chatItems.map(renderItem)
        }
      </ScrollView>
    )
  }

  function renderItem(row) {
    const id = row.get('id')
    const type = row.get('type')
    const timestamp = row.get('timestamp')

    switch (type) {
      case DATE_SEPARATOR:
        return (
          <DateSeparator
            key={`MessageList_item_${id}`}
            timestamp={timestamp}
          />
        )

      case MESSAGE:
        return <Message
          key={`MessageList_item_${id}`}
          id={id}
          onMessageLongPress={props.onMessageLongPress}
          onSetRef={props.onSetChatItemRef}
        />

      case NEW_MESSAGES_SEPARATOR:
        return <NewMessagesSeparator key={`MessageList_item_${id}`} />

      default:
        return null
    }
  }

}

function renderSkeleton() {
  return (
    <View style={styles.skeletonWrapper}>
      <ChatSkeletonLoader />
    </View>
  )
}

function renderLoadingMoreTitle() {
  return (
    <Text style={styles.loadingMoreTitle}>
      {'Loading more...'}
    </Text>
  )
}

function renderBeginningOfConversationTitle() {
  return (
    <Text style={styles.beginningOfConversationTitle}>
      {'This is the beginning of conversation'}
    </Text>
  )
}