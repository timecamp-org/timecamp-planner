import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';

import DesktopAppController from 'common/utils/desktopAppController';
import PureBaseComponent from 'commonEnhancers/PureBaseComponent';
import EnhanceWithRouter from 'enhancers/EnhanceWithRouter';
import defaultFavicon from 'favicons/default.png';
import unreadMessagesFavicon from 'favicons/unreadMessages.png';
import unreadNotificationsFavicon from 'favicons/unreadNotifications.png';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { selectOpenedCardDetailsModalId } from 'models/domain/AppModel/selectors';
import { selectEntityType } from 'models/domain/EntityModel/selectors';
import { EntityType } from 'models/domain/EntityModel/types';
import {
  selectChatUnreadNotificationsCounter,
  selectSpacesHaveUnreadMessages,
} from 'models/domain/NotificationsModel/selectors';
import { onSwitchOrganization } from 'models/domain/OrganizationsModel/actions';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  selectConversationName,
  selectProjectIdByObjectId,
  selectProjectName,
} from 'models/domain/ProjectsModel/selectors';
import { selectTaskName } from 'models/domain/TasksModel/selectors';

function enhance(Component) {
  class EnhanceTabController extends PureBaseComponent {
    static propTypes = {
      unreadNotificationsCounter: PropTypes.number.isRequired,
      spacesHaveUnreadMessages: PropTypes.bool.isRequired,
    };

    render() {
      return <Component iconUrl={this.getIcon()} />;
    }

    hasUnreadNotifications() {
      return this.props.unreadNotificationsCounter > 0;
    }

    getIcon() {
      if (this.hasUnreadNotifications()) {
        return unreadNotificationsFavicon;
      }

      if (this.props.spacesHaveUnreadMessages) {
        return unreadMessagesFavicon;
      }

      return defaultFavicon;
    }

    componentDidMount() {
      this.updateTabTitle();
      DesktopAppController.addOnPushNotificationClickListener(this.onPushNotificationClick);
    }

    componentWillUnmount() {
      DesktopAppController.removeOnPushNotificationClickListener(this.onPushNotificationClick);
    }

    componentDidUpdate() {
      this.updateTabTitle();
      this.updateTray();
    }

    onPushNotificationClick(event, data) {
      if (!data.url) {
        return;
      }

      const { url, push } = data;
      if (push.organizationId && push.organizationId !== this.props.currentOrganizationId) {
        this.props.onSwitchOrganization(push.organizationId);
      }

      const querySearch = queryString.extract(url);
      const { taskId } = queryString.parse(querySearch);

      if (taskId) {
        this.props.onOpenCardDetailsModal(taskId);
      } else {
        this.props.onCloseCardDetailsModal();
        this.props.history.push(url);
      }
    }

    updateTabTitle() {
      let title = 'Planner';
      const { entityType, projectName, taskName, conversationName } = this.props;
      switch (entityType) {
        case EntityType.PROJECT_DATA: {
          const name = projectName || conversationName;
          if (name) {
            title = `${name} | ${title}`;
          }
          if (taskName) {
            title = `${taskName} | ${title}`;
          }
          break;
        }
        default: // ok
      }

      document.title = title;
    }

    updateTray() {
      const hasUnreadNotifications = this.hasUnreadNotifications();
      const { spacesHaveUnreadMessages } = this.props;
      DesktopAppController.updateTray(hasUnreadNotifications, spacesHaveUnreadMessages);
    }
  }

  const mapStateToProps = (state, props) => {
    const objectId = props.location.pathname.split('/')[2];
    const projectId = selectProjectIdByObjectId(state, { objectId });
    const taskId = selectOpenedCardDetailsModalId(state);

    return {
      unreadNotificationsCounter: selectChatUnreadNotificationsCounter(state),
      spacesHaveUnreadMessages: selectSpacesHaveUnreadMessages(state),
      objectId,
      projectId,
      projectName: selectProjectName(state, { projectId }),
      conversationName: selectConversationName(state, {
        conversationId: objectId,
      }),
      taskName: selectTaskName(state, { taskId }),
      entityType: selectEntityType(state, { entityId: projectId }),
      currentOrganizationId: selectCurrentOrganizationId(state),
    };
  };

  function mapDispatchToProps(dispatch) {
    return {
      onOpenCardDetailsModal: (taskId) => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(taskId)),
      onCloseCardDetailsModal: () => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(null)),
      onSwitchOrganization: (organizationId) => dispatch(onSwitchOrganization(organizationId)),
    };
  }

  return EnhanceWithRouter()(connect(mapStateToProps, mapDispatchToProps)(EnhanceTabController));
}

export default enhance;
