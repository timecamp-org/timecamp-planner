import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ImmutablePropTypes from "react-immutable-proptypes";

import * as TasksSelectors from "models/domain/TasksModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceWithTaskProjectId extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string,
      taskProjectId: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          projectId={
            this.props.projectId
              ? this.props.projectId
              : this.props.taskProjectId
          }
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      taskProjectId: TasksSelectors.selectProjectIdByTaskId(state, {
        taskId: props.taskId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceWithTaskProjectId);
}

export default Enhance;
