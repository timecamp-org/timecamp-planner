import { Id } from '../../common/identifier';
import { QueryModifier } from '../../../../../services/types';
import {
  GetNotifcationInAppResult,
  GetPushNotifcationResult, NotificationType,
  PaginatedUserNotifications,
  PushNotificationDeviceResult,
  ReadNotificationsResult, UserOrganizationNotificationsResourceQueryParams,
} from '../types'
import { DeviceType, UnreadNotificationDbRow, UserLatestNotificationsDisplayFullDbRow } from '../../db/schema'

import { NotificationCenterType } from '../../dict/types'
import { Dict } from '../../common/types';

export interface NotificationServiceInterface {
  /**
   * @param {Id} userId
   * @param {Id} organizationId
   * @param query
   * @return {PromiseLike<Array<NotificationDbRow>>}
   */
  getNotificationsForUserInOrganization(
    userId: Id,
    organizationId: Id,
    isArchived: boolean,
    page: string,
    limit: number,
  ): PromiseLike<PaginatedUserNotifications>;

  /**
   * @param {Id} userId
   * @param {Id} organizationId
   * @param {UserOrganizationNotificationsResourceQueryParams} queryParams
   * @return {PromiseLike<Array<NotificationDbRow>>}
   */
  getFilteredNotificationsForUserInOrganization(
    userId: Id,
    organizationId: Id,
    queryParams: UserOrganizationNotificationsResourceQueryParams,
  ): Promise<any>;

  /**
   * @param {Id} userId
   * @param {Id} organizationId
   * @return {PromiseLike<Array<UnreadNotificationDbRow>>}
   */
  getUnreadNotificationsForUserInOrganization(userId: Id, organizationId: Id): PromiseLike<Array<UnreadNotificationDbRow>>;

  /**
   * @param {Id} userId
   * @return {PromiseLike<Array<UnreadNotificationDbRow>>}
   */
  getAllUnreadNotifications(userId: Id): PromiseLike<Array<UnreadNotificationDbRow>>;

  /**
   * @param {Id} userId
   * @param {Id} organizationId
   * @param {number} readAt
   * @param {NotificationType[]} notificationTypes
   * @return {PromiseLike<ReadNotificationsResult>}
   */
  readUnreadNotificationsForUserInOrganization(
    userId: Id,
    organizationId: Id,
    readAt: number,
    notificationTypes?: NotificationType[],
  ): PromiseLike<void>;

  readUnreadNotificationsForObjects(
    containerId: string[],
    modifier?: QueryModifier,
    readAt?: number,
    trx?: Transaction,
  ): PromiseLike<ReadNotificationsResult>;

  readUserUnreadNotificationsForObjects(
    containerIds: Id[],
    userId?: Id,
    readAt?: number,
    trx?: Transaction,
  ): PromiseLike<ReadNotificationsResult>

  /**
   * @param {Id} notificationId
   * @param {number} readAt
   * @param {boolean} isArchived
   * @return {PromiseLike<ReadNotificationsResult>}
   */
  updateNotification(notificationId: Id, readAt: number, isArchived: boolean): PromiseLike<ReadNotificationsResult>;

  /**
   * @param {Id} userId
   * @param {Id} deviceId
   * @return {PromiseLike<PushNotificationDeviceResult>}
   */
  addPushNotificationDevice(userId: Id, deviceId: Id, deviceType: DeviceType): PromiseLike<PushNotificationDeviceResult>;

  /**
   * @param {Id} userId
   * @param {Id} deviceId
   * @return {PromiseLike<PushNotificationDeviceResult>}
   */
  removePushNotificationDevice(userId: Id, deviceId: Id): PromiseLike<PushNotificationDeviceResult>;

  /**
   * Returns both `in-app` and `notification` for given id. They will be used
   * together most of the time so this makes perfect sense.
   *
   * @param {Id} id
   * @return {GetNotifcationInAppResult}
   */
  getInAppNotification(id: Id): PromiseLike<GetNotifcationInAppResult>;

  /**
   * Returns both `push` and `notification` for given id. They will be used
   * together most of the time so this makes perfect sense.
   *
   * @param {Id} id
   * @return {getPushNotification}
   */
  getPushNotification(id: Id): PromiseLike<GetPushNotifcationResult>;

  getUserHasAccessToProjectNotifications(userId: Id, projectId: Id): PromiseLike<boolean>

  filterUsersWithoutAccessToProjectNotifications(userIds: Id[], projectId: Id): PromiseLike<string[]>

  archiveUserInOrganizationNotifications(userId: Id, organizationId: Id, notificationTypesToArchive?: NotificationType[]): PromiseLike<void>

  publishArchiveUserInOrganizationNotificationsJob(userId: Id, organizationId: Id, notificationTypesToArchive?: NotificationType[]): PromiseLike<void>

  getUserInOrganizationLatestNotificationsDisplay(userId: Id, organizationId: Id, notificationCenterTypes: NotificationCenterType[]): PromiseLike<UserLatestNotificationsDisplayFullDbRow[]>

  getUserLatestAllNotificationsDisplay(userId: Id, notificationCenterTypes: NotificationCenterType[]): PromiseLike<Dict<UserLatestNotificationsDisplayFullDbRow[]>>

  saveUserInOrganizationLatestNotificationDisplay(userId: Id, organizationId: Id, notificationCenterType: NotificationCenterType, lastDisplayTime?: number): PromiseLike<any>

}
