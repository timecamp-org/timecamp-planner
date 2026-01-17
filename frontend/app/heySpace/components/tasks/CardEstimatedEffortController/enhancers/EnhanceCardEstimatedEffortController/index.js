import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import EnhanceWithClickOutside from "react-click-outside";

import BaseComponent from "commonEnhancers/BaseComponent";

import * as ExtensionsModelActions from "models/domain/ExtensionsModel/actions";
import isNil from "lodash/isNil";
import isFinite from "lodash/isFinite";
import {
  selectCustomFieldValue,
  selectExtensionIdByNamespace,
} from "models/domain/ExtensionsModel/selectors/domain";

import {
  TargetType,
  FieldType,
  ExtensionNamespace,
} from "models/domain/ExtensionsModel/types";

function Enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceCardEstimatedEffortController extends BaseComponent {
    static propTypes = {
      // needs
      taskId: PropTypes.string.isRequired,
      renderTargetComponent: PropTypes.func.isRequired,

      // injects
      taskEstimatedEffort: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      onSetExtensionCustomFieldValue: PropTypes.func.isRequired,
    };

    state = {
      isControllerOpen: false,
      localTaskEstimatedEffort: this.props.taskEstimatedEffort || "",
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          taskId={this.props.taskId}
          className={this.props.className}
          color={this.props.color}
          taskEstimatedEffort={this.props.taskEstimatedEffort}
          localTaskEstimatedEffort={this.state.localTaskEstimatedEffort}
          isTaskEstimatedEffortExists={this.isTaskEstimatedEffortExists()}
          isControllerOpen={this.state.isControllerOpen}
          onSetIsControllerOpen={this.onSetIsControllerOpen}
          onChangeEstimatedEffort={this.onChangeEstimatedEffort}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          onClearEstimatedEffort={this.onClearEstimatedEffort}
          onSetInputRef={this.onSetInputRef}
          renderTargetComponent={this.props.renderTargetComponent}
          onClickOutside={this.onClickOutside}
        />
      );
    }

    isTaskEstimatedEffortExists() {
      return (
        !isNil(this.props.taskEstimatedEffort) &&
        this.props.taskEstimatedEffort !== ""
      );
    }

    onSetIsControllerOpen(isControllerOpen) {
      this.setState({ isControllerOpen });
    }

    onClearEstimatedEffort() {
      if (isNil(this.props.taskEstimatedEffort)) {
        return;
      }
      this.props.onSetExtensionCustomFieldValue(this.props.extensionId, null);
      this.setState({
        isControllerOpen: false,
        localTaskEstimatedEffort: "",
      });
    }

    onChangeEstimatedEffort(event) {
      const text = event.target.value;
      let value;
      if (text.length > 0) {
        value = parseInt(text);
      } else {
        value = text;
      }
      this.setState({ localTaskEstimatedEffort: value });
    }

    onBlur() {
      let value = this.state.localTaskEstimatedEffort;
      if (!isFinite(value)) {
        value = null;
      }
      if (value !== this.props.taskEstimatedEffort) {
        this.props.onSetExtensionCustomFieldValue(
          this.props.extensionId,
          value
        );
      }
    }

    onCloseController() {
      this.setState({
        isControllerOpen: false,
      });
    }

    onKeyDown(event) {
      switch (event.key) {
        case "Enter": {
          this.onBlur();
          this.onCloseController();
          break;
        }
        case "Escape": {
          this.onCloseController();
          this.setState({
            localTaskEstimatedEffort: this.props.taskEstimatedEffort,
          });
          break;
        }
        default:
          break;
      }
    }

    onClickOutside() {
      if (this.state.isControllerOpen) {
        this.onBlur();
        this.setState({
          isControllerOpen: false,
        });
      }
    }

    onSetInputRef(ref) {
      this.inputRef = ref;
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }

    componentDidUpdate(prevProps, prevState) {
      if (!prevState.isControllerOpen && this.state.isControllerOpen) {
        if (this.inputRef) {
          const ref = this.inputRef;
          setImmediate(() => {
            ref.focus();
          });
        }
      }

      if (
        this.props.taskEstimatedEffort !== prevProps.taskEstimatedEffort &&
        this.props.taskEstimatedEffort !== this.state.localTaskEstimatedEffort
      ) {
        this.setState({
          localTaskEstimatedEffort: this.props.taskEstimatedEffort || "",
        });
      }
    }
  }

  function mapStateToProps(state, props) {
    return {
      taskEstimatedEffort: selectCustomFieldValue(state, {
        extensionNamespace: ExtensionNamespace.AGILE,
        fieldType: FieldType.ESTIMATED_EFFORT,
        targetId: props.taskId,
        targetType: TargetType.TASK,
      }),
      extensionId: selectExtensionIdByNamespace(state, {
        extensionNamespace: ExtensionNamespace.AGILE,
      }),
    };
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onSetExtensionCustomFieldValue: (extensionId, taskEstimatedEffort) =>
        dispatch(
          ExtensionsModelActions.onSetExtensionCustomFieldValue(
            extensionId,
            TargetType.TASK,
            props.taskId,
            FieldType.ESTIMATED_EFFORT,
            taskEstimatedEffort
          )
        ),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceCardEstimatedEffortController);
}

export default Enhance;
