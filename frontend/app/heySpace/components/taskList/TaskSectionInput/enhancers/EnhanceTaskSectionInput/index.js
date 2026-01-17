import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import generateId from "common/utils/generate-pushid";
import { doNothing } from "common/utils";

import { selectProjectColor } from "models/domain/ProjectsModel/selectors";
import { onCreateList } from "models/domain/ListsModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function Enhance(ComposedComponent) {
  class EnhanceTaskSectionInput extends BaseComponent {
    static propTypes = {
      projectId: PropTypes.string.isRequired,
      isFocused: PropTypes.bool.isRequired,
      createSectionAtTheBeginning: PropTypes.bool,
      color: PropTypes.string.isRequired,
      onSectionCreate: PropTypes.func.isRequired,
      onScrollTaskListToBottom: PropTypes.func,
      onSetIsFocused: PropTypes.func,
    };

    static defaultProps = {
      createSectionAtTheBeginning: false,
      onScrollTaskListToBottom: doNothing,
      onSetIsFocused: doNothing,
      onSectionCreate: doNothing,
    };

    state = {
      sectionNameInputValue: "",
    };

    render() {
      return (
        <ComposedComponent
          color={this.props.color}
          isFocused={this.props.isFocused}
          sectionNameInputValue={this.state.sectionNameInputValue}
          inputRef={this.inputRef}
          onChangeSectionName={this.onChangeSectionName}
          onSectionCreate={this.onSectionCreate}
          onCancel={this.onCancel}
          onKeyDown={this.onKeyDown}
          onSetIsFocused={this.onSetIsFocused}
        />
      );
    }

    inputRef(ref) {
      this.input = ref;
    }

    onChangeSectionName(event) {
      this.setState({
        sectionNameInputValue: event.target.value,
      });
    }

    onKeyDown(event) {
      event.stopPropagation();
      if (event.key === "Enter") {
        const taskId = generateId("task");
        const name = event.target.value;
        this.onSectionCreate(name, taskId);
      } else if (event.key === "Escape") {
        this.onCancel();
      }
    }

    onSectionCreate(name) {
      const taskId = generateId("task");
      this.props.onSectionCreate(name, taskId);
      this.clearSectionNameInputValue();
      this.onSetIsFocused(false);
      if (!this.props.createSectionAtTheBeginning) {
        this.props.onScrollTaskListToBottom();
      }
    }

    onCancel() {
      this.clearSectionNameInputValue();
      this.onSetIsFocused(false);
    }

    clearSectionNameInputValue() {
      this.setState({
        sectionNameInputValue: "",
      });
    }

    onSetIsFocused(isFocused) {
      this.props.onSetIsFocused(isFocused);
    }

    onInputFocus() {
      if (this.input) {
        this.input.focus();
      }
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.isFocused && this.props.isFocused) {
        setImmediate(this.onInputFocus);
      }
    }

    componentDidMount() {
      if (this.props.isFocused) {
        setImmediate(this.onInputFocus);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      color: selectProjectColor(state, { projectId: props.projectId }),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onSectionCreate: (name) => {
        dispatch(
          onCreateList(
            {
              projectId: props.projectId,
              name: name || "New List",
              wasJustCreated: true,
              createAtTheTop: props.createSectionAtTheBeginning,
              createAtTheBottom: !props.createSectionAtTheBeginning,
            },
            null,
            null,
            !props.createSectionAtTheBeginning,
            props.createSectionAtTheBeginning
          )
        );
      },
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceTaskSectionInput);
}

export default Enhance;
