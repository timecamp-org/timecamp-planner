import { List } from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { selectMessageList } from '../../../models/domain/MessagesModel/selectors';
import BaseComponent from '../../BaseComponent';

import { getMessageSelectorItemTypeConfig } from './messageSelectorItemTypeConfig';

function Enhance(ComposedComponent) {
  class EnhanceWithChatItems extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      objectType: PropTypes.string.isRequired,
      chatItems: ImmutablePropTypes.list,
      showMessagesOnly: PropTypes.bool,
      itemsType: PropTypes.string,
    };

    static defaultProps = {
      chatItems: List(),
    };

    render() {
      return <ComposedComponent {...this.props} chatItems={this.props.chatItems} />;
    }
  }

  function mapStateToProps(state, props) {
    return {
      chatItems: selectMessageList(state, {
        objectId: props.objectId,
        ...getMessageSelectorItemTypeConfig(props.itemsType),
      }),
    };
  }

  return connect(mapStateToProps)(EnhanceWithChatItems);
}

export default Enhance;
