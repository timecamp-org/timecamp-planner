import { NotificationExternalData } from 'common/models/domain/NotificationsModel/models';

import createLinkFromNotification from './notifications/createLinkFromNotification';

//@ts-ignore
const { ipcRenderer, remote } = window.require ? window.require('electron') : {};

const { canShowForegroundWebNotification } = require('../../PushNotificationClient/utils');

const favIconTypes = {
  CLEAR: 'clear',
  UNREAD_NOTIFICATIONS: 'unreadNotifications',
  UNREAD_MESSAGES: 'unreadMessages',
};

class DesktopAppController {
  static isDesktopApp() {
    const isDesktopAppLegacy =
      typeof window !== 'undefined' &&
      typeof window.process === 'object' &&
      //@ts-ignore
      window.process.type === 'renderer' &&
      ipcRenderer;

    //@ts-ignore
    return isDesktopAppLegacy || window?.desktopAPI?.isInitialized();
  }

  static updateTray(hasUnreadNotifications = false, spacesHaveUnreadMessages = false) {
    if (this.isDesktopApp()) {
      let nextTray = null;
      //@ts-ignore
      if (this.currentTray !== favIconTypes.UNREAD_NOTIFICATIONS && hasUnreadNotifications) {
        nextTray = favIconTypes.UNREAD_NOTIFICATIONS;
        //@ts-ignore
      } else if (this.currentTray !== favIconTypes.UNREAD_MESSAGES && spacesHaveUnreadMessages) {
        nextTray = favIconTypes.UNREAD_MESSAGES;
        //@ts-ignore
      } else if (this.currentTray !== favIconTypes.CLEAR && !hasUnreadNotifications && !spacesHaveUnreadMessages) {
        nextTray = favIconTypes.CLEAR;
      }
      //@ts-ignore
      if (nextTray && this.currentTray !== nextTray) {
        ipcRenderer.send('updateTray', nextTray);
        //@ts-ignore
        this.currentTray = nextTray;
      }
    }
  }

  static sendPushNotification(activity) {
    if (this.isDesktopApp()) {
      const { title, content } = activity.pushNotification;
      const { data, organizationId } = activity;

      const url = createLinkFromNotification({
        notificationType: activity.notificationType,
        notificationData: new NotificationExternalData(data),
      });
      const canShowForegroundNotification = canShowForegroundWebNotification(activity);

      const push = {
        title,
        body: content,
        organizationId,
      };

      ipcRenderer.send('sendPushNotification', push, url, canShowForegroundNotification);
    }
  }

  static addOnPushNotificationClickListener(callback) {
    if (this.isDesktopApp()) {
      ipcRenderer.on('onPushNotificationClick', callback);
    }
  }

  static removeOnPushNotificationClickListener(callback) {
    if (this.isDesktopApp()) {
      ipcRenderer.removeListener('onPushNotificationClick', callback);
    }
  }

  static getJitsiUtils() {
    const currentWindow = remote.getCurrentWindow();

    return currentWindow?.jitsiMeetElectronUtils;
  }
}

export default DesktopAppController;
