import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as TasksModelSelectors from "models/domain/TasksModel/selectors";
import * as TasksModelActions from "models/domain/TasksModel/actions";
import { TaskStatus } from "models/domain/TasksModel/types";

export default function enhance(Component) {
  class EnhanceTaskCompletionStatusController extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      taskId: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          color={this.props.color}
          isTaskCompleted={this.isTaskDone()}
          onClick={this.onClick}
        />
      );
    }

    isTaskDone() {
      return this.props.taskStatus === TaskStatus.COMPLETED;
    }

    onClick(event) {
      this.statusChanged = true;
      if (this.isTaskDone()) {
        this.props.taskUpdateStatus(TaskStatus.ACTIVE);
      } else {
        this.props.taskUpdateStatus(TaskStatus.COMPLETED);
      }
    }

    getTaskStatus() {
      if (this.isTaskDone()) {
        return TaskStatus.ACTIVE;
      } else {
        return TaskStatus.COMPLETED;
      }
    }

    getTaskProgress() {
      if (this.isTaskDone()) {
        return 0;
      } else {
        return 100;
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      taskStatus: TasksModelSelectors.selectTaskStatus(state, {
        taskId: props.taskId,
      }),
    };
  };

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      taskUpdateStatus: (status) =>
        dispatch(
          TasksModelActions.onChangeStatus(ownProps.taskId, status, true)
        ),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceTaskCompletionStatusController);
}
