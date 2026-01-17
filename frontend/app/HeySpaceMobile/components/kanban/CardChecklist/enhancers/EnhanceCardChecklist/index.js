import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectChecklistItemsIdsByTaskId } from 'models/domain/ChecklistsModel/selectors/domain'
import { onAddItemToChecklist } from 'models/domain/ChecklistsModel/actions'

function enhance(ComposedComponent) {
  class EnhanceCardChecklist extends BaseComponent {

    static propTypes = {
      taskId: PropTypes.string.isRequired,

      checklistItemIds: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
      onAddChecklistItem: PropTypes.func.isRequired,
    }

    state = {
      isAddChecklistItemModalVisible: false,
    }

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          checklistItemIds={this.props.checklistItemIds}
          isAddChecklistItemModalVisible={this.state.isAddChecklistItemModalVisible}
          style={this.props.style}
          onSetIsAddChecklistItemModalVisible={this.onSetIsAddChecklistItemModalVisible}
        />
      )
    }

    onSetIsAddChecklistItemModalVisible(isVisible) {
      this.setState({
        isAddChecklistItemModalVisible: isVisible,
      })
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      checklistItemIds: selectChecklistItemsIdsByTaskId(state, { taskId: props.taskId }),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onAddChecklistItem: () => dispatch(onAddItemToChecklist(props.taskId)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardChecklist)
}

export default enhance
