import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectTaskProgressEstimate } from "models/domain/TasksModel/selectors";

function enhance(ComposedComponent) {
  class EnhanceWithTaskProgressEstimate extends BaseComponent {
    static propTypes = {
      // need
      taskId: PropTypes.string.isRequired,

      // pass
      taskProgressEstimate: PropTypes.number,
    };

    static defaultProps = {
      taskProgressEstimate: 0,
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      taskProgressEstimate: selectTaskProgressEstimate(state, {
        taskId: props.taskId,
      }),
    };
  };

  return connect(mapStateToProps, null)(EnhanceWithTaskProgressEstimate);
}

export default enhance;
