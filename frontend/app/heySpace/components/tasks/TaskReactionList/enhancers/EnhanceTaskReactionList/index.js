import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import { selectGroupedTaskReactions } from "models/domain/TasksModel/selectors";

function enhance(ComposedComponent) {
  class EnhanceTaskReactionList extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          groupedReactions={this.props.groupedReactions}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      groupedReactions: selectGroupedTaskReactions(state, {
        taskId: props.taskId,
      }),
    };
  };

  return connect(mapStateToProps, null)(EnhanceTaskReactionList);
}

export default enhance;
