import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cardOptionsEnum from '../../cardOptionsEnum';

import BaseComponent from 'BaseComponent';
import {
  onArchiveTask,
  onAddUserToTaskFollowers,
  onRemoveUserFromTaskFollowers,
} from 'common/models/domain/TasksModel/actions';
import { selectIsCurrentUserListFollower, selectListIdByTaskId } from 'common/models/domain/ListsModel/selectors';
import { selectIsCurrentUserProjectFollower } from 'common/models/domain/ProjectsModel/selectors';
import {
  selectIsCurrentUserTaskFollower,
  selectProjectIdByTaskId,
  selectTaskName,
  selectIsCurrentUserAssignedToTask,
} from 'common/models/domain/TasksModel/selectors';
import { selectCurrentUserId } from 'common/models/domain/UsersModel/selectors/domain';
import RouteName from '../../../../AppNavigation/routeNames';
import * as PopUpAlertsModelActions from 'common/models/component/PopUpAlertsModel/actions';
import { HumanMessage } from 'common/models/domain/HumanMessageModel/model';
import { HumanMessageKinds } from 'common/models/domain/HumanMessageModel/types';
import { NavigationService } from 'common/services';

function enhance(ComposedComponent) {
  class EnhanceCardDetailsOptionsActionSheet extends BaseComponent {
    static propTypes = {
      taskId: PropTypes.string.isRequired,

      projectId: PropTypes.string.isRequired,
      isCurrentUserFollowingCard: PropTypes.bool.isRequired,
      isCurrentUserFollowingList: PropTypes.bool.isRequired,
      isCurrentUserFollowingSpace: PropTypes.bool.isRequired,
      currentUserId: PropTypes.string.isRequired,
      onArchiveCard: PropTypes.func.isRequired,
      onFollowCard: PropTypes.func.isRequired,
      onUnfollowCard: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          isVisible={this.props.isVisible}
          isCurrentUserFollowingCard={this.props.isCurrentUserFollowingCard}
          isCurrentUserFollowingList={this.props.isCurrentUserFollowingList}
          isCurrentUserFollowingSpace={this.props.isCurrentUserFollowingSpace}
          isCurrentUserAssignedToTask={this.props.isCurrentUserAssignedToTask}
          onClose={this.props.onClose}
          onSelectOption={this.onSelectOption}
        />
      );
    }

    onSelectOption(option) {
      switch (option) {
        case cardOptionsEnum.ARCHIVE_CARD: {
          this.props.onArchiveCard();
          this.props.onClose();
          NavigationService.navigate(RouteName.PROJECT, { projectId: this.props.projectId });
          this.props.onAddAlert(`You've successfully archived task: ${this.props.cardName}`);
          break;
        }

        case cardOptionsEnum.FOLLOW_CARD: {
          if (this.props.isCurrentUserFollowingCard) {
            this.props.onUnfollowCard(this.props.currentUserId);
          } else {
            this.props.onFollowCard(this.props.currentUserId);
          }
          this.props.onClose();
          break;
        }

        default: {
          break;
        }
      }
    }
  }

  const mapStateToProps = (state, props) => {
    const projectId = selectProjectIdByTaskId(state, { taskId: props.taskId });
    const listId = selectListIdByTaskId(state, { taskId: props.taskId });
    return {
      projectId,
      cardName: selectTaskName(state, { taskId: props.taskId }),
      currentUserId: selectCurrentUserId(state),
      isCurrentUserFollowingCard: selectIsCurrentUserTaskFollower(state, { taskId: props.taskId }),
      isCurrentUserFollowingList: selectIsCurrentUserListFollower(state, { listId }),
      isCurrentUserFollowingSpace: selectIsCurrentUserProjectFollower(state, { projectId }),
      isCurrentUserAssignedToTask: selectIsCurrentUserAssignedToTask(state, { taskId: props.taskId }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onArchiveCard: () => dispatch(onArchiveTask(props.taskId)),
    onFollowCard: (userId) => dispatch(onAddUserToTaskFollowers(props.taskId, userId)),
    onUnfollowCard: (userId) => dispatch(onRemoveUserFromTaskFollowers(props.taskId, userId)),
    onAddAlert: (message) =>
      dispatch(
        PopUpAlertsModelActions.onAddAlert(
          {
            humanMessage: HumanMessage({
              kind: HumanMessageKinds.success,
              text: message,
            }),
          },
          `task-${props.taskId}-archived`
        )
      ),
  });

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceCardDetailsOptionsActionSheet);
}

export default enhance;
