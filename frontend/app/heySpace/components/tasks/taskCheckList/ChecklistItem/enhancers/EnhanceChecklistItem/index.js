import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import BaseComponent from "commonEnhancers/BaseComponent";

import {
  selectChecklistItemIsChecked,
  selectChecklistItemText,
  selectChecklistItemWasJustCreated,
} from "models/domain/ChecklistsModel/selectors/domain";
import {
  onChangeChecklistItemData,
  onNewChecklistItemSeen,
  onAddItemToChecklist,
  onRemoveItemFromChecklist,
  onChangeChecklistItemText,
} from "models/domain/ChecklistsModel/actions";
import { selectEntityFieldUpdatedAt } from "models/domain/EntityHistoryModel/selectors";
import { EntityType } from "models/domain/EntityModel/types";
import { timestampNow } from "common/utils/epoch";

function enhance(ComposedComponent) {
  class EnhanceChecklistItem extends BaseComponent {
    static propTypes = {
      // needs
      checklistItemId: PropTypes.string.isRequired,
      taskId: PropTypes.string.isRequired,
      onDeleteChecklistItemCallback: PropTypes.func,

      // uses/injects
      isDone: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
      wasJustCreated: PropTypes.bool.isRequired,
      onChangeChecklistItemData: PropTypes.func.isRequired,
      onChangeChecklistItemText: PropTypes.func.isRequired,
      onNewChecklistItemSeen: PropTypes.func.isRequired,
      onRemoveItemFromChecklist: PropTypes.func.isRequired,
    };

    _inputRef = null;

    state = {
      text: this.props.text,
      isInputFocused: false,
    };

    render() {
      return (
        <ComposedComponent
          color={this.props.color}
          taskId={this.props.taskId}
          checklistItemId={this.props.checklistItemId}
          isDone={this.props.isDone}
          isInputFocused={this.state.isInputFocused}
          text={this.state.text}
          onToggleStatus={this.onToggleStatus}
          onChangeText={this.onChangeChecklistItemText}
          onKeyDown={this.onKeyDown}
          innerRef={this.innerRef}
          onSetTextareaRef={this.onSetTextareaRef}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      );
    }

    nameUpdatedAt = null;

    onSetTextareaRef(ref) {
      this.reactTextareaAutosizeRef = ref;
    }

    onToggleStatus() {
      this.props.onChangeChecklistItemData({
        isChecked: !this.props.isDone,
      });
    }

    onChangeChecklistItemText(event) {
      this.nameUpdatedAt = timestampNow();
      const text = event.target.value;
      this.setState({ text });
      this.props.onChangeChecklistItemText(text);
    }

    onFocus(event) {
      this.setState({
        isInputFocused: true,
      });
    }

    onBlur(event) {
      const text = event.target.value;
      if (this.props.text !== text) {
        this.props.onChangeChecklistItemText(text, true);
      }

      this.setState({
        isInputFocused: false,
      });
    }

    onKeyDown(event) {
      switch (event.key) {
        case "Enter": {
          if (!event.shiftKey) {
            event.preventDefault();
            if (this._inputRef) {
              this._inputRef.blur();
            }
            this.props.onAddNewChecklistItemBelow();
          }
          break;
        }
        case "Backspace": {
          if (!this.state.text) {
            if (this.props.onDeleteChecklistItemCallback) {
              event.preventDefault();
              this.props.onDeleteChecklistItemCallback(
                this.props.checklistItemId
              );
              this.props.onRemoveItemFromChecklist();
            } else {
              this.props.onRemoveItemFromChecklist();
            }
          }
          break;
        }
        case "Escape": {
          event.stopPropagation();
          break;
        }
        default:
          break;
      }
    }

    innerRef(ref) {
      this._inputRef = ref;
    }

    componentDidMount() {
      setImmediate(() => {
        if (this._inputRef && this.props.wasJustCreated) {
          this._inputRef.focus();
          this.props.onNewChecklistItemSeen();
        }
      });

      if (this.reactTextareaAutosizeRef) {
        this.resizeOnMountTimeout = setTimeout(
          () => this.reactTextareaAutosizeRef._resizeComponent(),
          0
        );
      }
    }

    componentDidUpdate() {
      if (
        this.state.text !== this.props.text &&
        this.nameUpdatedAt < this.props.nameUpdatedAt
      ) {
        this.nameUpdatedAt = this.props.nameUpdatedAt;
        this.setState({
          text: this.props.text,
        });
      }
    }

    componentWillUnmount() {
      if (this.resizeOnMountTimeout) {
        clearTimeout(this.resizeOnMountTimeout);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const { checklistItemId } = props;
    return {
      isDone: selectChecklistItemIsChecked(state, { checklistItemId }),
      text: selectChecklistItemText(state, { checklistItemId }),
      wasJustCreated: selectChecklistItemWasJustCreated(state, {
        checklistItemId,
      }),
      nameUpdatedAt: selectEntityFieldUpdatedAt(state, {
        entityId: checklistItemId,
        entityField: "name",
        entityType: EntityType.CHECKLIST_ITEM,
      }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onChangeChecklistItemData: (checklistItemData) =>
      dispatch(
        onChangeChecklistItemData(
          props.checklistItemId,
          checklistItemData,
          props.taskId
        )
      ),
    onChangeChecklistItemText: (text, ignoreDebounce = false) =>
      dispatch(
        onChangeChecklistItemText(
          props.checklistItemId,
          text,
          props.taskId,
          ignoreDebounce
        )
      ),
    onAddNewChecklistItemBelow: () =>
      dispatch(onAddItemToChecklist(props.taskId, props.checklistItemId)),
    onRemoveItemFromChecklist: () =>
      dispatch(onRemoveItemFromChecklist(props.taskId, props.checklistItemId)),
    onNewChecklistItemSeen: () =>
      dispatch(onNewChecklistItemSeen(props.checklistItemId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceChecklistItem);
}

export default enhance;
