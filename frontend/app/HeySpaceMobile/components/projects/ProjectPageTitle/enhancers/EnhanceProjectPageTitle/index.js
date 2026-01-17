import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMappedNavigationParams } from 'react-navigation-props-mapper';

import BaseComponent from 'BaseComponent';
import { selectProjectName, selectProjectIdByConversationId } from 'models/domain/ProjectsModel/selectors';
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain';
import { selectHasAccessToTask, selectProjectIdByTaskId } from 'models/domain/TasksModel/selectors';
import { selectProjectIdByListId } from 'models/domain/ListsModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';
import { getTaskDetails } from 'models/domain/RequestModel/constants/requestTypes';

function enhance(ComposedComponent) {
  class EnhanceProjectPageTitle extends BaseComponent {
    static propTypes = {
      navigation: PropTypes.shape({
        state: PropTypes.shape({
          params: PropTypes.shape({
            projectId: PropTypes.string,
            taskId: PropTypes.string,
            listId: PropTypes.string,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    };

    render() {
      return (
        <ComposedComponent
          spaceName={this.props.spaceName}
          conversationId={this.props.conversationId}
          projectId={this.props.projectId}
          conversationWithUserId={this.props.conversationWithUserId}
        />
      );
    }
  }

  const mapStateToProps = (state, props) => {
    let projectId = props.spaceId || props.projectId;
    const conversationId = props.conversationId;

    if (conversationId) {
      projectId = selectProjectIdByConversationId(state, { conversationId });
    }

    if (!projectId && props.taskId) {
      projectId = selectProjectIdByTaskId(state, { taskId: props.taskId });
    }

    if (!projectId && props.listId) {
      projectId = selectProjectIdByListId(state, { listId: props.listId });
    }

    if (conversationId) {
      const currentUserId = selectCurrentUserId(state);
      const projectPeople = selectProjectPeople(state, { projectId });

      if (projectPeople.size > 2) {
        return {
          conversationId,
        };
      } else if (projectPeople.size === 2) {
        return {
          conversationWithUserId: projectPeople.filterNot((userId) => userId === currentUserId).first(),
        };
      } else {
        return {
          conversationWithUserId: projectPeople.first(),
        };
      }
    } else {
      if (props.taskId) {
        const hasAccessToTask = selectHasAccessToTask(state, { taskId: props.taskId });
        const isTaskLoaded = selectRequestIsSuccess(state, { requestType: getTaskDetails, objectId: props.taskId });

        return {
          spaceName: isTaskLoaded ? (hasAccessToTask ? selectProjectName(state, { projectId }) : 'Forbidden') : '',
        };
      } else {
        return {
          spaceName: selectProjectName(state, { projectId }) || 'Project name not set',
        };
      }
    }
  };

  return withMappedNavigationParams()(connect(mapStateToProps)(EnhanceProjectPageTitle));
}

export default enhance;
