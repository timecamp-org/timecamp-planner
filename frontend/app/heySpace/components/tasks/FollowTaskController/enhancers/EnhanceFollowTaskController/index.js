import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BaseComponent from 'commonEnhancers/BaseComponent';
import { i18n } from 'i18n';

import * as TasksModelSelectors from 'models/domain/TasksModel/selectors';
import * as TasksModelActions from 'models/domain/TasksModel/actions';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { selectIsCurrentUserProjectFollower } from 'models/domain/ProjectsModel/selectors';
import * as ListsModelSelectors from 'models/domain/ListsModel/selectors';

function enhance(ComposedComponent) {
  class EnhanceFollowTaskController extends BaseComponent {
    static propTypes = {
      // needs
      objectId: PropTypes.string.isRequired,
      objectName: PropTypes.string,
      className: PropTypes.string,

      // uses/injects
      isTaskFollowed: PropTypes.bool.isRequired,
      isTaskParentListFollowed: PropTypes.bool.isRequired,
      isCurrentUserFollowingSpace: PropTypes.bool.isRequired,
      isCurrentUserAssignedToTask: PropTypes.bool.isRequired,
      currentUserId: PropTypes.string.isRequired,
      onStartFollowing: PropTypes.func.isRequired,
      onStopFollowing: PropTypes.func.isRequired,
    };

    state = {
      shouldRenderFollowingSwitcherInfoTooltip: false,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          color={this.props.color}
          isObjectFollowed={this.getIsObjectFollowed()}
          isDisabled={this.getIsDisabled()}
          objectName={this.props.objectName || 'task'}
          shouldRenderFollowingSwitcherInfoTooltip={this.state.shouldRenderFollowingSwitcherInfoTooltip}
          followingSwitcherInfoTooltipText={this.getFollowingSwitcherInfoTooltipText()}
          onMouseEnterFollowingController={this.onMouseEnterFollowingController}
          onMouseLeaveFollowingController={this.onMouseLeaveFollowingController}
          onClick={this.onClick}
        />
      );
    }

    getIsObjectFollowed() {
      return this.props.isTaskFollowed || this.props.isTaskParentListFollowed || this.props.isCurrentUserFollowingSpace;
    }

    getIsDisabled() {
      return (
        this.props.isTaskParentListFollowed ||
        this.props.isCurrentUserFollowingSpace ||
        this.props.isCurrentUserAssignedToTask
      );
    }

    getFollowingSwitcherInfoTooltipText() {
      if (this.props.isCurrentUserFollowingSpace) {
        return i18n.t(`You can't unfollow this task because you're following its parent project`);
      } else if (this.props.isTaskParentListFollowed) {
        return i18n.t(`You can't unfollow this task because you're following its parent section`);
      } else if (this.props.isCurrentUserAssignedToTask) {
        return i18n.t(`You can't unfollow this task because you're assigned to it`);
      } else {
        return ``;
      }
    }

    onMouseEnterFollowingController() {
      if (this.getIsDisabled()) {
        this.showTooltipTimeout = setTimeout(
          () =>
            this.setState({
              shouldRenderFollowingSwitcherInfoTooltip: true,
            }),
          500
        );
      }
    }

    onMouseLeaveFollowingController() {
      if (this.getIsDisabled()) {
        if (this.showTooltipTimeout) {
          clearTimeout(this.showTooltipTimeout);
        }

        this.setState({
          shouldRenderFollowingSwitcherInfoTooltip: false,
        });
      }
    }

    onClick() {
      const { currentUserId, isTaskFollowed, onStopFollowing, onStartFollowing } = this.props;

      if (this.getIsDisabled()) {
        // do nothing, if user is following project or list containing this task we don't let him unfollow it by hand
      } else {
        if (isTaskFollowed) {
          onStopFollowing(currentUserId);
        } else {
          onStartFollowing(currentUserId);
        }
      }
    }

    componentWillUnmount() {
      if (this.showTooltipTimeout) {
        clearTimeout(this.showTooltipTimeout);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const { objectId: taskId } = props;
    const projectId = TasksModelSelectors.selectProjectIdByTaskId(state, {
      taskId,
    });
    const taskParentListId = ListsModelSelectors.selectListIdByTaskId(state, {
      taskId,
    });

    return {
      isTaskFollowed: TasksModelSelectors.selectIsCurrentUserTaskFollower(state, { taskId: props.objectId }),
      isTaskParentListFollowed: ListsModelSelectors.selectIsCurrentUserListFollower(state, {
        listId: taskParentListId,
      }),
      isCurrentUserFollowingSpace: selectIsCurrentUserProjectFollower(state, {
        projectId,
      }),
      isCurrentUserAssignedToTask: TasksModelSelectors.selectIsCurrentUserAssignedToTask(state, {
        taskId: props.objectId,
      }),
      currentUserId: selectCurrentUserId(state),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onStartFollowing: (currentUserId) =>
      dispatch(TasksModelActions.onAddUserToTaskFollowers(props.objectId, currentUserId)),
    onStopFollowing: (currentUserId) =>
      dispatch(TasksModelActions.onRemoveUserFromTaskFollowers(props.objectId, currentUserId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceFollowTaskController);
}

export default enhance;
