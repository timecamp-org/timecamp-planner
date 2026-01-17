import { boundClass } from 'autobind-decorator';
import { omit } from 'lodash';
import * as urllib from 'url-lib';
import { AppPlatform } from '../../../../app/common/models/domain/AppModel/types';
import { TimeEntryAction } from '../../../../app/common/models/domain/Timecamp/types';
import {
  GlobalSearchResource,
  GlobalSearchResponse,
  MessageSearchResponse,
} from '../../../../app/heySpace/components/common/GlobalSearch/types';
import { ProjectTemplateInterface } from '../../../../app/heySpace/components/menu/AddSpaceControllerNext/types';
import { AnyDict, Id } from '../types';
import HttpAgent from '../utils/HttpAgent';
import Errors from './Errors';
import { RestApiOptionsInterface } from './types';
import { jsonToString, processFetchErrorAndResponse } from './utils';

export * from './Errors';

const APPLICATION_JSON = 'application/json';

const defaultHeaders = {
  Accept: APPLICATION_JSON,
  'Content-Type': APPLICATION_JSON,
};

/**
 * Set of simple methods to communicate with REST API
 * TODO Implement timeout.
 */

interface Callback<R = any> {
  (error: any, result: R): void;
  cancel?(): void;
}

type Params<T> = {
  queryKey: [string, T];
};

@boundClass
export default class HeySpaceRestApiClient {
  private http: HttpAgent;
  public Errors = Errors;

  constructor(clientOptions: RestApiOptionsInterface) {
    const { endpoint } = clientOptions;
    this.http = new HttpAgent({ baseUrl: endpoint });
  }

