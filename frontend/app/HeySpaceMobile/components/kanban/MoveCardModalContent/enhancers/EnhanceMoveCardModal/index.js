import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectListIdByTaskId, selectProjectsListIds } from 'models/domain/ListsModel/selectors'
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors'
import { selectProjectNames } from 'models/domain/ProjectsModel/selectors/domain'
import { selectSortedAvailableVisibleSpacesIds } from 'models/domain/ProjectsModel/selectors/sortedAvailableVisibleSpacesIdsSelector'
import { selectTasksOrderByList, selectListIsArchivedStatuses, selectListNames } from 'models/domain/ListsModel/selectors/domain'
import { onMoveTaskInSections } from 'models/domain/TasksModel/actions'
import { onFetchProjectListsAndTasksData } from 'models/domain/RequestModel/actions'
import { List } from 'immutable'
import { NavigationService } from 'common/services'
import RouteName from '../../../../AppNavigation/routeNames'

const emptyList = new List()

function enhance(ComposedComponent) {
  class EnhanceMoveCardModal extends BaseComponent {

    static propTypes = {
      taskId: PropTypes.string.isRequired,
      shouldNavigateToSpaceAfterCardMoved: PropTypes.bool,
    }

    static defaultProps = {
      shouldNavigateToSpaceAfterCardMoved: false,
    }

    constructor(props) {
      super(props)

      const listTaskIdsInOrder = this.getListTaskIdsInOrder(props.taskIdsOrderByListIds, props.taskListId)
      const taskIdIndex = listTaskIdsInOrder.indexOf(props.taskId)

      this.state = {
        selectedSpaceId: props.taskSpaceId,
        selectedListId: props.taskListId,
        // listIds: this.props.spacesSections.get(props.taskSpaceId),
        listIds: this.getListIds(props.taskSpaceId, props.spacesSections),
        listTaskIdsInOrder,
        // user readable, first item is at position 1, not 0
        cardPosition: taskIdIndex !== -1 ? taskIdIndex + 1 : 1,
      }
    }

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}
          taskListId={this.props.taskListId}
          taskSpaceId={this.props.taskSpaceId}
          spaceIds={this.props.spaceIds}
          selectedSpaceId={this.state.selectedSpaceId}
          listIds={this.state.listIds}
          selectedListId={this.state.selectedListId}
          cardPosition={this.state.cardPosition}

          onIncrementCardPosition={this.onIncrementCardPosition}
          onDecrementCardPosition={this.onDecrementCardPosition}
          getSpaceName={this.getSpaceName}
          getListName={this.getListName}
          onSelectSpaceId={this.onSelectSpaceId}
          onSelectListId={this.onSelectListId}
          onConfirmMoveCard={this.onConfirmMoveCard}
          onCancel={this.props.onClose}
        />
      )
    }


    getListTaskIdsInOrder(taskIdsOrderByListIds, listId, shouldFilterOutCurrentTaskId = true) {
      const taskIdsInOrder = taskIdsOrderByListIds
        .get(listId, emptyList)
        .sort((a, b) => a - b)
        .keySeq()
        .toList()

      return shouldFilterOutCurrentTaskId
        ? taskIdsInOrder.filterNot(taskId => taskId === this.props.taskId)
        : taskIdsInOrder
    }

    getListIds(selectedSpaceId, spacesSections = this.props.spacesSections) {
      const spaceListIds = spacesSections.get(selectedSpaceId)
      if (spaceListIds) {
        const notArchivedListIds = spaceListIds
          .filter(listId => this.props.listsIsArchivedStatuses.get(listId) === false)
        return notArchivedListIds.size > 0
          ? notArchivedListIds
          : emptyList.push(null)
      } else {
        return emptyList.push(null)
      }
    }

    onSelectSpaceId(selectedSpaceId) {
      this.props.onFetchProjectListsAndTasksData(selectedSpaceId)
      const spaceListIds = this.getListIds(selectedSpaceId)
      const selectedListId = spaceListIds.first()
      const listTaskIdsInOrder = this.getListTaskIdsInOrder(this.props.taskIdsOrderByListIds, selectedListId)
      this.setState({
        selectedSpaceId,
        listIds: spaceListIds,
        listTaskIdsInOrder,
        selectedListId,
        cardPosition: 1,
      })
    }

    onSelectListId(selectedListId) {
      const listTaskIdsInOrder = this.getListTaskIdsInOrder(this.props.taskIdsOrderByListIds, selectedListId)
      this.setState({
        selectedListId,
        cardPosition: 1,
        listTaskIdsInOrder,
      })
    }

    onIncrementCardPosition() {
      this.setState(prevState => {
        if (prevState.cardPosition <= prevState.listTaskIdsInOrder.size) {
          return {
            cardPosition: prevState.cardPosition + 1,
          }
        } else {
          return null
        }
      })
    }

    onDecrementCardPosition() {
      this.setState(prevState => {
        if (prevState.cardPosition > 1) {
          return {
            cardPosition: prevState.cardPosition - 1,
          }
        } else {
          return null
        }
      })
    }

    getSpaceName(spaceId) {
      return this.props.spaceNames.get(spaceId) || ''
    }

    getListName(listId) {
      return this.props.listNames.get(listId) || ''
    }

    onConfirmMoveCard() {
      const sourceListTaskIndex = this.getListTaskIdsInOrder(this.props.taskIdsOrderByListIds, this.props.taskListId, false).indexOf(this.props.taskId)
      const data = {
        taskId: this.props.taskId,
        sourceListTaskIndex,
        destinationListTaskIndex: this.state.cardPosition - 1,
        sourceListId: this.props.taskListId,
        destinationListId: this.state.selectedListId,
        destinationProjectId: this.state.selectedSpaceId,
      }
      this.props.onMoveTaskInSections(data)
      this.props.onClose()
      if (this.props.shouldNavigateToSpaceAfterCardMoved) {
        NavigationService.navigate(RouteName.PROJECT, { projectId: this.state.selectedSpaceId })
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.spacesSections !== this.props.spacesSections) {
        const listIds = this.getListIds(this.state.selectedSpaceId, this.props.spacesSections)
        const selectedListId = listIds.first()
        const listTaskIdsInOrder = this.getListTaskIdsInOrder(this.props.taskIdsOrderByListIds, selectedListId)
        this.setState({
          listIds,
          selectedListId,
          listTaskIdsInOrder,
          cardPosition: 1,
        })
      }
    }

  }

  const mapStateToProps = (state, props) => ({
    taskSpaceId: selectProjectIdByTaskId(state, { taskId: props.taskId }),
    taskListId: selectListIdByTaskId(state, { taskId: props.taskId }),
    spaceIds: selectSortedAvailableVisibleSpacesIds(state),
    spaceNames: selectProjectNames(state),
    spacesSections: selectProjectsListIds(state),
    listNames: selectListNames(state),
    listsIsArchivedStatuses: selectListIsArchivedStatuses(state),
    taskIdsOrderByListIds: selectTasksOrderByList(state),
  })


  const mapDispatchToProps = (dispatch, props) => ({
    onFetchProjectListsAndTasksData: (spaceId) => dispatch(onFetchProjectListsAndTasksData(spaceId)),
    onMoveTaskInSections: ({
      taskId,
      sourceListTaskIndex,
      destinationListTaskIndex,
      sourceListId,
      destinationListId,
      destinationProjectId,
    }) => dispatch(onMoveTaskInSections(taskId, sourceListTaskIndex, destinationListTaskIndex, sourceListId, destinationListId, destinationProjectId)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMoveCardModal)
}

export default enhance
