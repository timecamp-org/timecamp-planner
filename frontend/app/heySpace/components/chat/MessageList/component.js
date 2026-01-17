import React, { Fragment } from 'react';

import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ReactResizeDetector from 'react-resize-detector';

import { doNothing } from 'common/utils';
import { Exclamation } from 'commonComponents/Icons';
import ChatSkeletonLoader from 'commonComponents/skeletons/ChatSkeletonLoader';
import { ActivityInChat } from 'components/chat/ActivityInChat';
import ConversationBeginning from 'components/chat/ConversationBeginning';
import EmptyMessagesListPlaceholder from 'components/chat/EmptyMessagesListPlaceholder';
import Message from 'components/chat/Message';
import NewMessagesBar from 'components/chat/NewMessagesBar';
import NewMessagesSeparator from 'components/chat/NewMessagesSeparator';
import DateLine from 'components/date/DateLine';
import { i18n } from 'i18n';
import { EntityType } from 'models/domain/EntityModel/types';
import {
  MESSAGE,
  ACTIVITY,
  DATE_SEPARATOR,
  NEW_MESSAGES_SEPARATOR,
} from 'models/domain/MessagesModel/constants/messageTypes';

import styles from './styles.css';

const emptyList = new List();

MessageList.propTypes = {
  objectId: PropTypes.string.isRequired,

  chatItems: ImmutablePropTypes.list.isRequired,

  shouldRenderNewMessagesBar: PropTypes.bool,
  isFirstRequestLoading: PropTypes.bool,
  isFirstRequestFinished: PropTypes.bool,
  isFetchingMoreChatItems: PropTypes.bool,

  isProjectOwnConversation: PropTypes.bool,
  isProjectConversation: PropTypes.bool,
  conversationName: PropTypes.string,

  onScroll: PropTypes.func.isRequired,
  onSetListRef: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onSetChatItemRef: PropTypes.func.isRequired,
};

MessageList.defaultProps = {
  chatItems: emptyList,

  shouldRenderNewMessagesBar: true,

  isProjectOwnConversation: false,
  isProjectConversation: false,
  isFirstRequestLoading: false,
  isFirstRequestFinished: false,
  isFetchingMoreChatItems: false,

  onScroll: doNothing,
  onSetListRef: doNothing,
  onResize: doNothing,
  isScrolledToBottom: doNothing,
  hasMoreOlderChatItemsToLoad: doNothing,
  onSetChatItemRef: doNothing,
};

function MessageList(props) {
  if (props.isFirstRequestLoading) {
    return renderSkeleton();
  }

  return (
    <Fragment>
      <div
        id={`message-list-${props.objectId}`}
        ref={props.onSetListRef}
        className={props.className ? props.className : styles.Component}
        onScroll={props.onScroll}
        tabIndex={-1}
      >
        {props.isFirstRequestFinished && props.chatItems.size === 0 ? renderEmptyMessagesPlaceholder() : null}

        {props.chatItems.size > 0 ? renderList() : null}
      </div>
    </Fragment>
  );

  function renderList() {
    return (
      <div className={styles.list}>
        {props.isFetchingMoreChatItemsFailure && renderFailedFetchingItems()}

        {!props.isFetchingMoreChatItemsFailure && props.isFetchingMoreChatItems ? renderFetchMoreItemsLoader() : null}

        {!props.isFetchingMoreChatItemsFailure && !props.hasMoreToFetch && !props.hasMoreOlderChatItemsToLoad() ? (
          <ConversationBeginning objectId={props.objectId} />
        ) : null}

        {props.chatItems.map((chatItem) => renderRow(chatItem))}
        {props.shouldRenderNewMessagesBar ? (
          <NewMessagesBar
            objectId={props.objectId}
            visibleChatItems={props.chatItems}
            isScrolledToBottom={props.isScrolledToBottom()}
            showChatItemsAroundItem={props.showChatItemsAroundItem}
            scrollToItem={props.scrollToItem}
          />
        ) : null}
        <ReactResizeDetector handleHeight onResize={props.onResize} />
      </div>
    );
  }

  function renderFetchMoreItemsLoader() {
    return <div className={styles.loadingMore}>{i18n.t('Loading messages...')}</div>;
  }

  function renderFailedFetchingItems() {
    return (
      <div className={styles.failureMessage}>
        <Exclamation className={styles.failureMessageIcon} />
        {i18n.t('Cannot load messages. Please check your internet connection and')}
        <div className={styles.failureMessageAction} onClick={() => window.location.reload()}>
          {i18n.t('refresh page.')}
        </div>
      </div>
    );
  }

  function renderSkeleton() {
    return (
      <div className={styles.loaderWrapper}>
        <ChatSkeletonLoader />
      </div>
    );
  }

  function renderEmptyMessagesPlaceholder() {
    if (props.isProjectOwnConversation) {
      return (
        <EmptyMessagesListPlaceholder
          title={i18n.t('This is only your project')}
          subTitle={i18n.t(
            `Send messages to yourself with links, files, drafts or anything you need. Is it not enough for your needs? Try My tasks and focus only on your tasks.`
          )}
          mascotClassName={styles.ownConversationMascot}
        />
      );
    } else if (props.isProjectConversation) {
      return (
        <EmptyMessagesListPlaceholder
          title={i18n.t('No messages yet')}
          subTitle={i18n.t(`Don’t be shy, send a message to {{conversationName}} and fill this empty project.`, {
            conversationName: props.conversationName,
          })}
        />
      );
    } else {
      return <EmptyMessagesListPlaceholder title={i18n.t('What a quiet team!')} />;
    }
  }

  function renderRow(chatItem) {
    const id = chatItem.get('id');
    const type = chatItem.get('type');

    switch (type) {
      case MESSAGE: {
        return (
          <Message
            innerRef={props.onSetChatItemRef}
            key={`MessagesListRow_${id}`}
            messageId={id}
            objectId={props.objectId}
          />
        );
      }
      case DATE_SEPARATOR: {
        const timestamp = parseInt(id.split('::')[1]);

        return (
          <DateLine
            innerRef={props.onSetChatItemRef}
            timestamp={timestamp}
            id={props.id}
            key={`MessagesListRow_${id}`}
            shouldRenderTopBackground={props.objectType === EntityType.TASK_DATA}
          />
        );
      }
      case ACTIVITY: {
        return (
          <ActivityInChat
            innerRef={props.onSetChatItemRef}
            key={`MessagesListRow_${id}`}
            activityId={id}
            objectId={props.objectId}
          />
        );
      }
      case NEW_MESSAGES_SEPARATOR: {
        return <NewMessagesSeparator objectId={props.objectId} key={id} color={props.color} />;
      }
      default:
        return null;
    }
  }
}

export default MessageList;
