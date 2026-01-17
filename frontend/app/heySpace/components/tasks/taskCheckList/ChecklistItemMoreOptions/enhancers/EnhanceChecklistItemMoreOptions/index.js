import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";
import EnhanceWithClickOutside from "react-click-outside";
import { onRemoveItemFromChecklist } from "../../../../../../../common/models/domain/ChecklistsModel/actions";

export const ChecklistItemMoreOptionsContentType = {
  contentPicker: "CONTENT_PICKER",
  convertToCard: "CONVERT_TO_CARD",
  convertToCardComment: "CONVERT_TO_CARD_COMMENT",
};

function enhance(ComposedComponent) {
  @EnhanceWithClickOutside
  class EnhanceChecklistItemMoreOptions extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,
      checklistItemId: PropTypes.string.isRequired,
      isPopoverOpen: PropTypes.bool.isRequired,

      onClosePopover: PropTypes.func.isRequired,
    };

    state = {
      contentType: ChecklistItemMoreOptionsContentType.contentPicker,
    };

    render() {
      return (
        <ComposedComponent
          isPopoverOpen={this.props.isPopoverOpen}
          contentType={this.state.contentType}
          taskId={this.props.taskId}
          checklistItemId={this.props.checklistItemId}
          onClosePopover={this.props.onClosePopover}
          onThreeDotsClick={this.onThreeDotsClick}
          onChoseConvertToCard={this.onChoseConvertToCard}
          onChoseConvertToCardComment={this.onChoseConvertToCardComment}
          onRemoveItemFromChecklist={this.props.onRemoveItemFromChecklist}
        />
      );
    }

    onThreeDotsClick() {
      if (!this.props.isPopoverOpen) {
        this.setState({
          contentType: ChecklistItemMoreOptionsContentType.contentPicker,
        });
      }
      this.props.onThreeDotsClick();
    }

    onChoseConvertToCard() {
      this.setState({
        contentType: ChecklistItemMoreOptionsContentType.convertToCard,
      });
    }

    onChoseConvertToCardComment() {
      this.setState({
        contentType: ChecklistItemMoreOptionsContentType.convertToCardComment,
      });
    }

    handleClickOutside(event) {
      if (
        this.props.isPopoverOpen &&
        this.popperRootNode &&
        !this.popperRootNode.contains(event.target)
      ) {
        this.props.onClosePopover();
      }
    }

    componentDidMount() {
      this.popperRootNode = document.getElementById("popper-root");
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onRemoveItemFromChecklist: () =>
      dispatch(onRemoveItemFromChecklist(props.taskId, props.checklistItemId)),
  });

  return connect(null, mapDispatchToProps)(EnhanceChecklistItemMoreOptions);
}

export default enhance;
