import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import {
  selectChecklistItemIsChecked,
  selectChecklistItemText
} from 'models/domain/ChecklistsModel/selectors/domain'
import {
  onAddItemToChecklist,
  onChangeChecklistItemData,
  onChangeChecklistItemText, onRemoveItemFromChecklist
} from 'models/domain/ChecklistsModel/actions'
import { selectTaskColor } from 'models/domain/TasksModel/selectors'

function enhance(ComposedComponent) {
  class EnhanceChecklistItem extends BaseComponent {

    static propTypes = {
      // needs
      checklistItemId: PropTypes.string.isRequired,
      taskId: PropTypes.string.isRequired,
      taskColor: PropTypes.string,

      // uses/injects
      isChecked: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
      onChangeChecklistItemData: PropTypes.func.isRequired,
      onChangeChecklistItemText: PropTypes.func.isRequired,
      onRemoveItemFromChecklist: PropTypes.func.isRequired,
    }

    state = {
      text: this.props.text,
      isConfirmDeleteModalOpen: false,
      isInputFocused: false,
    }

    render() {
      return (
        <ComposedComponent
          color={this.props.color}
          checklistItemId={this.props.checklistItemId}
          isChecked={this.props.isChecked}
          text={this.state.text}
          isConfirmDeleteModalOpen={this.state.isConfirmDeleteModalOpen}
          isInputFocused={this.state.isInputFocused}
          taskColor={this.props.taskColor}

          onSetIsConfirmDeleteModalOpen={this.onSetIsConfirmDeleteModalOpen}
          onToggleStatus={this.onToggleStatus}
          onChangeText={this.onChangeChecklistItemText}
          onBlurChecklistItemTextInput={this.onBlurChecklistItemTextInput}
          onFocusChecklistItemTextInput={this.onFocusChecklistItemTextInput}
          onRemoveItemFromChecklist={this.props.onRemoveItemFromChecklist}
        />
      )
    }

    onToggleStatus() {
      this.props.onChangeChecklistItemData({
        isChecked: !this.props.isChecked,
      })
    }

    onChangeChecklistItemText(text) {
      this.setState({ text })
    }

    onBlurChecklistItemTextInput() {
      const { text } = this.state
      const { text: oldText } = this.props
      if (text !== oldText) {
        this.props.onChangeChecklistItemText(text, true)
      }
      this.setState({ isInputFocused: false })
    }

    onFocusChecklistItemTextInput() {
      this.setState({ isInputFocused: true })
    }

    onSetIsConfirmDeleteModalOpen(isOpen) {
      this.setState({
        isConfirmDeleteModalOpen: isOpen,
      })
    }

  }

  const mapStateToProps = (state, props) => {
    const { checklistItemId, taskId } = props

    return {
      isChecked: selectChecklistItemIsChecked(state, { checklistItemId }),
      taskColor: selectTaskColor(state, { taskId: taskId }),
      text: selectChecklistItemText(state, { checklistItemId }),
    }
  }


  const mapDispatchToProps = (dispatch, props) => ({
    onChangeChecklistItemData: (checklistItemData) => dispatch(onChangeChecklistItemData(props.checklistItemId, checklistItemData, props.taskId)),
    onChangeChecklistItemText: (text, ignoreDebounce = false) => dispatch(onChangeChecklistItemText(props.checklistItemId, text, props.taskId, ignoreDebounce)),
    onAddNewChecklistItemBelow: () => dispatch(onAddItemToChecklist(props.taskId, props.checklistItemId)),
    onRemoveItemFromChecklist: () => dispatch(onRemoveItemFromChecklist(props.taskId, props.checklistItemId)),
  })


  return connect(mapStateToProps, mapDispatchToProps)(EnhanceChecklistItem)
}

export default enhance
