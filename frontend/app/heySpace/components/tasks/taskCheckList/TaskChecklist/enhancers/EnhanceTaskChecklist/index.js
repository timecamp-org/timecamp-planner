import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { connect } from "react-redux";

import { selectChecklistItemsIdsByTaskId } from "models/domain/ChecklistsModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceTaskChecklist extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      checklistItemsIds: ImmutablePropTypes.list,
    };

    render() {
      return (
        <ComposedComponent
          color={this.props.color}
          className={this.props.className}
          taskId={this.props.taskId}
          checklistItemsIds={this.props.checklistItemsIds}
          onDeleteChecklistItemCallback={this.onDeleteChecklistItemCallback}
        />
      );
    }

    onDeleteChecklistItemCallback(checklistItemId) {
      const { checklistItemsIds } = this.props;
      const deletedChecklistItemIndex =
        checklistItemsIds.indexOf(checklistItemId);
      const nextChecklistItemId = checklistItemsIds.get(
        deletedChecklistItemIndex + 1
      );
      const prevChecklistItemId =
        deletedChecklistItemIndex >= 1
          ? checklistItemsIds.get(deletedChecklistItemIndex - 1)
          : undefined;

      if (prevChecklistItemId) {
        const prevChecklistItem = document.getElementById(
          `${prevChecklistItemId}--text`
        );
        prevChecklistItem.focus();
        prevChecklistItem.setSelectionRange(
          prevChecklistItem.value.length,
          prevChecklistItem.value.length
        );
      } else if (nextChecklistItemId) {
        const nextChecklistItem = document.getElementById(
          `${nextChecklistItemId}--text`
        );
        nextChecklistItem.focus();
        nextChecklistItem.setSelectionRange(
          nextChecklistItem.value.length,
          nextChecklistItem.value.length
        );
      }
    }
  }

  const mapStateToProps = (state, props) => {
    return {
      checklistItemsIds: selectChecklistItemsIdsByTaskId(state, {
        taskId: props.taskId,
      }),
    };
  };

  return connect(mapStateToProps, null)(EnhanceTaskChecklist);
}

export default enhance;
