import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { doNothing } from "common/utils";

import * as TasksSelectors from "models/domain/TasksModel/selectors";
import EnhanceWithClickOutside from "react-click-outside";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceCardDetailsSection extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    };

    static defaultProps = {
      onClick: doNothing,
    };

    state = {
      isFocused: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          taskId={this.props.taskId}
          color={this.props.color}
          isFocused={this.state.isFocused}
          onClick={this.onClick}
          onSetIsFocused={this.onSetIsFocused}
        />
      );
    }

    onClick() {
      this.props.onClick();
      this.onSetIsFocused(!this.state.isFocused);
    }

    onSetIsFocused(isFocused) {
      this.setState({ isFocused });
    }

    handleClickOutside() {
      if (this.state.isFocused) {
        this.onSetIsFocused(false);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      color: TasksSelectors.selectTaskColor(state, { taskId: props.taskId }),
    };
  };

  return connect(mapStateToProps)(EnhanceCardDetailsSection);
}

export default enhance;
