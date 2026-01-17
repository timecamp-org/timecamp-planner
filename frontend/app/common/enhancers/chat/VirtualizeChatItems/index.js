import { is as immutableIs, List, Map } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { MESSAGE } from '../../../models/domain/MessagesModel/constants/messageTypes';
import { selectLastReadMessageId } from '../../../models/domain/MessagesModel/selectors';
import {
  selectObjectMessagesUser,
  selectObjectTopVisibleItem,
} from '../../../models/domain/MessagesModel/selectors/domain';
import { selectCurrentUserId } from '../../../models/domain/UsersModel/selectors/domain';
import { doNothing } from '../../../utils';
import BaseComponent from '../../BaseComponent';

import rerenderTypes from './rerenderTypes';

const emptyList = new List();

function Enhance(ComposedComponent) {
  class VirtualizeChatItems extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      currentUserId: PropTypes.string.isRequired,
      chatItems: ImmutablePropTypes.list,
      messagesUser: ImmutablePropTypes.map,
      scrollThreshold: PropTypes.number.isRequired,

      onScrolledTop: PropTypes.func,
      onScrolledBottom: PropTypes.func,
    };

    static defaultProps = {
      chatItems: emptyList,
      messagesUser: new Map(),

      onScrolledTop: doNothing,
      onScrolledBottom: doNothing,
      getListHeight: doNothing,
    };

    constructor(props) {
      super(props);
      this.state = {
        objectId: props.objectId,
        chatItems: emptyList,
        rerenderType: null,
      };
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          chatItems={this.state.chatItems}
          objectId={this.state.objectId}
          hasMoreOlderChatItemsToLoad={this.hasMoreOlderChatItemsToLoad}
          onScrolledTop={this.onScrolledTop}
          isLastMessage={this.isLastMessage}
          onScrolledBottom={this.onScrolledBottom}
          hasMoreNewerChatItemsToLoad={this.hasMoreNewerChatItemsToLoad}
          showChatItemsAroundItem={this.showChatItemsAroundItem}
          rerenderType={this.state.rerenderType}
        />
      );
    }

    onScrolledBottom() {
      if (this.hasMoreNewerChatItemsToLoad()) {
        const oldEndIndex = this.getEndIndex();
        const endIndex =
          oldEndIndex + this.props.getNumberOfMessagesFittingOnPage() > this.props.chatItems.size
            ? this.props.chatItems.size
            : oldEndIndex + this.props.getNumberOfMessagesFittingOnPage();

        this.setState({
          chatItems: VirtualizeChatItems.getChatItemsByIndexes(this.getStartIndex(), endIndex, this.props),
          rerenderType: rerenderTypes.LOADED_NEWER_MESSAGES,
        });
      }

      this.props.onScrolledBottom();
    }

    isLastMessage(chatItemId) {
      return VirtualizeChatItems.isLastMessage(chatItemId, this.props);
    }

    showInitialChatItems() {
      return this.setState({
        objectId: this.props.objectId,
        chatItems: VirtualizeChatItems.getInitialChatItems(this.props),
        rerenderType: rerenderTypes.INITIALLY_LOADED_MESSAGE,
      });
    }

    static getInitialChatItems(props) {
      if (
        props.lastReadMessageId &&
        !VirtualizeChatItems.isLastMessage(props.lastReadMessageId, props) &&
        VirtualizeChatItems.getChatItemIndex(props.lastReadMessageId, props.chatItems) > -1
      ) {
        return VirtualizeChatItems.getChatItemsAroundItem(props.lastReadMessageId, props);
      } else if (
        props.savedObjectTopVisibleItem &&
        VirtualizeChatItems.getChatItemIndex(props.savedObjectTopVisibleItem.id, props.chatItems) > -1
      ) {
        const { id, offset } = props.savedObjectTopVisibleItem;

        return VirtualizeChatItems.getChatItemsAroundItem(id, props, offset);
      } else {
        const lastChatItem = props.chatItems.last();
        const lastChatItemId = VirtualizeChatItems.getChatItemId(lastChatItem);

        return VirtualizeChatItems.getChatItemsAroundItem(lastChatItemId, props);
      }
    }

    static getChatItemIndex(id, chatItems) {
      return chatItems.map((item) => item.get('id')).indexOf(id);
    }

    static getChatItemsAroundItem(chatItemId, props, chatItemTopOffset = 0) {
      if (!chatItemId) {
        return emptyList;
      }

      const minTopItemsHeight = props.scrollThreshold - chatItemTopOffset;
      const minBottomItemsHeight = props.getListHeight() + chatItemTopOffset + props.scrollThreshold;
      const chatItemIndex = VirtualizeChatItems.getChatItemIndex(chatItemId, props.chatItems);

      const { numberOfChatItemsOverIndex, chatItemsOverIndexHeight } =
        VirtualizeChatItems.getChatItemsOverIndexWithHeight(chatItemIndex, minTopItemsHeight, props);
      let startIndex = chatItemIndex - numberOfChatItemsOverIndex;

      const { numberOfChatItemsBelowIndex, chatItemsBelowIndexHeight } =
        VirtualizeChatItems.getChatItemsBelowIndexWithHeight(chatItemIndex - 1, minBottomItemsHeight, props);
      let endIndex = chatItemIndex - 1 + numberOfChatItemsBelowIndex;

      const lackingTopHeight = minTopItemsHeight - chatItemsOverIndexHeight;
      const lackingBottomHeight = minBottomItemsHeight - chatItemsBelowIndexHeight;

      if (lackingTopHeight > 0) {
        // take more from the bottom if not enough top items
        const { numberOfChatItemsBelowIndex: additionalNumberOfBottomItems } =
          VirtualizeChatItems.getChatItemsBelowIndexWithHeight(endIndex, lackingTopHeight, props);
        endIndex += additionalNumberOfBottomItems;
      }

      if (lackingBottomHeight > 0) {
        // take more from the top if not enough bottom items
        const { numberOfChatItemsOverIndex: additionalNumberOfTopItems } =
          VirtualizeChatItems.getChatItemsOverIndexWithHeight(startIndex, lackingBottomHeight, props);
        startIndex -= additionalNumberOfTopItems;
      }

      return VirtualizeChatItems.getChatItemsByIndexes(startIndex, endIndex, props);
    }

    static getChatItemsOverIndexWithHeight(startingIndex, height, props) {
      let chatItemsOverIndexHeight = 0;
      let numberOfChatItemsOverIndex = 0;

      for (let i = startingIndex - 1; i >= 0 && chatItemsOverIndexHeight <= height; i--) {
        const chatItem = props.chatItems.get(i);
        chatItemsOverIndexHeight += props.getChatItemHeight(chatItem);
        numberOfChatItemsOverIndex++;
      }

      return {
        numberOfChatItemsOverIndex,
        chatItemsOverIndexHeight,
      };
    }

    static getChatItemsBelowIndexWithHeight(startingIndex, height, props) {
      let chatItemsBelowIndexHeight = 0;
      let numberOfChatItemsBelowIndex = 0;

      for (let i = startingIndex + 1; i < props.chatItems.size && chatItemsBelowIndexHeight <= height; i++) {
        const chatItem = props.chatItems.get(i);
        chatItemsBelowIndexHeight += props.getChatItemHeight(chatItem);
        numberOfChatItemsBelowIndex++;
      }

      return {
        numberOfChatItemsBelowIndex,
        chatItemsBelowIndexHeight,
      };
    }

    static isLastMessage(chatItemId, props) {
      const lastMessage = props.chatItems.filter((chatItem) => chatItem.get('type') === MESSAGE).last();

      const lastMessageId = VirtualizeChatItems.getChatItemId(lastMessage);

      return chatItemId && lastMessageId && lastMessageId === chatItemId;
    }

    showChatItemsAroundItem(chatItemId, rerenderType = rerenderTypes.OTHER) {
      return this.setState({
        objectId: this.props.objectId,
        chatItems: VirtualizeChatItems.getChatItemsAroundItem(chatItemId, this.props),
        rerenderType,
      });
    }

    onScrolledTop() {
      if (this.hasMoreOlderChatItemsToLoad()) {
        const oldStartIndex = this.getStartIndex();
        const startIndex = Math.max(oldStartIndex - this.props.getNumberOfMessagesFittingOnPage(), 0);

        this.setState({
          chatItems: VirtualizeChatItems.getChatItemsByIndexes(startIndex, this.getEndIndex(), this.props),
          rerenderType: rerenderTypes.OTHER,
        });
      } else {
        this.props.onFetchMoreItems();
      }

      this.props.onScrolledTop();
    }

    hasMoreOlderChatItemsToLoad() {
      return this.getStartIndex() > 0;
    }

    hasMoreNewerChatItemsToLoad(moreThan = 0) {
      return this.getEndIndex() + 1 + moreThan < this.props.chatItems.size;
    }

    getStartIndex(chatItems = this.props.chatItems) {
      const firstChatItem = this.state.chatItems.first();
      const firstChatItemId = VirtualizeChatItems.getChatItemId(firstChatItem);

      return VirtualizeChatItems.getChatItemIndex(firstChatItemId, chatItems);
    }

    getEndIndex(chatItems = this.props.chatItems) {
      const lastChatItem = this.state.chatItems.last();
      const lastChatItemId = VirtualizeChatItems.getChatItemId(lastChatItem);

      return VirtualizeChatItems.getChatItemIndex(lastChatItemId, chatItems);
    }

    static getChatItemId(chatItem) {
      return chatItem ? chatItem.get('id') : null;
    }

    static getChatItemsByIndexes(startIndex, endIndex, props) {
      // This is a dirty fix
      // Chat in CardDetailsModal loads ony a few messages (eg. 2 out of 40)
      // It returns all
      if (props.itemsType) {
        return props.chatItems;
      }

      return props.chatItems.slice(startIndex, endIndex + 1);
    }

    onCurrentUserSentMessage(oldChatItems) {
      const currentChatItems = this.props.chatItems;
      const chatItemsSizeDifference = currentChatItems.size - oldChatItems.size;
      if (!this.hasMoreNewerChatItemsToLoad(chatItemsSizeDifference)) {
        this.onChatItemsChanged(oldChatItems, rerenderTypes.CURRENT_USER_SENT_MESSAGE);
      } else {
        const lastChatItem = this.props.chatItems.last();
        if (lastChatItem) {
          this.showChatItemsAroundItem(lastChatItem.get('id'), rerenderTypes.CURRENT_USER_SENT_MESSAGE);
        }
      }
    }

    onChatItemsChanged(oldChatItems, rerenderType = rerenderTypes.OTHER) {
      const currentChatItems = this.props.chatItems;
      const chatItemsSizeDifference = currentChatItems.size - oldChatItems.size;
      const prevStartIndex = this.getStartIndex(oldChatItems);
      const prevEndIndex = this.getEndIndex(oldChatItems);
      this.setState({
        chatItems: VirtualizeChatItems.getChatItemsByIndexes(
          prevStartIndex,
          prevEndIndex + chatItemsSizeDifference,
          this.props
        ),
        rerenderType,
      });
    }

    isCurrentUserSentMessage(prevProps, currentProps) {
      const previousLastChatItemId = VirtualizeChatItems.getChatItemId(prevProps.chatItems.last());
      const nextLastChatItemId = VirtualizeChatItems.getChatItemId(currentProps.chatItems.last());

      return (
        previousLastChatItemId !== nextLastChatItemId &&
        this.props.messagesUser.get(nextLastChatItemId) === this.props.currentUserId &&
        currentProps.isFirstRequestSuccess &&
        prevProps.chatItems.size < currentProps.chatItems.size
      );
    }

    isChatItemsChanged(prevProps, currentProps) {
      return !immutableIs(prevProps.chatItems, currentProps.chatItems);
    }

    static getDerivedStateFromProps(props, state) {
      let newState = null;
      if (state.prevObjectId !== props.objectId) {
        newState = newState || {};
        newState.prevObjectId = props.objectId;
      }

      if (state.prevIsFirstRequestFinished !== props.isFirstRequestFinished) {
        newState = newState || {};
        newState.prevIsFirstRequestFinished = props.isFirstRequestFinished;
      }

      if (
        state.prevObjectId &&
        props.isFirstRequestFinished &&
        (state.prevObjectId !== props.objectId || !state.prevIsFirstRequestFinished)
      ) {
        newState = newState || {};
        newState.chatItems = VirtualizeChatItems.getInitialChatItems(props);
        newState.objectId = props.objectId;
        newState.rerenderType = rerenderTypes.INITIALLY_LOADED_MESSAGE;
      }

      return newState;
    }

    componentDidUpdate(prevProps) {
      if (
        (!prevProps.isFirstRequestFinished && this.props.isFirstRequestFinished) ||
        prevProps.objectId !== this.props.objectId
      ) {
        return;
      }

      if (this.isCurrentUserSentMessage(prevProps, this.props)) {
        this.onCurrentUserSentMessage(prevProps.chatItems);
      }

      if (this.isChatItemsChanged(prevProps, this.props) && this.props.isFirstRequestFinished) {
        this.onChatItemsChanged(prevProps.chatItems);
      }
    }

    componentDidMount() {
      if (this.props.isFirstRequestSuccess) {
        this.showInitialChatItems();
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      messagesUser: selectObjectMessagesUser(state, { objectId: props.objectId }),
      lastReadMessageId: selectLastReadMessageId(state, { objectId: props.objectId }),
      savedObjectTopVisibleItem: selectObjectTopVisibleItem(state, { objectId: props.objectId }),
      currentUserId: selectCurrentUserId(state),
    };
  }

  return connect(mapStateToProps)(VirtualizeChatItems);
}

export default Enhance;
