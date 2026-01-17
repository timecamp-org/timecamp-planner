import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { onAddItemToChecklist } from "models/domain/ChecklistsModel/actions";

import BaseComponent from "commonEnhancers/BaseComponent";

function enhance(ComposedComponent) {
  class EnhanceChecklistItemAddButton extends BaseComponent {
    static propTypes = {
      // needs
      taskId: PropTypes.string.isRequired,

      // injects
      onAddChecklistItem: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          color={this.props.color}
          onAddChecklistItem={this.props.onAddChecklistItem}
        />
      );
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onAddChecklistItem: () => dispatch(onAddItemToChecklist(props.taskId)),
  });

  return connect(null, mapDispatchToProps)(EnhanceChecklistItemAddButton);
}

export default enhance;
