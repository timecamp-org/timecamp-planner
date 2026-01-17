import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { selectTaskColor } from "models/domain/TasksModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

import { onAddTaskReaction } from "models/domain/TasksModel/actions";

function enhance(ComposedComponent) {
  class EnhanceTaskReactionPicker extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,

      // this enhancer
      onPickReaction: PropTypes.func.isRequired,
    };

    state = {
      isPickerOpen: false,
    };

    render() {
      return (
        <ComposedComponent
          isPickerOpen={this.state.isPickerOpen}
          color={this.props.color}
          onPickerButtonClick={this.onPickerButtonClick}
          onPickReaction={this.onPickReaction}
          onClosePicker={this.onClosePicker}
        />
      );
    }

    onPickerButtonClick(event) {
      event.stopPropagation();
      this.setState((prevState) => ({
        isPickerOpen: !prevState.isPickerOpen,
      }));
    }

    onClosePicker() {
      this.setState({
        isPickerOpen: false,
      });
    }

    onPickReaction(emojiColonFormat) {
      this.onClosePicker();
      this.props.onPickReaction(emojiColonFormat);
    }

    componentDidMount() {
      this.popperRoot = document.getElementById("popper-root");
    }
  }

  function mapStateToProps(state, props) {
    return {
      color: selectTaskColor(state, { taskId: props.taskId }),
    };
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onPickReaction: (emojiColonFormat) =>
      dispatch(onAddTaskReaction(props.taskId, emojiColonFormat)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceTaskReactionPicker);
}

export default enhance;
