import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import { selectTaskColor, selectHasAccessToTask } from 'models/domain/TasksModel/selectors'
import * as TasksActions from 'models/domain/TasksModel/actions'
import * as RequestTypes from 'models/domain/RequestModel/constants/requestTypes'
import { selectRequestIsLoadingInitially, selectRequestIsSuccess } from 'models/domain/RequestModel/selectors'
import tabTypes from '../../../../tasks/TaskNavigation/tabTypes'

import EnhanceWithRefreshData from 'common/enhancers/EnhanceWithRefreshData'
import RouteName from 'components/AppNavigation/routeNames'
import { AppEventEmitter } from 'common/services'
import { AppEventType } from 'common/types'
import { selectIsCardMoreOptionsActionSheetOpened } from '../../../../../../common/models/mobile/NavigationModel/selectors'
import * as NavigationModelActions from '../../../../../../common/models/mobile/NavigationModel/actions'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { NavigationService } from 'common/services'

function Enhance(ComposedComponent) {
  @EnhanceWithRefreshData({
    action: TasksActions.onFetchTaskDetails,
    paramsToInject: [
      { key: 'taskId' },
    ],
  })
  class EnhanceCardDetails extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,
      isCardMoreOptionsActionSheetOpened: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      hasAccessToTask: PropTypes.bool.isRequired,
      onSetIsCardMoreOptionsActionSheetOpened: PropTypes.func.isRequired,
    }

    state = {
      isAssignUserModalOpen: false,
      selectedTab: tabTypes.DETAILS,
    }

    render() {
      return (
        <ComposedComponent
          taskId={this.props.taskId}

          isCardMoreOptionsActionSheetOpened={this.props.isCardMoreOptionsActionSheetOpened}
          isAssignUserModalOpen={this.state.isAssignUserModalOpen}
          selectedTab={this.state.selectedTab}
          taskColor={this.props.taskColor}
          isLoading={this.props.isLoading}
          hasAccessToTask={this.props.hasAccessToTask}

          onToggleCardMoreOptionsActionSheet={this.onToggleCardMoreOptionsActionSheet}
          onChangeTab={this.onChangeTab}
          onOpenAssignUserModal={this.onOpenAssignUserModal}
          onCloseAssignUserModal={this.onCloseAssignUserModal}
          onNavigateToManageAssignees={this.onNavigateToManageAssignees}
        />
      )
    }

    onChangeTab(selectedTab) {
      this.setState({
        selectedTab,
      })
    }

    openCardComments() {
      this.onChangeTab(tabTypes.COMMENTS)
    }

    onOpenAssignUserModal() {
      this.setState({
        isAssignUserModalOpen: true,
      })
    }

    onCloseAssignUserModal() {
      this.setState({
        isAssignUserModalOpen: false,
      })
    }

    onNavigateToManageAssignees() {
      NavigationService.navigate(RouteName.MANAGE_CARD_ASSIGNEES, { taskId: this.props.taskId })
    }

    onToggleCardMoreOptionsActionSheet() {
      this.props.onSetIsCardMoreOptionsActionSheetOpened(!this.props.isCardMoreOptionsActionSheetOpened)
    }

    componentDidMount() {
      if (this.props.openCardComments) {
        this.openCardComments()
      }
      AppEventEmitter.on(AppEventType.OPEN_CARD_COMMENTS, this.openCardComments)
      if (!this.props.isTaskLoaded) {
        this.props.onFetchTaskDetails(this.props.taskId)
      }
    }

    componentWillUnmount() {
      AppEventEmitter.off(AppEventType.OPEN_CARD_COMMENTS, this.openCardComments)
    }

  }

  function mapStateToProps(state, props) {
    return {
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
      isTaskLoaded: selectRequestIsSuccess(state, { requestType: RequestTypes.getTaskDetails, objectId: props.taskId }),
      isLoading: selectRequestIsLoadingInitially(state, { requestType: RequestTypes.getTaskDetails, objectId: props.taskId }),
      isCardMoreOptionsActionSheetOpened: selectIsCardMoreOptionsActionSheetOpened(state),
      hasAccessToTask: selectHasAccessToTask(state, { taskId: props.taskId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onFetchTaskDetails: (taskId) => dispatch(TasksActions.onFetchTaskDetails(taskId)),
      onSetIsCardMoreOptionsActionSheetOpened: () => dispatch(NavigationModelActions.onSetIsCardMoreOptionsActionSheetOpened()),
    }
  }


  return withMappedNavigationParams()(connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDetails))
}

export default Enhance
