import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as TasksModelSelectors from "models/domain/TasksModel/selectors";
import { selectIsWaitingToUpdateProgress } from "models/domain/TasksModel/selectors/domain";
import * as TasksModelActions from "models/domain/TasksModel/actions";
import EnhanceWithClickOutside from "react-click-outside";

export default function enhance(Component) {
  @EnhanceWithClickOutside
  class EnhanceTaskStatusAndProgressController extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      taskId: PropTypes.string.isRequired,
      onBlur: PropTypes.func,
    };

    render() {
      return (
        <Component
          className={this.props.className}
          taskId={this.props.taskId}
          color={this.props.color}
        />
      );
    }

    handleClickOutside() {
      if (this.props.isWaitingToUpdateProgress) {
        this.props.onChangeProgressEstimate(this.props.progressEstimate);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      progressEstimate: TasksModelSelectors.selectTaskProgressEstimate(state, {
        taskId: props.taskId,
      }),
      isWaitingToUpdateProgress: selectIsWaitingToUpdateProgress(state),
    };
  };

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      onChangeProgressEstimate: (progressEstimate) =>
        dispatch(
          TasksModelActions.onChangeProgressEstimate(
            ownProps.taskId,
            progressEstimate,
            true
          )
        ),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceTaskStatusAndProgressController);
}
