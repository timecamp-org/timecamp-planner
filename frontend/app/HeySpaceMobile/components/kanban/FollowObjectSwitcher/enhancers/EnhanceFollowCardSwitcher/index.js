import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BaseComponent from 'BaseComponent';

import {
  selectProjectIdByListId,
  selectIsCurrentUserListFollower,
  selectListIdByTaskId,
} from 'models/domain/ListsModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { selectIsCurrentUserProjectFollower } from 'models/domain/ProjectsModel/selectors';
import {
  selectIsCurrentUserTaskFollower,
  selectTaskColor,
  selectIsCurrentUserAssignedToTask,
} from '../../../../../../common/models/domain/TasksModel/selectors';
import {
  onAddUserToTaskFollowers,
  onRemoveUserFromTaskFollowers,
} from '../../../../../../common/models/domain/TasksModel/actions';

function Enhance(ComposedComponent) {
  class EnhanceFollowCardSwitcher extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      taskId: PropTypes.string.isRequired,

      isCurrentUserFollowingCard: PropTypes.bool.isRequired,
      isCurrentUserFollowingList: PropTypes.bool.isRequired,
      isCurrentUserFollowingSpace: PropTypes.bool.isRequired,
      isCurrentUserAssignedToTask: PropTypes.bool.isRequired,

      onStartFollowing: PropTypes.func.isRequired,
      onStopFollowing: PropTypes.func.isRequired,
    };

    state = {
      value: this.getValue(),
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.value}
          isDisabled={
            this.props.isCurrentUserFollowingList ||
            this.props.isCurrentUserFollowingSpace ||
            this.props.isCurrentUserAssignedToTask
          }
          color={this.props.taskColor}
          getLabel={this.getLabel}
          onValueChange={this.onValueChange}
        />
      );
    }

    getLabel() {
      if (!this.getValue()) {
        return 'Follow Task';
      } else if (this.props.isCurrentUserFollowingSpace) {
        return 'Following Project';
      } else if (this.props.isCurrentUserFollowingList) {
        return 'Following List';
      } else {
        return 'Following Task';
      }
    }

    getValue() {
      return (
        this.props.isCurrentUserFollowingList ||
        this.props.isCurrentUserFollowingSpace ||
        this.props.isCurrentUserFollowingCard
      );
    }

    onValueChange(value) {
      this.setState({ value });
      if (value) {
        this.props.onStartFollowing(this.props.currentUserId);
      } else {
        this.props.onStopFollowing(this.props.currentUserId);
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByListId(state, { taskId: props.taskId });
    const listId = selectListIdByTaskId(state, { taskId: props.taskId });
    return {
      taskColor: selectTaskColor(state, { taskId: props.taskId }),
      currentUserId: selectCurrentUserId(state),
      isCurrentUserFollowingCard: selectIsCurrentUserTaskFollower(state, { taskId: props.taskId }),
      isCurrentUserFollowingList: selectIsCurrentUserListFollower(state, { listId }),
      isCurrentUserFollowingSpace: selectIsCurrentUserProjectFollower(state, { projectId }),
      isCurrentUserAssignedToTask: selectIsCurrentUserAssignedToTask(state, { taskId: props.taskId }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onStartFollowing: (currentUserId) => dispatch(onAddUserToTaskFollowers(props.taskId, currentUserId)),
    onStopFollowing: (currentUserId) => dispatch(onRemoveUserFromTaskFollowers(props.taskId, currentUserId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceFollowCardSwitcher);
}

export default Enhance;
