import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import { selectTaskProgressEstimate } from "models/domain/TasksModel/selectors";
import { onChangeProgressEstimate } from "models/domain/TasksModel/actions";
import { doNothing } from "common/utils";

export const progressOptions = [0, 25, 50, 75, 100];
const changeEstimateDebounceTimeout = 1000;

function enhance(ComposedComponent) {
  class EnhanceTaskProgressEstimateEditable extends BaseComponent {
    static propTypes = {
      // needs
      taskId: PropTypes.string.isRequired,
      ignoreDebounce: PropTypes.bool,
      onMouseEnterProgressBar: PropTypes.func,
      onMouseLeaveProgressBar: PropTypes.func,
      onChangeTaskProgressCallback: PropTypes.func,

      // uses
      progressEstimate: PropTypes.number,
      onChangeProgressEstimate: PropTypes.func.isRequired,
    };

    static defaultProps = {
      onMouseEnterProgressBar: doNothing,
      onMouseLeaveProgressBar: doNothing,
      onChangeTaskProgressCallback: doNothing,
      onChangeProgressEstimate: doNothing,
    };

    state = {
      progressEstimateThresholdOptionMouseIsOver: 0,
    };

    render() {
      return (
        <ComposedComponent
          color={this.props.color}
          className={this.props.className}
          progressEstimate={this.props.progressEstimate}
          tempProgressEstimate={
            this.state.progressEstimateThresholdOptionMouseIsOver
          }
          shouldRenderTooltip={this.props.shouldRenderTooltip}
          progressEstimateThresholdOptions={progressOptions}
          onMouseEnterProgressBar={this.onMouseEnterProgressBar}
          onMouseLeaveProgressBar={this.onMouseLeaveProgressBar}
          onMouseEnterOptionButton={this.onMouseEnterOptionButton}
          onMouseLeaveOptionButton={this.onMouseLeaveOptionButton}
          onChangeProgressEstimate={this.onChangeProgressEstimate}
        />
      );
    }

    onMouseEnterProgressBar() {
      this.props.onMouseEnterProgressBar();
    }

    onMouseLeaveProgressBar() {
      this.props.onMouseLeaveProgressBar();
      this.setState({
        progressEstimateThresholdOptionMouseIsOver: 0,
      });
    }

    onMouseEnterOptionButton(optionThreshold) {
      this.setState({
        progressEstimateThresholdOptionMouseIsOver: optionThreshold,
      });
    }

    onMouseLeaveOptionButton(event, optionThreshold) {
      if (progressOptions.indexOf(optionThreshold) > 0) {
        const { clientX } = event;
        const { left, width } = event.target.getBoundingClientRect();

        if (clientX <= left + width / 2) {
          this.setState({
            progressEstimateThresholdOptionMouseIsOver:
              progressOptions[progressOptions.indexOf(optionThreshold) - 1],
          });
        }
      }
    }

    onChangeProgressEstimate(event, progressEstimate) {
      this.props.onChangeTaskProgressCallback(event);
      if (this.props.progressEstimate !== progressEstimate) {
        this.props.onChangeProgressEstimate(progressEstimate);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      progressEstimate: selectTaskProgressEstimate(state, {
        taskId: props.taskId,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onChangeProgressEstimate: (progressEstimate) =>
      dispatch(
        onChangeProgressEstimate(
          props.taskId,
          progressEstimate,
          props.ignoreDebounce,
          changeEstimateDebounceTimeout
        )
      ),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceTaskProgressEstimateEditable);
}

export default enhance;
