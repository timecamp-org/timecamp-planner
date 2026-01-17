import React from "react";
import PropTypes from "prop-types";
import { doNothing } from "common/utils";

import BaseComponent from "commonEnhancers/BaseComponent";
import Textarea from "react-textarea-autosize";

class TaskNameInput extends BaseComponent {
  // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    className: PropTypes.string,

    taskId: PropTypes.string.isRequired,
    taskName: PropTypes.string.isRequired,
    isMultiline: PropTypes.bool,

    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onClick: PropTypes.func,
    onTaskUpdateName: PropTypes.func,
    onSetRef: PropTypes.func,
    onSetTextareaRef: PropTypes.func,
  };

  static defaultProps = {
    isMultiline: false,
    onFocus: doNothing,
    onBlur: doNothing,
    onKeyDown: doNothing,
    onKeyUp: doNothing,
    onClick: doNothing,
    onTaskUpdateName: doNothing,
    onSetRef: doNothing,
    onSetTextareaRef: doNothing,
  };

  render() {
    const props = {
      id: this.props.taskId,
      className: `${this.props.className}`,
      type: "text",
      placeholder: this.props.placeholder,
      value: this.props.taskName,
      onKeyDown: this.props.onKeyDown,
      onKeyUp: this.props.onKeyUp,
      onMouseDown: this.props.onMouseDown,
      onMouseUp: this.props.onMouseUp,
      onChange: this.props.onTaskUpdateName,
      onFocus: this.props.onFocus,
      onBlur: this.props.onBlur,
      onClick: this.props.onClick,
      spellCheck: false,
      style: {},
    };

    if (this.props.color) {
      props.style.color = this.props.color;
    }

    if (this.props.isMultiline) {
      return (
        <Textarea
          {...props}
          inputRef={this.props.onSetRef}
          textareaInstanceRef={this.props.onSetTextareaRef}
        />
      );
    } else {
      return <input {...props} ref={this.props.onSetRef} />;
    }
  }
}

export default TaskNameInput;
