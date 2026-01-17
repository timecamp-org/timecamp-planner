import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { doNothing } from 'common/utils';
import BaseComponent from 'commonEnhancers/BaseComponent';
import messageStyles from 'components/chat/Message/styles.css';

const emptyMap = new Map();

const scrollThreshold = 5;

function Enhance(ComposedComponent) {
  class EnhanceWithScrollActions extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      chatItems: ImmutablePropTypes.list.isRequired,

      onSetListRef: PropTypes.func,
      onSetChatItemRef: PropTypes.func,
    };

    static defaultProps = {
      chatItems: new List(),

      onSetChatItemRef: doNothing,
      onSetListRef: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onSetListRef={this.onSetListRef}
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
          getListHeight={this.getListHeight}
          scrollThreshold={scrollThreshold}
        />
      );
    }

    chatItemRefs = emptyMap;

    listRef = null;

    getNumberOfMessagesFittingOnPage() {
      const messageMinHeightNumber = parseInt(messageStyles.messageMinHeight);
      const listHeight = this.getListHeight();

      return parseInt(listHeight / messageMinHeightNumber) + 20;
    }

    getListHeight() {
      if (this.listRef && this.listRef.clientHeight) {
        return this.listRef.clientHeight;
      }

      return window.innerHeight;
    }

    onSetChatItemRef(ref, id) {
      if (id) {
        this.chatItemRefs = this.chatItemRefs.set(id, ref);
        this.props.onSetChatItemRef(ref, id);
      }
    }

    onSetListRef(ref) {
      this.listRef = ref;
      this.props.onSetListRef(ref);
    }

    getTopVisibleItemIdAndOffset(chatItems, objectId) {
      return new Promise(async (resolve, reject) => {
        if (this.listRef) {
          const { scrollTop } = this.listRef;

          for (let i = 0; i < chatItems.size; i++) {
            const chatItemId = chatItems.get(i).get('id');
            const ref = this.chatItemRefs.get(chatItemId);
            if (ref && scrollTop < ref.offsetTop) {
              const idAndOffset = {
                id: chatItemId,
                offset: scrollTop - ref.offsetTop,
              };

              return resolve({ objectId, idAndOffset });
            }
          }
        }

        return resolve({ objectId, idAndOffset: null });
      });
    }

    scrollToItem(id, offset = 0) {
      const itemRef = this.chatItemRefs.get(id);
      if (itemRef && this.listRef) {
        this.listRef.scrollTop = itemRef.offsetTop + offset;
      }
    }

    scrollToBottom() {
      if (this.listRef) {
        this.listRef.scrollTop = this.listRef.scrollHeight;
      }
    }

    getScrollOffsetFromBottom() {
      if (this.listRef) {
        return this.listRef.scrollHeight - this.listRef.scrollTop;
      }

      return null;
    }

    getScrollOffsetFromTop() {
      if (this.listRef) {
        return this.listRef.scrollTop;
      }

      return null;
    }

    isScrolledToBottom() {
      if (this.listRef) {
        const offset = this.listRef.scrollHeight - this.listRef.scrollTop - this.listRef.clientHeight;

        return offset < scrollThreshold;
      }

      return null;
    }

    isScrolledToTop() {
      if (this.listRef) {
        return this.listRef.scrollTop < scrollThreshold;
      }

      return null;
    }

    setScrollOffsetFromBottom(offsetFromBottom) {
      if (this.listRef && typeof offsetFromBottom === 'number') {
        this.listRef.scrollTop = this.listRef.scrollHeight - offsetFromBottom;
      }
    }

    setScrollOffsetFromTop(offsetFromTop) {
      if (this.listRef && typeof offsetFromTop === 'number') {
        this.listRef.scrollTop = offsetFromTop;
      }
    }

    getSnapshotBeforeUpdate(prevProps) {
      if (prevProps.objectId !== this.props.objectId) {
        this.chatItemRefs = emptyMap;
      }
      return null;
    }

    componentDidUpdate() {}
  }

  return EnhanceWithScrollActions;
}

export default Enhance;
