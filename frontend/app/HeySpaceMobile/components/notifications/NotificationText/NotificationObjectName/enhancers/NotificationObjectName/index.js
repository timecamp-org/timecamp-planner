import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as AppModelActions from 'models/domain/AppModel/actions';
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions';
import {
  selectProjectName,
  selectProjectIsGroupOrDirectChat,
  selectConversationName,
  selectHasAccessToProject,
} from 'models/domain/ProjectsModel/selectors';
import { selectTaskName, selectHasAccessToTask } from 'models/domain/TasksModel/selectors';
import { selectListName, selectHasAccessToList } from 'models/domain/ListsModel/selectors';
import { selectEntityType } from 'models/domain/EntityModel/selectors';
import { EntityType } from 'models/domain/EntityModel/types';
import RouteName from '../../../../../AppNavigation/routeNames';

import BaseComponent from 'BaseComponent';
import { NavigationService } from 'common/services';

function Enhance(ComposedComponent) {
  class NotificationObjectName extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      objectValue: PropTypes.string,
    };

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          objectValue={this.props.objectValue}
          onClick={this.onClick}
          isSection={this.props.isSection}
        />
      );
    }

    onClick(event) {
      if (this.props.hasAccess) {
        switch (this.props.entityType) {
          case EntityType.TASK_DATA:
            return this.onTaskClick(event);
          case EntityType.PROJECT_DATA:
            return this.onProjectClick(event);
          default:
            return null;
        }
      } else {
        return null;
      }
    }

    onTaskClick() {
      if (!this.props.isSection) {
        NavigationService.navigate(RouteName.CARD_DETAILS, { taskId: this.props.objectId });
      }
    }

    onProjectClick() {
      NavigationService.navigate(RouteName.PROJECT, { projectId: this.props.objectId });
    }
  }

  const mapStateToProps = (state, props) => {
    const entityType = selectEntityType(state, { entityId: props.objectId });
    const { objectValue } = props;
    let newObjectValue;
    let hasAccess = true;
    switch (entityType) {
      case EntityType.PROJECT_DATA: {
        hasAccess = selectHasAccessToProject(state, { projectId: props.objectId });
        if (hasAccess) {
          const isProjectGroupOrDirectChat = selectProjectIsGroupOrDirectChat(state, { projectId: props.objectId });
          if (isProjectGroupOrDirectChat) {
            newObjectValue = selectConversationName(state, { conversationId: props.objectId });
            const maxCharacters = 200;
            if (newObjectValue && newObjectValue.length > maxCharacters) {
              newObjectValue = newObjectValue.substring(0, maxCharacters - 1).concat('...');
            }
          } else {
            newObjectValue = selectProjectName(state, { projectId: props.objectId });
          }
        } else {
          newObjectValue = 'private project';
        }
        break;
      }
      case EntityType.TASK_LIST: {
        hasAccess = selectHasAccessToList(state, { listId: props.objectId });
        newObjectValue = selectListName(state, { listId: props.objectId });
        break;
      }
      case EntityType.TASK_DATA: {
        hasAccess = selectHasAccessToTask(state, { taskId: props.objectId });
        newObjectValue = selectTaskName(state, { taskId: props.objectId });
        break;
      }
      default:
        break;
    }

    return {
      hasAccess,
      isSection: entityType === EntityType.TASK_LIST,
      objectValue: newObjectValue || objectValue,
      entityType,
      listName: selectListName(state, { listId: props.objectId }),
      taskName: selectTaskName(state, { taskId: props.objectId }),
    };
  };

  const mapDispatchToProps = (dispatch, props) => ({
    onOpenCardDetailsModal: (objectId) => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(objectId)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(NotificationObjectName);
}

export default Enhance;
