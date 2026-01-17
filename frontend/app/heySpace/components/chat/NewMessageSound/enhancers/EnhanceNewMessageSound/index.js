import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isNotificationVisible } from "models/domain/NotificationsModel/utils";
import { chatNotificationTypes } from "models/domain/NotificationsModel/types";
import newMessageSound from "components/App/assets/newMessage.mp3";
import newNotificationSound from "components/App/assets/newNotification.mp3";

import BaseComponent from "commonEnhancers/BaseComponent";

import {
  selectIsUserIdle,
  selectIsPageVisible,
} from "models/domain/AppModel/selectors";
import { selectProjectIdByObjectId } from "models/domain/ProjectsModel/selectors";
import { selectCurrentUserAccessibleProjectIds } from "models/domain/ProjectsModel/selectors/accessSelectors";
import { selectEntityTypes } from "models/domain/EntityModel/selectors";
import { EntityType } from "models/domain/EntityModel/types";
import { selectCurrentOrganizationId } from "models/domain/OrganizationsModel/selectors/domain";
import { selectEnableSoundNotifications } from "models/domain/NotificationsModel/selectors/domain";
import { doNothing } from "../../../../../../common/utils";

function enhance(ComposedComponent) {
  class EnhanceNewMessageSound extends BaseComponent {
    constructor(props) {
      super(props);
      this.newMessageSound = new Audio(newMessageSound);
      this.newNotificationSound = new Audio(newNotificationSound);
    }

    static propTypes = {
      currentUserId: PropTypes.string,
      isUserIdle: PropTypes.bool.isRequired,
    };

    state = {
      isWindowFocused: false,
    };

    render() {
      return <ComposedComponent />;
    }

    // we have to use dispatched customEvent because when user is scrolled to the bottom of chat, even when app is not focused, info about new messages won't show in unreadNotifications as we mark it as read instantly
    onNewNotificationCreated(event) {
      if (!event.detail || !event.detail.notification) {
        return null;
      }
      const { notification, externalData } = event.detail;

      if (!this.shouldPlaySound(notification)) {
        return null;
      }

      if (chatNotificationTypes.includes(notification.type)) {
        if (this.props.projectIdWithOpenChat === notification.containerId) {
          if (this.props.isUserIdle || !this.props.isPageVisible) {
            return this.newMessageSound.play().catch(doNothing);
          } else {
            return null;
          }
        } else {
          return this.newMessageSound.play().catch(doNothing);
        }
      } else if (isNotificationVisible(notification, externalData)) {
        return this.newNotificationSound.play().catch(doNothing);
      } else {
        return null;
      }
    }

    shouldPlaySound(notification) {
      if (
        this.props.currentOrganizationId !== notification.organizationId ||
        !this.props.enableSoundNotifications
      ) {
        return false;
      }
      const objectId = notification.containerId;
      let hasAccessToNotification = true;
      const isProject =
        objectId &&
        this.props.entityTypes.get(objectId) === EntityType.PROJECT_DATA;

      if (isProject && !this.props.accessibleProjectIds.includes(objectId)) {
        hasAccessToNotification = false;
      }

      return hasAccessToNotification;
    }

    shouldComponentUpdate() {
      return false;
    }

    componentDidMount() {
      document.addEventListener(
        "newNotificationCreated",
        this.onNewNotificationCreated
      );
    }

    componentWillUnmount() {
      document.removeEventListener(
        "newNotificationCreated",
        this.onNewNotificationCreated
      );
    }
  }

  const mapSateToProps = (state, props) => {
    const { pathname } = props.location;

    const projectIdMatches = pathname.match(/\/projects\/(.+)\/chat/);
    let projectIdWithOpenChat = projectIdMatches ? projectIdMatches[1] : null;

    if (!projectIdWithOpenChat) {
      const conversationIdMatches = pathname.match(
        /\/conversations\/(.+)\/chat/
      );
      const conversationId = conversationIdMatches
        ? conversationIdMatches[1]
        : null;
      projectIdWithOpenChat = selectProjectIdByObjectId(state, {
        objectId: conversationId,
      });
    }

    return {
      projectIdWithOpenChat,
      currentOrganizationId: selectCurrentOrganizationId(state),
      isUserIdle: selectIsUserIdle(state),
      isPageVisible: selectIsPageVisible(state),
      accessibleProjectIds: selectCurrentUserAccessibleProjectIds(state),
      enableSoundNotifications: selectEnableSoundNotifications(state),
      entityTypes: selectEntityTypes(state),
    };
  };

  return connect(mapSateToProps, null)(EnhanceNewMessageSound);
}

export default enhance;
