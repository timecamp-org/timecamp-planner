import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'
import { Map } from 'immutable'

import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectProjectNames } from 'models/domain/ProjectsModel/selectors/domain'

import { selectListColor, selectProjectIdByListId } from 'models/domain/ListsModel/selectors'
import { onMoveList } from 'models/domain/ListsModel/actions'
import { selectListIdsOrderByProjectIds, selectListIsArchivedStatuses } from 'models/domain/ListsModel/selectors/domain'

const emptyMap = new Map()

function Enhance(ComposedComponent) {
  class EnhanceMoveListModal extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      listId: PropTypes.string.isRequired,
    }

    constructor(props) {
      super(props)

      let listIds = props.projectsSectionIdsWithOrder.get(props.projectId) || emptyMap
      // filter out archived lists & sort asc by order & get ids list
      listIds = listIds
        .filter((_, listId) => !props.listsIsArchivedStatuses.get(listId))
        .sort((a, b) => a - b)
        .keySeq()
        .toList()

      const selectedPosition = (listIds.indexOf(props.listId) || 0) + 1

      this.state = {
        selectedSpaceId: props.projectId,
        selectedPosition: `${selectedPosition}`,
      }
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          spaceIds={this.props.spaceIds}

          selectedPosition={this.state.selectedPosition}
          selectedSpaceId={this.state.selectedSpaceId}

          getLabel={this.getLabel}
          onSpaceChange={this.onSpaceChange}
          onChangeText={this.onChangeText}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        />
      )
    }

    getLabel(spaceId) {
      return this.props.projectNames.get(spaceId)
    }

    onSpaceChange(selectedSpaceId) {
      this.setState({
        selectedSpaceId,
      })
    }

    onChangeText(selectedPosition) {
      this.setState({
        selectedPosition,
      })
    }

    onSubmit() {
      const { selectedPosition, selectedSpaceId } = this.state
      const { listId, projectsSectionIdsWithOrder } = this.props
      const destinationProjectListIds = projectsSectionIdsWithOrder.get(selectedSpaceId)

      this.props.onMoveList(
        listId,
        Math.min(selectedPosition - 1, destinationProjectListIds ? destinationProjectListIds.size : 0),
        selectedSpaceId
      )

      this.props.onClose()
    }

    onCancel() {
      this.props.onClose()
    }

  }

  const mapStateToProps = (state, props) => {
    return {
      projectId: selectProjectIdByListId(state, { listId: props.listId }),
      listColor: selectListColor(state, { listId: props.listId }),

      projectNames: selectProjectNames(state),
      spaceIds: selectSortedAvailableVisibleSpacesIds(state),
      projectsSectionIdsWithOrder: selectListIdsOrderByProjectIds(state),
      listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    onMoveList: (listId, position, projectId) => dispatch(onMoveList(listId, position, projectId)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMoveListModal)
}

export default Enhance
