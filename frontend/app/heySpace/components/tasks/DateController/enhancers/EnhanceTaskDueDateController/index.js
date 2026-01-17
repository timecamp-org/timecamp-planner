import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as TasksActions from "models/domain/TasksModel/actions";
import * as TasksSelectors from "models/domain/TasksModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceTaskDueDateController extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          date={this.props.dueDate}
          onUpdateDate={this.props.onUpdateDueDate}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    return {
      dueDate: TasksSelectors.selectTaskDueDate(state, {
        taskId: props.taskId,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUpdateDueDate: (dueDate) =>
        dispatch(TasksActions.onChangeDueDate(props.taskId, dueDate, true)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceTaskDueDateController);
}

export default Enhance;
