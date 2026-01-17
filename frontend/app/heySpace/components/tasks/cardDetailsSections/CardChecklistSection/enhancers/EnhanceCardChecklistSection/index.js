import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { doNothing } from "common/utils";

import { onAddItemToChecklist } from "models/domain/ChecklistsModel/actions";
import { selectChecklistItemsIdsByTaskId } from "models/domain/ChecklistsModel/selectors/domain";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceCardChecklistSection extends BaseComponent {
    static propTypes = {
      // needs
      taskId: PropTypes.string.isRequired,

      // injects
      onClick: PropTypes.func,
    };

    static defaultProps = {
      onClick: doNothing,
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          color={this.props.color}
          onClick={this.onClick}
          isChecklistEmpty={this.props.isChecklistEmpty}
        />
      );
    }

    onClick() {
      this.props.onClick();
      if (this.props.isChecklistEmpty) {
        this.props.onAddChecklistItem();
      }
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

  const mapDispatchToProps = (dispatch, props) => ({
    onAddChecklistItem: () => dispatch(onAddItemToChecklist(props.taskId)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(EnhanceCardChecklistSection);
}

export default enhance;
