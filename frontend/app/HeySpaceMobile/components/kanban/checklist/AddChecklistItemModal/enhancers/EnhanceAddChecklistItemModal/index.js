import React from 'react'
import { Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { onAddItemToChecklist } from 'models/domain/ChecklistsModel/actions'
import { selectTaskColor } from 'models/domain/TasksModel/selectors'

function enhance(ComposedComponent) {
  class EnhanceAddChecklistItemModal extends BaseComponent {

    static propTypes = {
      taskId: PropTypes.string.isRequired,
      taskColor: PropTypes.string,
      onClose: PropTypes.func.isRequired,
    }

    state = {
      name: '',
    }

    render() {
      return (
        <ComposedComponent
          isVisible={this.props.isVisible}
          taskColor={this.props.taskColor}

          onClose={this.props.onClose}
          onChangeText={this.onChangeText}
          onCreateChecklistItem={this.onCreateChecklistItem}
        />
      )
    }

    onChangeText(text) {
      this.setState({
        name: text,
      })
    }

    onClose() {
      Keyboard.dismiss()
      this.props.onClose()
    }

    onCreateChecklistItem() {
      const { name } = this.state
      if (name) {
        Keyboard.dismiss()
        this.props.onAddChecklistItem(name)
        this.props.onClose()
        this.onChangeText('')
      } else {
        // show error, name can't be empty
      }
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onAddChecklistItem: (name) => dispatch(onAddItemToChecklist(props.taskId, null, name)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceAddChecklistItemModal)
}

export default enhance
