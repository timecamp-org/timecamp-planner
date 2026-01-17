import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as TasksActions from "models/domain/TasksModel/actions";
import * as TasksSelectors from "models/domain/TasksModel/selectors";

function Enhance(ComposedComponent) {
  class EnhanceTaskStartDateController extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          date={this.props.startDate}
          onUpdateDate={this.props.onUpdateStartDate}
        />
      );
    }
  }

  function mapStateToProps(state, props) {
    return {
      startDate: TasksSelectors.selectTaskStartDate(state, {
        taskId: props.taskId,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onUpdateStartDate: (startDate) =>
        dispatch(TasksActions.onChangeStartDate(props.taskId, startDate, true)),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceTaskStartDateController);
}

export default Enhance;