  authenticateWithCookie(username: string, password: string, callback: Callback): void {
    this.http.request(
      'authenticate/password',
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({
          login: username,
          password: password,
          type: 'cookie',
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  authenticateToOpenIdWithCookie(token: string, callback: Callback): void {
    this.http.request(
      'authenticate/openId',
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({
          token,
          type: 'cookie',
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  authenticateToApple(token: string, callback: Callback): void {
    this.http.request(
      'authenticate/apple',
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({
          token,
          type: 'cookie',
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deauthenticate(callback: Callback): void {
    this.http.request(
      'deauthenticate',
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  registerWithPassword(
    userId: Id,
    email: string,
    password: string,
    firstName: string = '',
    lastName: string = '',
    timeZone: string,
    referrer: string ='',
    callback: Callback,
  ): void {
    this.http.request(
      `users/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          email,
          password,
          firstName,
          lastName,
          timeZone,
          referrer
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  registerWithOpenId(userId: Id, token: string, timeZone: string, callback: Callback): void {
    this.http.request(
      `users/${userId}/openId`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          token,
          timeZone,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  registerWithApple(
    userId: Id,
    token: string,
    timeZone: string,
    firstName: string,
    lastName: string,
    callback: Callback,
  ): void {
    this.http.request(
      `users/${userId}/apple`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          token,
          timeZone,
          firstName,
          lastName,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizations(callback: Callback): void {
    this.http.request(
      `users/self/organizations`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserOrganizationRoles(callback: Callback): void {
    this.http.request(
      `users/self/organizationRoles`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getCurrentUser(callback: Callback): void {
    this.http.request(
      'users/self',
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateCurrentUser(userInfo: AnyDict, callback: Callback): void {
    this.http.request(
      'users/self',
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(userInfo),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserOrganizationSubscriptions(callback: Callback): void {
    this.http.request(
      'users/self/organizationSubscriptions',
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteCurrentUser(callback: Callback): void {
    this.http.request(
      'users/self',
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserNotifications(organizationId: Id, queryParams: AnyDict, callback: Callback): void {
    const url = urllib.formatUrl(`users/self/${organizationId}/notifications`, queryParams);
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserUnreadNotifications(organizationId: Id, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/unreadNotifications`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserAllUnreadNotifications(callback: Callback): void {
    this.http.request(
      `users/self/unreadNotifications`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  readAllUserUnreadNotifications(
    organizationId: Id,
    readAt: number,
    notificationTypes: number[],
    callback: Callback,
  ): void {
    this.http.request(
      `users/self/${organizationId}/unreadNotifications`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({ readAt, notificationTypes }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  readObjectUserUnreadNotifications(
    organizationId: Id,
    containerType: string,
    containerId: Id,
    readAt: number,
    callback: Callback,
  ): void {
    this.http.request(
      `users/self/${organizationId}/${containerType}/${containerId}/unreadNotifications`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({ readAt }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  readNotification(organizationId: Id, notificationId: Id, readAt: number, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/unreadNotifications/${notificationId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({ readAt }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserLatestNotificationCenterDisplays(organizationId: Id, queryParams: AnyDict = {}, callback: Callback): void {
    this.http.request(
      urllib.formatUrl(`users/self/${organizationId}/latestNotificationDisplays`, queryParams),
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserLatestAllNotificationCenterDisplays(queryParams: AnyDict = {}, callback: Callback): void {
    this.http.request(
      urllib.formatUrl(`users/self/latestNotificationDisplays`, queryParams),
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateUserLatestNotificationCenterDisplayTime(
    organizationId: Id,
    notificationCenterType: string,
    lastDisplayTime: number,
    callback: Callback,
  ): void {
    this.http.request(
      `users/self/${organizationId}/latestNotificationDisplays`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({ notificationCenterType, lastDisplayTime }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateUserPushDevice(deviceId: Id, deviceType: string, callback: Callback): void {
    this.http.request(
      `users/self/pushDevices/${deviceId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({ deviceType }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteUserPushDevice(deviceId: Id, callback: Callback): void {
    this.http.request(
      `users/self/pushDevices/${deviceId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserProfile(organizationId: Id, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/profile`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateUserProfile(organizationId: Id, profile: AnyDict, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/profile`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        body: jsonToString(profile),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  resetPasswordForUserEmail(userEmail: string, callback: Callback): void {
    this.http.request(
      `users/${userEmail}/resetPassword`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  changePassword(currentPassword: string, newPassword: string, callback: Callback): void {
    this.http.request(
      `users/self/password`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({
          currentPassword,
          newPassword,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  changePasswordForToken(token: string, password: string, callback: Callback): void {
    this.http.request(
      `users/password/token`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({
          password,
          token,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  checkIfEmailExists(userEmail: string, callback: Callback): void {
    const url = `users/${userEmail}`;
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createOrganization(organizationId: Id, organization: AnyDict, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(organization),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateOrganization(organizationId: Id, organization: AnyDict, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(organization),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserOrganizationConversationsSettings(organizationId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/conversations/settings`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationViewData(organizationId: Id, callback: Callback): void {
    this.http.request(
      `_internal/organizations/${organizationId}/viewData`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getLatestActiveUserConversations(organizationId: Id, count: number, callback: Callback): void {
    this.http.request(
      `_internal/organizations/${organizationId}/latestActiveConversations?count=${count}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getBackgroundResources(organizationId: Id, callback: Callback): void {
    this.http.request(
      `_internal/organizations/${organizationId}/backgroundResources`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  setUserLatestTaskVisitDate(taskId: Id, visitedAt: number, userId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/latestVisit/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          visitedAt,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  sendUserFeedback(feedback: AnyDict, feedbackType: string, callback: Callback): void {
    this.http.request(
      `analytics/userFeedback`,
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({
          feedback,
          feedbackType,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserInitialData(localOrganizationId: Id, callback: Callback): void {
    this.http.request(
      `users/self/initialData/${localOrganizationId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getProjectsPersonalOrder(organizationId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/users/${userId}/projectsPersonalOrder`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserProjectSettings(userId: Id, projectId: Id, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/userProjectSettings`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  setUserProjectSettings(userId: Id, projectId: Id, projectSettings: AnyDict, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/userProjectSettings`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(projectSettings),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateProjectOrder(organizationId: Id, userId: Id, projectId: Id, order: number, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/users/${userId}/projectsPersonalOrder/${projectId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({
          order,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationPeople(organizationId: Id, callback: Callback): void {
    this.http.request(
      `v1.1/organizations/${organizationId}/people`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationProjects(organizationId: Id, organizationProjectsQueryParams: AnyDict, callback: Callback): void {
    const url = urllib.formatUrl(`organizations/${organizationId}/projects`, organizationProjectsQueryParams);
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationProjectsProple(organizationId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/projects/people`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationProjectsHaveUnreadMessages(organizationId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/projects/unreadMessages`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationProjectsGuestInProject(organizationId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/projects/guests`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  hideOldConversations(organizationId: Id, callback: Callback): void {
    const url = urllib.formatUrl(`v1.1/organizations/${organizationId}/hideOldConversations`);
    this.http.request(
      url,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  inviteUserToOrganization(organizationId: Id, userId: Id, email: string, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/people/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          email,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  resendInvitationToOrganization(organizationId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/people/${userId}/resendInvitation`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  generateInvitationLink(organizationId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/people/${userId}/generateInvitationLink`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  inviteUserToConversation(organizationId: Id, userId: Id, email: string, projectId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/conversations/${projectId}/people/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          email,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  inviteUsersToConversations(organizationId: Id, users: AnyDict[], callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/conversations/people`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          users,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  inviteGuestsToOrganization(organizationId: Id, guestMails: string[], projectIds: Id[], callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/people/inviteGuests`,
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({
          guestMails,
          projectIds,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteGuestFromAllSpaces(organizationId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/people/${userId}/deleteGuestFromAllSpaces`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationTags(organizationId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/tags`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationExtensions(
    organizationId: Id,
    organizationExtensionsQueryParams: AnyDict = {},
    callback: Callback,
  ): void {
    const url = urllib.formatUrl(`organizations/${organizationId}/extensions`, organizationExtensionsQueryParams);
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  cancelOrganizationSubscription(agentCode: string, organizationId: Id, callback: Callback): void {
    this.http.request(
      `subscription/${agentCode}/${organizationId}/cancel`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateExtensionStatusInOrganization(organizationId: Id, extensionId: Id, status: string, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/extensions/${extensionId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({ status }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getProject(projectId: Id, queryParams: AnyDict, callback: Callback): void {
    this.http.request(
      urllib.formatUrl(`v1.1/projects/${projectId}`, queryParams),
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createProject(projectId: Id, project: AnyDict, callback: Callback): void {
    this.http.request(
      `projects/${projectId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(project),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateProject(projectId: Id, project: AnyDict, callback: Callback): void {
    this.http.request(
      `projects/${projectId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(project),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addUserToProjectPeople(projectId: Id, userId: Id, role: string, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/people/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          role,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addUsersToProjectPeople(projectId: Id, peopleRole: string, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/people`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          people: peopleRole,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateProjectPeopleRole(projectId: Id, userId: Id, role: string, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/people/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          role,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeProjectPeopleRole(projectId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/people/${userId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addUserToProjectFollowers(projectId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/followers/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeProjectFollower(projectId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/followers/${userId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getProjectLists(projectId: Id, callback: Callback): void {
    this.http.request(
      `v1.1/projects/${projectId}/lists`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getConversationLists(projectId: Id, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/conversationLists`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getTasksOrderByLists(projectId: Id, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/tasksOrderByLists`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getProjectTasks(projectId: Id, filters: AnyDict = {}, callback: Callback): void {
    const url = urllib.formatUrl(`projects/${projectId}/tasks`, filters);
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getConversationTasks(projectId: Id, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/conversationTasks`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createList(listId: Id, list: AnyDict, callback: Callback): void {
    this.http.request(
      `lists/${listId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(list),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateList(listId: Id, list: AnyDict, callback: Callback): void {
    this.http.request(
      `lists/${listId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(list),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addUserToTaskListFollowers(listId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `lists/${listId}/followers/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeTaskListFollower(listId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `lists/${listId}/followers/${userId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getListTasks(listId: Id, callback: Callback): void {
    this.http.request(
      `lists/${listId}/tasks`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getTaskDetails(taskId: Id, callback: Callback): void {
    this.http.request(
      `_internal/tasks/${taskId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createTaskEstimates(taskId: string, estimate: AnyDict, callback: Callback): void {
    this.http.request(
      `v1.1/tasks/${taskId}/timeEstimates`,
      {
        method: 'POST',
        body: jsonToString(estimate),
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getTaskEstimates(taskId: Id, callback: Callback): void {
    this.http.request(
      `v1.1/tasks/${taskId}/timeEstimates`,
      { method: 'GET', headers: defaultHeaders, credentials: 'include' },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateTaskEstimates(taskId: Id, estimate: AnyDict, callback: Callback): void {
    this.http.request(
      `v1.1/tasks/${taskId}/timeEstimates`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(omit(estimate, ['createdAt', 'updatedAt'])),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteTaskEstimates(taskId: Id, callback: Callback): void {
    this.http.request(
      `v1.1/tasks/${taskId}/timeEstimates`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  copyListWithTasks(listId: Id, name: string, order: number, newListId: Id, callback: Callback): void {
    this.http.request(
      `lists/${listId}/copy`,
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({ name, order, newListId }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  moveAllTasksInList(sourceListId: Id, destinationListId: Id, callback: Callback): void {
    this.http.request(
      `lists/${sourceListId}/moveAllTasks`,
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({ destinationListId }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createTask(taskId: Id, task: AnyDict, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(task),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateTask(taskId: Id, task: AnyDict, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(task),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  copyTask(taskId: Id, name: string, order: number, newTaskId: Id, options: AnyDict, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/copy`,
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({ name, order, newTaskId, options }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  pingTask(taskId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/ping`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addUserToTaskPeople(taskId: Id, userId: Id, role: string, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/people/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          role,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateTaskPeopleRole(taskId: Id, userId: Id, role: string, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/people/${userId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({
          role,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeTaskPeopleRole(taskId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/people/${userId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addUserToTaskFollowers(taskId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/followers/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeTaskFollower(taskId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/followers/${userId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  attachTagToTask(taskId: Id, tagId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/tags/${tagId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  detachTagFromTask(taskId: Id, tagId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/tags/${tagId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addTaskAttachment(taskId: Id, fileId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/attachments/${fileId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeTaskAttachment(taskId: Id, fileId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/attachments/${fileId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getTaskChecklist(taskId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/checklist`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createChecklistItem(taskId: Id, checkListItemId: Id, checklistItem: AnyDict, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/checklist/${checkListItemId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(checklistItem),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateChecklistItem(taskId: Id, checklistItemId: Id, checklistItem: AnyDict, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/checklist/${checklistItemId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(checklistItem),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeChecklistItem(taskId: Id, checklistItemId: Id, callback: Callback): void {
    this.http.request(
      `tasks/${taskId}/checklist/${checklistItemId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addChecklistItemAssignee(checklistItemId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `checklists/${checklistItemId}/people/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeChecklistItemAssignee(checklistItemId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `checklists/${checklistItemId}/people/${userId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createTag(tagId: Id, tag: AnyDict, callback: Callback): void {
    this.http.request(
      `tags/${tagId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(tag),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateTag(tagId: Id, tag: AnyDict, callback: Callback): void {
    this.http.request(
      `tags/${tagId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(tag),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteTag(tagId: Id, callback: Callback): void {
    this.http.request(
      `tags/${tagId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getMessages(containerType: string, containerId: Id, page: number, limit: number = 20, callback: Callback): void {
    const url = urllib.formatUrl(`messages/${containerType}/${containerId}`, {
      page,
      limit,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  sendMessage(messageId: Id, message: AnyDict, callback: Callback): void {
    this.http.request(
      `messages/${messageId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(message),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateMessage(messageId: Id, message: AnyDict, callback: Callback): void {
    this.http.request(
      `messages/${messageId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(message),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addMessageReaction(messageId: Id, userId: Id, reactionId: Id, emojiCode: string, callback: Callback): void {
    this.http.request(
      `messages/${messageId}/reactions/${reactionId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString({
          userId,
          emojiCode,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeMessageReaction(messageId: Id, reactionId: Id, callback: Callback): void {
    this.http.request(
      `messages/${messageId}/reactions/${reactionId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeMessage(messageId: Id, callback: Callback): void {
    this.http.request(
      `messages/${messageId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getMessagesMetadata(containerType: string, containerId: Id, callback: Callback): void {
    this.http.request(
      `messages/${containerType}/${containerId}/metadata`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateMessageRead(containerType: string, containerId: Id, messageId: Id, callback: Callback): void {
    this.http.request(
      `messages/${containerType}/${containerId}/messageRead`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({
          messageId,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateMessageKeyPress(containerType: string, containerId: Id, keyPressTime: number, callback: Callback): void {
    this.http.request(
      `messages/${containerType}/${containerId}/messageKeyPress`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({
          keyPressTime,
        }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateNotification(notificationId: Id, notification: AnyDict, callback: Callback): void {
    this.http.request(
      `notifications/${notificationId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(notification),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  archiveUserInOrganizationNotifications(
    organizationId: Id,
    notificationTypesToArchive: number[],
    callback: Callback,
  ): void {
    this.http.request(
      `users/self/${organizationId}/notifications/archive`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({ notificationTypesToArchive }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getActivities(containerType: string, containerId: Id, page: string, limit: number = 20, callback: Callback): void {
    const url = urllib.formatUrl(`activities/${containerType}/${containerId}`, {
      page,
      limit,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createFile(fileId: Id, file: AnyDict, callback: Callback): void {
    this.http.request(
      `files/${fileId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        body: jsonToString(file),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeFile(fileId: Id, callback: Callback): void {
    this.http.request(
      `v1.1/files/${fileId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getProjectMessageBoard(
    projectId: Id,
    page: string,
    limit: number = 20,
    fetchAllUnreadMessages: boolean = false,
    callback: Callback,
  ): void {
    const url = urllib.formatUrl(`_internal/projects/${projectId}/messageBoard`, {
      page,
      limit,
      fetchAllUnreadMessages,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getTaskMessageBoard(
    taskId: Id,
    page: string,
    limit: number = 20,
    fetchAllUnreadMessages: boolean = false,
    callback: Callback,
  ): void {
    const url = urllib.formatUrl(`_internal/tasks/${taskId}/messageBoard`, {
      page,
      limit,
      fetchAllUnreadMessages,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getProjectViewData(projectId: Id, projectViewQueryParams: AnyDict = {}, callback: Callback): void {
    const url = urllib.formatUrl(`v1.1/_internal/projects/${projectId}/viewData`, projectViewQueryParams);
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getConversationViewData(
    currentOrganizationId: Id,
    userId: Id,
    conversationViewQueryParams: AnyDict = {},
    callback: Callback,
  ): void {
    const url = urllib.formatUrl(
      `_internal/conversationViewData/${currentOrganizationId}/${userId}`,
      conversationViewQueryParams,
    );
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getNotificationsSettings(organizationId: Id, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/notificationsDeliverySettings`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  authorizeFileUpload(name: string, size: number, organizationId: Id, callback: Callback): void {
    this.http.request(
      `files/signature`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({ name, size, organizationId }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateNotificationsSettings(organizationId: Id, settings: AnyDict, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/notificationsDeliverySettings`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(settings),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createWorkspace(organizationId: Id, organizationJson: AnyDict, callback: Callback): void {
    this.http.request(
      `v1.1/organizations/${organizationId}/workspace`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(organizationJson),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  setChatNotificationSettingsType(objectId: Id, chatNotificationSettingsType: AnyDict, callback: Callback): void {
    this.http.request(
      `users/self/${objectId}/chatNotificationSettings`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({ chatNotificationSettingsType }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  fetchChatNotificationSettingsTypes(callback: Callback): void {
    this.http.request(
      `users/self/chatNotificationSettings`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getExtensionRelation(extensionNamespace: string, targetType: string, targetId: Id, callback: Callback): void {
    this.http.request(
      `extension/${extensionNamespace}/${targetType}/${targetId}/relationData`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateExtensionRelation(
    extensionNamespace: string,
    relationName: string,
    relationData: AnyDict,
    callback: Callback,
  ): void {
    this.http.request(
      `extension/${extensionNamespace}/${relationName}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(relationData),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  fetchProjectFiles(containerId: Id, page: string, limit: number = 20, callback: Callback): void {
    const url = urllib.formatUrl(`_internal/projects/${containerId}/files`, {
      page,
      limit,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteExtensionRelation(
    extensionNamespace: string,
    relationName: string,
    relationData: AnyDict,
    callback: Callback,
  ): void {
    this.http.request(
      `extension/${extensionNamespace}/${relationName}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(relationData),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  fetchTaskFiles(containerId: Id, page: string, limit: number = 20, callback: Callback): void {
    const url = urllib.formatUrl(`_internal/tasks/${containerId}/files`, {
      page,
      limit,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getConversation(organizationId: Id, people: Id[], callback: Callback): void {
    const url = urllib.formatUrl(`projects/${organizationId}/conversation`, {
      people,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getLinkMetadata(targetUrl: string, callback: Callback): void {
    const url = urllib.formatUrl(`_internal/linkMetadata`, {
      targetUrl,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationTagsOverviewData(organizationId: Id, callback: Callback): void {
    this.http.request(
      `_internal/organizations/${organizationId}/tagsOverview`,
      {
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getAppVersion(appPlatform: AppPlatform, callback: Callback): void {
    this.http.request(
      `_internal/appVersion/${appPlatform}`,
      {
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateConversationVisibility(
    organizationId: Id,
    conversationHash: string,
    isVisible: boolean,
    callback: Callback,
  ): void {
    this.http.request(
      `organizations/${organizationId}/conversationByHash/${conversationHash}/settings`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({ conversationHash, isVisible }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteUserAvatar(callback: Callback): void {
    this.http.request(
      `users/self/deleteAvatar`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserLatestVisitedTasks(organizationId: Id, count, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/latestVisitedTasks?count=${count}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  checkoutSubscriptionPaymentPage(agent: string, subscriptionData: AnyDict, callback: Callback): void {
    this.http.request(
      `payment/${agent}`,
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString(subscriptionData),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getSubscriptionViewData(agent: string, organizationId: Id, callback: Callback): void {
    this.http.request(
      `subscription/${agent}/${organizationId}/viewData`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getSubscriptionInvoices(agent: string, organizationId: Id, callback: Callback): void {
    this.http.request(
      `subscription/${agent}/${organizationId}/invoices`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateSubscription(agent: string, organizationId: Id, subscriptionData: AnyDict, callback: Callback): void {
    this.http.request(
      `subscription/${agent}/${organizationId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(subscriptionData),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  downloadInvoice(agent: string, organizationId: Id, invoiceId: Id, callback: Callback): void {
    this.http.request(
      `subscription/${agent}/${organizationId}/invoice/${invoiceId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deactivateUserFromOrganization(organizationId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/people/deactivate/${userId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  reactivateUserFromOrganization(organizationId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/people/reactivate/${userId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateUserRole(organizationId: Id, userId: Id, role: string, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/people/${userId}/role`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({ role }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getArchivedProjectsViewData(organizationId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/archivedProjectsViewData`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getCustomFields(targetType: string, targetId: Id, callback: Callback): void {
    this.http.request(
      `customFields/${targetType}/${targetId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateCustomFields(targetType: string, targetId: Id, customFields: AnyDict, callback: Callback): void {
    this.http.request(
      `customFields/${targetType}/${targetId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString(customFields),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  authorizeOAuth2(
    redirectUri: string,
    clientId: Id,
    state: string,
    scope: string,
    responseType: string,
    callback: Callback,
  ): void {
    const url = urllib.formatUrl(`oauth/authorize`, {
      redirect_uri: redirectUri,
      client_id: clientId,
      state: state,
      scope: scope,
      response_type: responseType,
    });
    this.http.request(
      url,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOauthClientData(clientId: Id, callback: Callback): void {
    this.http.request(
      `oauth/client/${clientId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  regenerateOauthClientSecret(clientId: Id, callback: Callback): void {
    this.http.request(
      `oauth/client/${clientId}/regenerateSecret`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationUserStatuses(organizationId: Id, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/userStatuses`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  setUserStatus(organizationId: Id, userStatus: AnyDict, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/userStatus`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(userStatus),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteUserStatus(organizationId: Id, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/userStatus`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOAuth1AuthorizationExternalUrl(
    applicationName: string,
    organizationId: Id,
    apiKey: string,
    oauthSecret: string,
    pathToRedirectAfterAuthorization: string,
    callback: Callback,
  ): void {
    const url = urllib.formatUrl(`oauth1/authorizeUrl/${applicationName}`, {
      apiKey,
      secret: oauthSecret,
      pathToRedirectAfterAuthorization,
      organizationId,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  authorizeOAuth1(
    applicationName: string,
    organizationId: Id,
    oauthToken: string,
    oauthVerifier: string,
    callback: Callback,
  ): void {
    const url = urllib.formatUrl(`oauth1/authorize/${applicationName}`, {
      organizationId,
    });
    this.http.request(
      url,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({
          oauthToken,
          oauthVerifier,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deauthorizeOAuth1(applicationName: string, organizationId: Id, callback: Callback): void {
    const url = urllib.formatUrl(`oauth1/deauthorize/${applicationName}`, {
      organizationId,
    });
    this.http.request(
      url,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  startIntegration(extensionId: Id, organizationId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/integrations/${extensionId}`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  fetchOAuth1AuthorizedApplications(organizationId: Id, callback: Callback): void {
    const url = urllib.formatUrl(`oauth1/authorizedApplications`, {
      organizationId,
    });
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  fetchIntegrations(organizationId: Id, callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/integrations`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  confirmIntegrationsStatus(organizationId: Id, extensionIds: Id[], callback: Callback): void {
    this.http.request(
      `organizations/${organizationId}/integrations/confirm`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        body: jsonToString({ extensionIds }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  copySpace(projectId: Id, name: string, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/copy`,
      {
        method: 'POST',
        headers: defaultHeaders,
        body: jsonToString({ name }),
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  fetchExportedData(dataType: string, format: string, queryParams: AnyDict, callback: Callback): void {
    const url = urllib.formatUrl(`export/${dataType}/${format}`, queryParams);
    this.http.request(
      url,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  joinChatWithMe(invitationToken: string, callback: Callback): void {
    this.http.request(
      `chatWithMe/join/${invitationToken}`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getChatWithMeInvitationData(invitationToken: string, callback: Callback): void {
    this.http.request(
      `chatWithMe/data/${invitationToken}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createUserApp(appId: Id, app: AnyDict, callback: Callback): void {
    this.http.request(
      `apps/${appId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(app),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserApps(callback: Callback): void {
    this.http.request(
      `apps`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateUserApp(appId: Id, app: AnyDict, callback: Callback): void {
    this.http.request(
      `apps/${appId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(app),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteUserApp(appId: Id, callback: Callback): void {
    this.http.request(
      `apps/${appId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addUserAppCollaborator(appId: Id, userId: Id, role: string, callback: Callback): void {
    this.http.request(
      `apps/${appId}/people/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({ role }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  inviteUserAppCollaborator(appId: Id, email: string, role: string, callback: Callback): void {
    this.http.request(
      `apps/${appId}/people`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({ email, role }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeUserAppCollaborator(appId: Id, userId: Id, callback: Callback): void {
    this.http.request(
      `apps/${appId}/people/${userId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getUserInOrganizationJobStatuses(organizationId: Id, callback: Callback): void {
    this.http.request(
      `users/self/${organizationId}/jobStatuses`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createViewSettingsWithLinkedSettings(
    baseViewSettings: AnyDict,
    linkedViewSettings: AnyDict[],
    callback: Callback,
  ): void {
    this.http.request(
      `viewSettings`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({ baseViewSettings, linkedViewSettings }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getViewSettings(viewType: string, containerType: string, containerId: Id, callback: Callback): void {
    this.http.request(
      `viewSettings/${viewType}/${containerType}/${containerId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteViewSettings(viewType: string, containerType: string, containerId: Id, callback: Callback): void {
    this.http.request(
      `viewSettings/${viewType}/${containerType}/${containerId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateViewSettings(
    viewType: string,
    containerType: string,
    containerId: Id,
    viewSettings: AnyDict,
    callback: Callback,
  ): void {
    this.http.request(
      `viewSettings/${viewType}/${containerType}/${containerId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(viewSettings),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getViewSettingsById(viewSettingsId: Id, callback: Callback): void {
    this.http.request(
      `viewSettings/${viewSettingsId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteViewSettingsById(viewSettingsId: Id, callback: Callback): void {
    this.http.request(
      `viewSettings/${viewSettingsId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateViewSettingsById(viewSettingsId: Id, viewSettings: AnyDict, callback: Callback): void {
    this.http.request(
      `viewSettings/${viewSettingsId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(viewSettings),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createViewSettingsLink(viewSettingsId: Id, linkedViewSettingsId: Id, callback: Callback): void {
    this.http.request(
      `viewSettings/${viewSettingsId}/links`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({ linkedViewSettingsId }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteViewSettingsLink(viewSettingsId: Id, linkedViewSettingsId: Id, callback: Callback): void {
    this.http.request(
      `viewSettings/${viewSettingsId}/links/${linkedViewSettingsId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getPersonalProjectStructure(organizationId: Id, callback: Callback): void {
    this.http.request(
      `personalProjectStructure/${organizationId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createProjectGroup(projectsGroup: AnyDict, callback: Callback): void {
    this.http.request(
      `projectGroups`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(projectsGroup),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateProjectGroup(groupId: Id, projectsGroup: AnyDict, callback: Callback): void {
    this.http.request(
      `projectGroups/${groupId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(projectsGroup),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteProjectGroup(groupId: Id, callback: Callback): void {
    this.http.request(
      `projectGroups/${groupId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  moveProjectInStructure(organizationId: Id, projectId: Id, payload: AnyDict, callback: Callback): void {
    this.http.request(
      `personalProjectStructure/${organizationId}/${projectId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString(payload),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  setProjectLatestVisit(projectId, callback: Callback): void {
    this.http.request(
      `projects/${projectId}/latestVisit`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  async getUserInOrganizationSettings(params: Params<{ settingsType: string; organizationId: Id }>) {
    const [, { settingsType, organizationId }] = params.queryKey;

    return new Promise((resolve, reject) => {
      this.http.request(
        `v1.1/settings/userInOrganization/${organizationId}/${settingsType}`,
        {
          method: 'GET',
          headers: defaultHeaders,
          credentials: 'include',
        },
        (error, response) => {
          processFetchErrorAndResponse(error, response, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve(result);
          });
        },
      );
    });
  }

  async updateUserInOrganizationSettings(params: { settingsType: string; organizationId: Id; settings: AnyDict }) {
    const { settingsType, organizationId, settings } = params;

    return new Promise((resolve, reject) => {
      this.http.request(
        `v1.1/settings/userInOrganization/${organizationId}/${settingsType}`,
        {
          method: 'PUT',
          headers: defaultHeaders,
          credentials: 'include',
          body: jsonToString(settings),
        },
        (error, response) => {
          processFetchErrorAndResponse(error, response, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve(result);
          });
        },
      );
    });
  }

  getProjectFiles(projectId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/projects/${projectId}/attachments`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getScheduleData(organizationId: Id, callback: Callback): void {
    this.http.request(
      `v1.1/organizations/${organizationId}/schedule`,
      { method: 'GET', headers: defaultHeaders, credentials: 'include' },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationGroups(organizationId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/organizations/${organizationId}/groups`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getOrganizationGroupsPeople(organizationId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/organizations/${organizationId}/groups/people`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createOrganizationGroup(organizationId: Id, name: string, slug: string, callback?: Callback): void {
    this.http.request(
      `/v1.1/groups`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({
          organizationId,
          name,
          slug,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  updateOrganizationGroup(groupId: Id, name: string, slug: string, callback?: Callback): void {
    this.http.request(
      `/v1.1/groups/${groupId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({
          name,
          slug,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  deleteOrganizationGroup(groupId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/groups/${groupId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addUserToGroup(groupId: Id, userId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/groups/${groupId}/people/${userId}`,
      {
        method: 'PUT',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  removeUserFromGroup(groupId: Id, userId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/groups/${groupId}/people/${userId}`,
      {
        method: 'DELETE',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  createProjectFile(projectId: Id, fileId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/projects/${projectId}/files`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({
          fileId,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  saveTimecampApiToken(userInOrganizationId: Id, apiToken: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/customFields/user-in-organization/${userInOrganizationId}`,
      {
        method: 'PATCH',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({
          'timecamp.access_token': apiToken,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  setTimecampTimer(taskId: Id, timeEntryAction: TimeEntryAction, callback?: Callback): void {
    this.http.request(
      `/v1.1/timecamp/timer`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({
          taskId,
          action: timeEntryAction,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getHasUserTimecampIntegration(organizationId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/timecamp/token`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({
          organizationId,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  getTasksTimeEntries(taskId: Id, callback?: Callback): void {
    this.http.request(
      `/v1.1/timecamp/time-entries/${taskId}`,
      {
        method: 'GET',
        headers: defaultHeaders,
        credentials: 'include',
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  addTimeEntry(
    { taskId, date, duration, from, to }: { taskId: Id; duration?: number; from?: string; to?: string; date?: string },
    callback?: Callback,
  ): void {
    this.http.request(
      `/v1.1/timecamp/time-entries`,
      {
        method: 'POST',
        headers: defaultHeaders,
        credentials: 'include',
        body: jsonToString({
          taskId,
          date: date || from,
          duration,
          start: from,
          end: to,
        }),
      },
      (error, response) => {
        processFetchErrorAndResponse(error, response, callback);
      },
    );
  }

  async getTemplates(entityType = 'project') {
    return new Promise<ProjectTemplateInterface[]>((resolve, reject) => {
      this.http.request(
        `v1.1/templates/${entityType}`,
        {
          method: 'GET',
          headers: defaultHeaders,
          credentials: 'include',
        },
        (error, response) => {
          processFetchErrorAndResponse(error, response, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve(result);
          });
        },
      );
    });
  }

  async createTemplate({
    entityType = 'project',
    template,
    includeTasks,
  }: {
    entityType?: string;
    template: Partial<ProjectTemplateInterface>;
    includeTasks?: boolean;
  }) {
    return new Promise<ProjectTemplateInterface>((resolve, reject) => {
      this.http.request(
        `v1.1/templates/${entityType}?omitTasks=${!includeTasks}`,
        {
          method: 'Post',
          headers: defaultHeaders,
          credentials: 'include',
          body: jsonToString(template),
        },
        (error, response) => {
          processFetchErrorAndResponse(error, response, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve(result);
          });
        },
      );
    });
  }

  async createProjectFromTemplate({
    entityType = 'project',
    templateId,
    project,
    shouldCreateTasks,
  }: {
    entityType?: string;
    templateId: string;
    project: AnyDict;
    shouldCreateTasks?: boolean;
  }) {
    return new Promise<ProjectTemplateInterface>((resolve, reject) => {
      const url = `v1.1/templates/${entityType}/${templateId}?omitTasks=${!shouldCreateTasks}`;

      this.http.request(
        url,
        {
          method: 'Post',
          headers: defaultHeaders,
          credentials: 'include',
          body: jsonToString(project),
        },
        (error, response) => {
          processFetchErrorAndResponse(error, response, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve(result);
          });
        },
      );
    });
  }

  async searchItems({
    searchQuery,
    entityType = GlobalSearchResource.ALL,
    searchInArchived,
    page,
    organizationId,
    signal,
  }: {
    searchQuery: string;
    entityType: GlobalSearchResource;
    searchInArchived?: boolean;
    page?: string;
    organizationId: string;
    signal?: AbortSignal;
  }) {
    return new Promise<GlobalSearchResponse>((resolve, reject) => {
      const url = urllib.formatUrl(`v1.1/search/${organizationId}`, {
        searchPhrase: searchQuery,
        entityType,
        archived: searchInArchived,
        page,
      });

      this.http.request(
        url,
        {
          method: 'GET',
          headers: defaultHeaders,
          credentials: 'include',
          signal,
        },
        (error, response) => {
          processFetchErrorAndResponse(error, response, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve(result);
          });
        },
      );
    });
  }

  async searchNeighbouringMessages(messageId: Id) {
    return new Promise<MessageSearchResponse>((resolve, reject) => {
      this.http.request(
        `v1.1/messages/${messageId}/neighbours/`,
        {
          method: 'GET',
          headers: defaultHeaders,
          credentials: 'include',
        },
        (error, response) => {
          processFetchErrorAndResponse(error, response, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve(result);
          });
        },
      );
    });
  }
}
