import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { selectLastReadMessageId } from '../../../models/domain/MessagesModel/selectors';
import { selectObjectTopVisibleItem } from '../../../models/domain/MessagesModel/selectors/domain';
import { doNothing } from '../../../utils';
import BaseComponent from '../../BaseComponent';

function Enhance(ComposedComponent) {
  class SetInitialScrollPosition extends BaseComponent {
    static propTypes = {
      isFirstRequestLoading: PropTypes.bool,
      objectId: PropTypes.string.isRequired,
      chatItems: ImmutablePropTypes.list,

      scrollToBottom: PropTypes.func,
      scrollToItem: PropTypes.func,
      onSetInitialScrollPosition: PropTypes.func,
      isLastMessage: PropTypes.func,
    };

    static defaultProps = {
      isFirstRequestLoading: false,
      chatItems: new List(),

      scrollToBottom: doNothing,
      scrollToItem: doNothing,
      onSetInitialScrollPosition: doNothing,
      isLastMessage: doNothing,
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }

    setInitialScrollPosition() {
      if (
        this.props.lastReadMessageId &&
        !this.props.isLastMessage(this.props.lastReadMessageId) &&
        this.getChatItemIndex(this.props.lastReadMessageId) > -1
      ) {
        this.props.scrollToItem(this.props.lastReadMessageId);
      } else if (
        this.props.savedObjectTopVisibleItem &&
        this.getChatItemIndex(this.props.savedObjectTopVisibleItem.id) > -1
      ) {
        this.props.scrollToItem(this.props.savedObjectTopVisibleItem.id, this.props.savedObjectTopVisibleItem.offset);
      } else {
        this.props.scrollToBottom();
      }

      this.props.onSetInitialScrollPosition();
    }

    getChatItemIndex(id) {
      return this.props.chatItems.map((item) => item.get('id')).indexOf(id);
    }

    haveChatContainerChanged(prevProps, currentProps) {
      return prevProps.objectId !== currentProps.objectId;
    }

    componentDidUpdate(prevProps) {
      if (
        this.haveChatContainerChanged(prevProps, this.props) ||
        (prevProps.chatItems.size === 0 && this.props.chatItems.size > 0)
      ) {
        this.setInitialScrollPosition();
      }
    }

    componentDidMount() {
      if (!this.props.isFirstRequestLoading && this.props.chatItems.size > 0) {
        this.setInitialScrollPosition();
      }
    }
  }

  const mapStateToProps = (state, props) => ({
    lastReadMessageId: selectLastReadMessageId(state, { objectId: props.objectId }),
    savedObjectTopVisibleItem: selectObjectTopVisibleItem(state, { objectId: props.objectId }),
  });

  return connect(mapStateToProps)(SetInitialScrollPosition);
}

export default Enhance;
