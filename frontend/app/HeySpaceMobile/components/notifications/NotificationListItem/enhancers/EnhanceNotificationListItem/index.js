import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import createRouteFromNotification from 'common/utils/createRouteFromNotification';
import RouteName from '../../../../AppNavigation/routeNames';

import * as NotificationsModelSelectors from 'models/domain/NotificationsModel/selectors';
import * as NotificationsModelActions from 'models/domain/NotificationsModel/actions';
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions';
import { selectIsCurrentUserInProject, selectHasAccessToProject } from 'models/domain/ProjectsModel/selectors';
import { HumanMessage } from 'models/domain/HumanMessageModel/model';
import { HumanMessageKinds } from 'models/domain/HumanMessageModel/types';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { selectHasAccessToTask } from 'models/domain/TasksModel/selectors';
import { i18n } from 'common/i18n';

import BaseComponent from 'BaseComponent';
import { NavigationService, UserTracker } from 'common/services';

function Enhance(ComposedComponent) {
  class EnhanceNotificationListItem extends BaseComponent {
    static propTypes = {
      className: PropTypes.string,
      notificationId: PropTypes.string.isRequired,
      creationTimestamp: PropTypes.number.isRequired,
      isArchived: PropTypes.bool.isRequired,
      isUnread: PropTypes.bool.isRequired,

      notificationLink: PropTypes.string,

      onReadNotification: PropTypes.func.isRequired,
      onClickNotificationLinkFailure: PropTypes.func.isRequired,
    };

    render() {
      return (
        <ComposedComponent
          className={this.props.className}
          notificationId={this.props.notificationId}
          notificationLink={this.props.notificationLink}
          creationTimestamp={this.props.creationTimestamp}
          isArchived={this.props.isArchived}
          isUnread={this.props.isUnread}
          onClick={this.onClick}
        />
      );
    }

    onClick() {
      UserTracker.track(UserTrackerEvent.notificationItem, { action: 'clicked' });
      if (this.props.isUnread) {
        this.props.onReadNotification();
      }

      if (this.props.notificationRoute) {
        if (this.props.hasAccessToProject) {
          if (this.props.taskId) {
            if (this.props.hasAccessToTask) {
              NavigationService.navigate(RouteName.CARD_DETAILS, {
                taskId: this.props.taskId,
                projectId: this.props.projectId,
                openCardComments: this.props.notificationRoute.openCardComments,
              });
            } else {
              this.onPermissionDenied('task');
            }
          } else {
            const { routeName, ...routeParams } = this.props.notificationRoute;
            NavigationService.navigate(routeName, routeParams);
          }
        } else {
          this.onPermissionDenied();
        }
      }
    }

    onPermissionDenied(objectName = 'project') {
      this.props.onClickNotificationLinkFailure(
        {
          humanMessage: HumanMessage({
            kind: HumanMessageKinds.warning,
            text: i18n.t(`You don't have necessary permision to access this {{objectName}}.`, { objectName }),
          }),
        },
        'space-permission-denied'
      );
    }
  }

  const mapStateToProps = (state, props) => {
    const notificationData = NotificationsModelSelectors.selectNotificationData(state, {
      notificationId: props.notificationId,
    });
    const notificationType = NotificationsModelSelectors.selectNotificationType(state, {
      notificationId: props.notificationId,
    });
    const projectId = notificationData.get('projectId');
    const taskId = notificationData.get('taskId');

    return {
      creationTimestamp: NotificationsModelSelectors.selectNotificationCreationTimestamp(state, {
        notificationId: props.notificationId,
      }),
      isArchived: NotificationsModelSelectors.selectNotificationIsArchived(state, {
        notificationId: props.notificationId,
      }),
      isUnread: NotificationsModelSelectors.selectNotificationIsUnread(state, { notificationId: props.notificationId }),
      notificationRoute: createRouteFromNotification({ notificationType, notificationData }),
      isCurrentUserInProject: selectIsCurrentUserInProject(state, { projectId }),
      projectId,
      taskId,
      hasAccessToProject: selectHasAccessToProject(state, { projectId }),
      hasAccessToTask: selectHasAccessToTask(state, { taskId }),
    };
  };

  function mapDispatchToProps(dispatch, props) {
    return {
      onReadNotification: () => dispatch(NotificationsModelActions.onReadNotification(props.notificationId)),
      onClickNotificationLinkFailure: (alert, id) => dispatch(PopUpAlertsModelActions.onAddAlert(alert, id)),
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceNotificationListItem);
}

export default Enhance;
