import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { selectListIdByTaskId, selectProjectsListIds } from 'models/domain/ListsModel/selectors'
import { selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors'
import { selectSpacePickerItemsData } from 'models/domain/ProjectsModel/selectors/spacePickerMobile'
import { selectTasksOrderByList, selectListIsArchivedStatuses, selectListNames } from 'models/domain/ListsModel/selectors/domain'
import { onMoveTaskInSections } from 'models/domain/TasksModel/actions'
import { onFetchProjectListsAndTasksData } from 'models/domain/RequestModel/actions'
import { List } from 'immutable'
import get from 'lodash/get'
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
        listPickerOptions: this.getListPickerOptions(props.taskSpaceId, props.spacesSections),
        listTaskIdsInOrder,
        // user readable, first item is at position 1, not 0
        cardPosition: taskIdIndex !== -1 ? taskIdIndex + 1 : 1,
      }
    }

    render() {
      return (
        <ComposedComponent
          isVisible={this.props.isVisible}
          taskId={this.props.taskId}
          spacePickerOptions={this.props.spacePickerOptions}
          selectedSpaceId={this.state.selectedSpaceId}
          listPickerOptions={this.state.listPickerOptions}
          selectedListId={this.state.selectedListId}
          cardPosition={this.state.cardPosition}

          onIncrementCardPosition={this.onIncrementCardPosition}
          onDecrementCardPosition={this.onDecrementCardPosition}
          onSelectSpaceId={this.onSelectSpaceId}
          onSelectListId={this.onSelectListId}
          onSubmit={this.onSubmit}
          onClose={this.props.onClose}
        />
      )
    }

    setInitialData(props) {
      this.props.onFetchProjectListsAndTasksData(props.taskSpaceId)
      const listTaskIdsInOrder = this.getListTaskIdsInOrder(props.taskIdsOrderByListIds, props.taskListId)
      const taskIdIndex = listTaskIdsInOrder.indexOf(props.taskId)

      this.setState({
        selectedSpaceId: props.taskSpaceId,
        selectedListId: props.taskListId,
        listPickerOptions: this.getListPickerOptions(props.taskSpaceId, props.spacesSections),
        listTaskIdsInOrder,
        // user readable, first item is at position 1, not 0
        cardPosition: taskIdIndex !== -1 ? taskIdIndex + 1 : 1,
      })
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

    getListPickerOptions(selectedSpaceId, spacesSections = this.props.spacesSections) {
      const spaceListIds = spacesSections.get(selectedSpaceId) || []
      return spaceListIds
        .reduce((result, listId) => {
          if (!this.props.listsIsArchivedStatuses.get(listId)) {
            return result.concat({ label: this.props.listNames.get(listId), value: listId, key: listId })
          } else {
            return result
          }
        }, [])
    }

    onSelectSpaceId(selectedSpaceId) {
      this.props.onFetchProjectListsAndTasksData(selectedSpaceId)
      const listPickerOptions = this.getListPickerOptions(selectedSpaceId)
      const selectedListId = get(listPickerOptions, '[0].value')
      const listTaskIdsInOrder = this.getListTaskIdsInOrder(this.props.taskIdsOrderByListIds, selectedListId)
      this.setState({
        selectedSpaceId,
        listPickerOptions,
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

    onSubmit() {
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
        const listPickerOptions = this.getListPickerOptions(this.state.selectedSpaceId, this.props.spacesSections)
        const selectedListId = get(listPickerOptions, '[0].value')
        const listTaskIdsInOrder = this.getListTaskIdsInOrder(this.props.taskIdsOrderByListIds, selectedListId)
        this.setState({
          listPickerOptions,
          selectedListId,
          listTaskIdsInOrder,
          cardPosition: 1,
        })
      } else if (!prevProps.isVisible && this.props.isVisible) {
        this.setInitialData(this.props)
      }
    }

  }

  const mapStateToProps = (state, props) => ({
    taskSpaceId: selectProjectIdByTaskId(state, { taskId: props.taskId }),
    taskListId: selectListIdByTaskId(state, { taskId: props.taskId }),
    spacePickerOptions: selectSpacePickerItemsData(state),
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
