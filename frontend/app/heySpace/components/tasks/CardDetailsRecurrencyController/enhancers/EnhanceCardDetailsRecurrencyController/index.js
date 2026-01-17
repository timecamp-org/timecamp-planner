import React from "react";
import PropTypes from "prop-types";

import EnhanceWithClickOutside from "react-click-outside";
import { connect } from "react-redux";

import { selectTaskNextRecurrenceAt } from "models/domain/TaskRecurrenceModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceCardDetailsRecurrencyController extends BaseComponent {
    static propTypes = {
      // needs
      taskId: PropTypes.string.isRequired,
    };

    state = {
      isControllerOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          className={this.props.className}
          color={this.props.color}
          isControllerOpen={this.state.isControllerOpen}
          nextRecurrenceAt={this.props.nextRecurrenceAt}
          onSetIsControllerOpen={this.onSetIsControllerOpen}
          onKeyDown={this.onKeyDown}
          onClickOutside={this.onClickOutside}
          onControllerClick={this.onControllerClick}
        />
      );
    }

    onSetIsControllerOpen(isControllerOpen) {
      this.setState({ isControllerOpen });
    }

    onControllerClick() {
      this.onSetIsControllerOpen(!this.state.isControllerOpen);
    }

    onCloseController() {
      this.setState({
        isControllerOpen: false,
      });
    }

    onKeyDown(event) {
      switch (event.key) {
        case "Escape": {
          this.onCloseController();
          break;
        }
        default:
          break;
      }
    }

    onClickOutside() {
      if (this.state.isControllerOpen) {
        this.setState({
          isControllerOpen: false,
        });
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      nextRecurrenceAt: selectTaskNextRecurrenceAt(state, {
        taskId: props.taskId,
      }),
    };
  };

  return connect(mapStateToProps)(EnhanceCardDetailsRecurrencyController);
}

export default Enhance;
