import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { selectGroupedTaskReactions } from 'models/domain/TasksModel/selectors';

const MAX_REACTION_KEYS = 5;
const NO_VALUE = 'noValue';
const HAS_VALUE = 'hasValue';

function enhance(ComposedComponent) {
  class EnhanceTaskReactions extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      showComponentCondition: PropTypes.oneOf([NO_VALUE, HAS_VALUE]),
    };

    render() {
      const totalReactions = this.props.groupedReactions.size;
      const showComponent =
        this.props.showComponentCondition === undefined ||
        (this.props.showComponentCondition === NO_VALUE && totalReactions === 0) ||
        (this.props.showComponentCondition === HAS_VALUE && totalReactions > 0);

      return (
        showComponent && (
          <ComposedComponent taskId={this.props.taskId} shouldShowReactionPicker={this.shouldShowReactionPicker()} />
        )
      );
    }

    shouldShowReactionPicker() {
      return this.props.groupedReactions.size < MAX_REACTION_KEYS;
    }
  }

  const mapStateToProps = (state, props) => ({
    groupedReactions: selectGroupedTaskReactions(state, {
      taskId: props.taskId,
    }),
  });

  return connect(mapStateToProps, null)(EnhanceTaskReactions);
}

export default enhance;
