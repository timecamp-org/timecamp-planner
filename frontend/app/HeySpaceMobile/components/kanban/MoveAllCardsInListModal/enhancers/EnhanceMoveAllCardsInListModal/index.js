import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'
import { List } from 'immutable'

import { selectListColor, selectProjectIdByListId, selectProjectNotArchivedListIdsInOrder } from 'models/domain/ListsModel/selectors'
import { selectListNames } from 'models/domain/ListsModel/selectors/domain'
import { onMoveAllTasksInList } from 'models/domain/ListsModel/actions'

const emptyList = new List()

function Enhance(ComposedComponent) {
  class EnhanceMoveAllCardsInListModal extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      listId: PropTypes.string.isRequired,
    }

    constructor(props) {
      super(props)

      const listIds = props.listIds.filter(listId => listId !== props.listId)

      this.state = {
        selectedListId: listIds.first() || props.listId,
      }
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          listIds={this.getListIds()}

          selectedListId={this.state.selectedListId}

          getLabel={this.getLabel}
          onListChange={this.onListChange}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        />
      )
    }

    getLabel(listId) {
      return this.props.listNames.get(listId)
    }

    getListIds() {
      let result = emptyList

      if (this.props.listIds.size === 1) {
        result = this.props.listIds
      } else {
        result = this.props.listIds.filter(listId => listId !== this.props.listId)
      }

      return result
    }

    onListChange(selectedListId) {
      this.setState({
        selectedListId,
      })
    }

    onSubmit() {
      const { selectedListId } = this.state
      const { listId } = this.props

      if (selectedListId !== listId) {
        this.props.onMoveAllCards(listId, selectedListId)
      }

      this.props.onClose()
    }

    onCancel() {
      this.props.onClose()
    }

  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByListId(state, { listId: props.listId })
    return {
      projectId,
      listColor: selectListColor(state, { listId: props.listId }),
      listIds: selectProjectNotArchivedListIdsInOrder(state, { projectId }),
      listNames: selectListNames(state),
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    onMoveAllCards: (sourceListId, destinationListId) => dispatch(onMoveAllTasksInList(sourceListId, destinationListId)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMoveAllCardsInListModal)
}

export default Enhance
