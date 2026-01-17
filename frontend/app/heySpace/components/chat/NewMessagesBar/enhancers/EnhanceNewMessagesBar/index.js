import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  timestampToHour,
  timestampToDateFormat,
} from 'common/utils/dateOperations';

import PureBaseComponent from 'commonEnhancers/PureBaseComponent';

import {
  selectLastReadMessageUserId,
  selectLastReadMessageId,
  selectMessageList,
  selectLastMessageUserId,
  selectLastMessageId,
} from 'models/domain/MessagesModel/selectors';
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors';
import { selectIsPageVisible } from 'models/domain/AppModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { MESSAGE } from 'models/domain/MessagesModel/constants/messageTypes';

const VISIBILITY_TIMEOUT = 5 * 1000;

function Enhance(ComposedComponent) {
  class EnhanceNewMessagesBar extends PureBaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
      color: PropTypes.string,
    };

    static defaultProps = {};

    constructor(props) {
      super(props);

      this.state = {
        isVisible: false,
        messageCount: 0,
      };
    }

    render() {
      return (
        <ComposedComponent
          isVisible={this.state.isVisible}
          messageCount={this.state.messageCount}
          sinceHour={`${timestampToHour(this.state.timestamp)}`}
          sinceDate={`${timestampToDateFormat(this.state.timestamp)}`}
          color={this.props.color}
          onClick={this.onClick}
        />
      );
    }

    onClick() {
      const { lastReadMessageId, visibleChatItems } = this.props;

      const isMessageVisible =
        visibleChatItems
          .map((chatItem) => chatItem.get('id'))
          .indexOf(lastReadMessageId) > -1;
      if (!isMessageVisible) {
        this.props.showChatItemsAroundItem(lastReadMessageId);
      }
      setImmediate(() => this.props.scrollToItem(lastReadMessageId));

      this.hideMessagesBar();
    }

    startVisibilityTimeout() {
      if (this.isVisibleTimeout) {
        clearTimeout(this.isVisibleTimeout);
      }

      this.isVisibleTimeout = setTimeout(() => {
        this.hideMessagesBar();
      }, VISIBILITY_TIMEOUT);
    }

    getChatItemsIds(chatItems = this.props.chatItems) {
      return chatItems.map((row) => row.get('id'));
    }

    getChatItemId(chatItem) {
      return chatItem ? chatItem.get('id') : null;
    }

    updateMessageCount() {
      const messagesIds = this.getChatItemsIds(
        this.props.chatItems.filter(
          (chatItem) => chatItem.get('type') === MESSAGE
        )
      );
      const lastReadIndex = messagesIds.indexOf(this.props.lastReadMessageId);
      const lastReadChatItem = this.props.chatItems.find(
        (chatItem) => chatItem.get('id') === this.props.lastReadMessageId
      );
      const lastReadChatItemTimestamp = lastReadChatItem
        ? lastReadChatItem.get('timestamp')
        : null;
      this.setState({
        messageCount: messagesIds.size - lastReadIndex - 1,
        timestamp: lastReadChatItemTimestamp,
      });
    }

    showMessagesBar() {
      this.alreadyShownBarWithThoseChatItems = true;
      this.startVisibilityTimeout();
      this.setState({
        isVisible: true,
      });
    }

    hideMessagesBar() {
      if (this.isVisibleTimeout) {
        clearTimeout(this.isVisibleTimeout);
      }
      this.setState({
        isVisible: false,
      });
    }

    componentWillUnmount() {
      if (this.isVisibleTimeout) {
        clearTimeout(this.isVisibleTimeout);
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.chatItems !== this.props.chatItems) {
        this.alreadyShownBarWithThoseChatItems = false;
      }

      if (
        this.props.isPageVisible &&
        this.props.lastReadMessageId &&
        this.props.lastMessageId !== this.props.lastReadMessageId &&
        (!this.props.isScrolledToBottom ||
          prevProps.objectId !== this.props.objectId ||
          !prevProps.isPageVisible) &&
        !this.alreadyShownBarWithThoseChatItems &&
        this.props.currentUserId !== this.props.lastReadMessageUserId
      ) {
        if (!prevState.isVisible) {
          this.showMessagesBar();
        } else {
          this.startVisibilityTimeout();
        }
      } else if (prevProps.objectId !== this.props.objectId) {
        this.hideMessagesBar();
      }

      if (
        prevProps.chatItems.size !== this.props.chatItems.size ||
        (!prevProps.lastReadMessageId && this.props.lastReadMessageId) ||
        (prevProps.lastReadMessageId !== this.props.lastReadMessageId &&
          this.props.lastReadMessageId !== this.props.lastMessageId)
      ) {
        this.updateMessageCount();
      }
    }

    componentDidMount() {
      if (this.props.chatItems.size > 0 && this.props.lastReadMessageId) {
        this.updateMessageCount();

        if (
          this.getChatItemId(this.props.chatItems.last()) !==
            this.props.lastReadMessageId &&
          this.props.currentUserId !== this.props.lastMessageUserId
        ) {
          this.showMessagesBar();
        }
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      chatItems: selectMessageList(state, { objectId: props.objectId }),
      color: selectProjectColor(state, { projectId: props.objectId }),
      isPageVisible: selectIsPageVisible(state),
      lastReadMessageId: selectLastReadMessageId(state, {
        objectId: props.objectId,
      }),
      lastMessageUserId: selectLastMessageUserId(state, {
        objectId: props.objectId,
      }),
      lastMessageId: selectLastMessageId(state, { objectId: props.objectId }),
      currentUserId: selectCurrentUserId(state),
      lastReadMessageUserId: selectLastReadMessageUserId(state, {
        objectId: props.objectId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceNewMessagesBar);
}

export default Enhance;
