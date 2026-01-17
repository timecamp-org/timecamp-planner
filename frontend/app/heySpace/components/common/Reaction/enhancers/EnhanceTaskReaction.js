import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "immutable-prop-types";
import { connect } from "react-redux";

import {
  onAddTaskReaction,
  onRemoveTaskReaction,
} from "models/domain/TasksModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceTaskReaction extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      className: PropTypes.string,
      taskId: PropTypes.string.isRequired,
      emojiCode: PropTypes.string.isRequired,
      size: PropTypes.number,
      userIds: ImmutablePropTypes.list,
      onClick: PropTypes.func,
    };

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          className={this.props.className}
          emojiCode={this.props.emojiCode}
          size={this.props.size}
          userIds={this.props.userIds}
          onClick={this.onClick}
          onAddReaction={this.props.onAddReaction}
          onRemoveReaction={this.props.onRemoveReaction}
        />
      );
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onAddReaction: () =>
      dispatch(onAddTaskReaction(props.taskId, props.emojiCode)),
    onRemoveReaction: () =>
      dispatch(onRemoveTaskReaction(props.taskId, props.emojiCode)),
  });

  return connect(null, mapDispatchToProps)(EnhanceTaskReaction);
}

export default Enhance;
