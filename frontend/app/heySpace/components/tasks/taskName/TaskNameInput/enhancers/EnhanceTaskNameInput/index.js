import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BaseComponent from "commonEnhancers/BaseComponent";
import { doNothing } from "common/utils";
import { defaultDebounceTime } from "common/utils/debounceTimes";

import * as TasksSelectors from "models/domain/TasksModel/selectors";
import * as TasksActions from "models/domain/TasksModel/actions";

export default function enhance(Component) {
  class EnhanceTaskNameInput extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,

      taskId: PropTypes.string.isRequired,

      onKeyDown: PropTypes.func,
      onKeyUp: PropTypes.func,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onSelectTask: PropTypes.func,
      onSetTaskNameInputRef: PropTypes.func,
    };

    static defaultProps = {
      onKeyDown: doNothing,
      onKeyUp: doNothing,
      onFocus: doNothing,
      onBlur: doNothing,
      onSelectTask: doNothing,
      onSetTaskNameInputRef: doNothing,
    };

    constructor(props) {
      super(props);
      this.taskName = null;
      this.state = {
        taskName: props.taskName,
      };
    }

    render() {
      return (
        <Component
          className={this.props.className}
          color={this.props.color}
          taskId={this.props.taskId}
          isMultiline={this.props.isMultiline}
          taskName={this.state.taskName}
          placeholder={this.props.placeholder}
          onTaskUpdateName={this.onTaskUpdateName}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.props.onKeyUp}
          onClick={this.onClick}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onSetRef={this.onSetTaskNameInputRef}
          onSetTextareaRef={this.onSetTextareaRef}
        />
      );
    }

    onSetTextareaRef(ref) {
      this.reactTextareaAutosizeRef = ref;
    }

    onSetTaskNameInputRef(ref) {
      this.taskInputRef = ref;
      this.props.onSetTaskNameInputRef(ref);
    }

    onClick(event) {
      event.stopPropagation();
      this.props.onSelectTask(this.props.taskId);
    }

    onTaskUpdateName(event) {
      const name = event.target.value;
      this.setState({ taskName: name });

      if (this.updateNameTimeout) {
        clearTimeout(this.updateNameTimeout);
      }
      this.updateNameTimeout = setTimeout(() => {
        this.onTaskUpdate(name);
      }, defaultDebounceTime);
    }

    onFocus(event) {
      const text = event.target.value;
      this.taskName = text;
      this.props.onFocus();
    }

    onKeyDown(event) {
      const text = event.target.value;
      this.props.onKeyDown(event, this.props.taskId, text);
      if (event.key === "Escape") {
        event.stopPropagation();
      }
      if (text !== this.taskName) {
        if (["ArrowDown", "ArrowUp", "Enter", "Tab"].includes(event.key)) {
          if (this.updateNameTimeout) {
            clearTimeout(this.updateNameTimeout);
          }

          this.onTaskUpdate(text);
        }
        this.taskName = null;
      }
    }

    onBlur(event) {
      if (this.updateNameTimeout) {
        clearTimeout(this.updateNameTimeout);
      }

      this.props.onBlur();
      const text = event.target.value;
      if (text !== this.taskName) {
        this.onTaskUpdate(text);
        this.taskName = null;
      } else {
        // ok
      }
    }

    onTaskUpdate(text) {
      this.props.onTaskUpdate(this.props.taskId, { name: text });
    }

    componentDidMount() {
      if (this.reactTextareaAutosizeRef) {
        this.resizeOnMountTimeout = setTimeout(
          () => this.reactTextareaAutosizeRef._resizeComponent(),
          0
        );
      }
    }

    componentWillUnmount() {
      if (this.updateNameTimeout) {
        clearTimeout(this.updateNameTimeout);
      }
      if (this.resizeOnMountTimeout) {
        clearTimeout(this.resizeOnMountTimeout);
      }
      if (this.state.taskName !== this.props.taskName) {
        this.onTaskUpdate(this.state.taskName);
      }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.taskName !== this.props.taskName) {
        this.setState({ taskName: this.props.taskName });
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      taskName: TasksSelectors.selectTaskName(state, { taskId: props.taskId }),
    };
  };

  function mapDispatchToProps(dispatch, ownProps) {
    return {
      onTaskUpdateName: (name) =>
        dispatch(TasksActions.onUpdateName(ownProps.taskId, name)),
      onTaskUpdate: (taskId, taskFields) =>
        dispatch(TasksActions.onTaskUpdate(taskId, taskFields, true)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskNameInput);
}
