import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { selectChecklistItemsIdsByTaskId } from "models/domain/ChecklistsModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceTaskChecklistWithAddItemButton extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      isChecklistEmpty: PropTypes.bool,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          color={this.props.color}
          listClassName={this.props.listClassName}
          buttonClassName={this.props.buttonClassName}
          taskId={this.props.taskId}
          isChecklistEmpty={this.props.isChecklistEmpty}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    const checklistItemsIds = selectChecklistItemsIdsByTaskId(state, {
      taskId: props.taskId,
    });
    return {
      isChecklistEmpty: checklistItemsIds.isEmpty(),
    };
  };

  return connect(mapStateToProps, null)(EnhanceTaskChecklistWithAddItemButton);
}

export default enhance;
