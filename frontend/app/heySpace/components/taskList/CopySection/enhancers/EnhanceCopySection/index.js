import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { onCopyList } from "models/domain/ListsModel/actions";
import { selectListName } from "models/domain/ListsModel/selectors";
import { selectProjectColor } from "models/domain/ProjectsModel/selectors";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceCopySection extends BaseComponent {
    static propTypes = {
      objectId: PropTypes.string.isRequired,
      sectionId: PropTypes.string.isRequired,
      sectionName: PropTypes.string.isRequired,

      onCopyTaskList: PropTypes.func.isRequired,
      onCopySectionCancelled: PropTypes.func.isRequired,
    };

    state = {
      sectionNameValue: "",
      isSectionNameBeingEdited: false,
    };

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          sectionNameValue={this.getSectionName()}
          color={this.props.color}
          onCancel={this.props.onCopySectionCancelled}
          onSectionNameChange={this.onSectionNameChange}
          onCopySection={this.onCopySection}
          onKeyDown={this.onKeyDown}
        />
      );
    }

    getSectionName() {
      if (this.state.sectionNameValue) {
        return this.state.sectionNameValue;
      } else if (this.state.isSectionNameBeingEdited) {
        return "";
      } else {
        return this.props.sectionName;
      }
    }

    onSectionNameChange(event) {
      if (!this.state.isSectionNameBeingEdited) {
        this.setState({
          isSectionNameBeingEdited: true,
        });
      }
      this.setState({
        sectionNameValue: event.target.value,
      });
    }

    onCopySection() {
      this.props.onCopyTaskList(this.getSectionName());
      this.props.onCopySectionDispatched();
    }

    onKeyDown(event) {
      if (event.key === "Enter") {
        this.onCopySection();
      } else if (event.key === "Escape") {
        this.props.onCopySectionCancelled();
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      sectionName: selectListName(state, { listId: props.sectionId }),
      color: selectProjectColor(state, { projectId: props.objectId }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onCopyTaskList: (listName) =>
      dispatch(onCopyList(props.sectionId, listName)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCopySection);
}

export default enhance;
