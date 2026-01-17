import { UserTrackerEvent } from 'common/models/component/UserTrackerEventModel/constants';
import { push } from 'connected-react-router/immutable';
import { List, Map } from 'immutable';
import isEmpty from 'lodash/isEmpty';
import { batchActions } from 'redux-batched-actions';
import { call, cps, delay, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { Type as ErrorType } from '../../../ErrorDefinitions';
import { i18n } from '../../../i18n';
import { UserTracker, HeySpaceClient as client, localStorage } from '../../../services'; // eslint-disable-line import/no-unresolved
import { AnyDict, InternalError, PartialPayloadAction, PayloadAction } from '../../../types';
import { defaultDebounceTime } from '../../../utils/debounceTimes';
import generateId from '../../../utils/generate-pushid';
import { generateConversationId } from '../../../utils/generateCombinedId';
import handleError from '../../../utils/handleError';
import { Id } from '../../../utils/identifier';
import isMobileApp from '../../../utils/isMobileApp';
import makeActionResult from '../../../utils/makeActionResult';
import { makeConversationLink } from '../../../utils/routerHelpers';
import { onAddAlert } from '../../component/PopUpAlertsModel/actions';
import * as AppModelActions from '../AppModel/actions';
import * as AppModelSagas from '../AppModel/sagas';
import { EntityStatus } from '../EntityModel/types';
import * as ExtensionsModelActions from '../ExtensionsModel/actions';
import { TargetType } from '../ExtensionsModel/types';
import { getCustomFieldsMap } from '../ExtensionsModel/utils';
import { getThumbnailUrl } from '../FilesModel/helpers';
import { handleUploadChannel } from '../FilesModel/sagas';
import { UploadStep } from '../FilesModel/types';
import { HumanMessage } from '../HumanMessageModel/models';
import { HumanMessageKind } from '../HumanMessageModel/types';
import * as ProjectsModelActions from '../ProjectsModel/actions';
import { selectUserAssignedProjectIds } from '../ProjectsModel/selectors';
import { ProjectPeopleRole } from '../ProjectsModel/types';
import { onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import * as RequestModelSelectors from '../RequestModel/selectors';
import { APIResultStatus, RequestStatus } from '../RequestModel/types';
import {
  selectCanGuestsBeInvitedToWorkspace,
  selectCanUsersBeInvitedToWorkspace,
  selectUsersPerWorkspaceLimit,
} from '../SubscriptionLimitsModel/selectors';
import {
  guestsLimitReachedErrorMessage,
  noSpacesForGuestErrorMessage,
  usersLimitReachedErrorMessage,
} from '../SubscriptionModel/constants/humanMessages';
import { selectIsCurrentSubscriptionFree } from '../SubscriptionModel/selectors';
import * as UsersActions from '../UsersModel/actions';
import { User } from '../UsersModel/models';
import {
  selectCurrentUserId,
  selectCurrentUserOrganizationIds,
  selectUserByEmail,
} from '../UsersModel/selectors/domain';
import * as OrganizationsActions from './actions';
import * as OrganizationsConstants from './constants';
import {
  convertToUserTooMuchUsersErrorMessage,
  workspaceOwnerArchiveError,
  workspaceOwnerUnarchiveError,
} from './constants/humanMessages';
import { isUserConvertedToOrFromGuest } from './helpers';
import {
  OnFetchOrganizationPeoplePayload,
  OnInviteGuestsPayload,
  OnUpdateUserInOrganizationDataPayload,
} from './payloads';
import { selectCurrentUserOrganizationRole, selectIsCurrentUserOrganizationOwner } from './selectors';
import {
  selectCurrentOrganizationId,
  selectIsUserOrganizationGuest,
  selectOrganizationsPeopleRoleDomain,
  selectUserOrganizationRole,
} from './selectors/domain';
import { OrganizationPeopleResourceData, OrganizationPeopleRole, UserInOrganization } from './types';

const emptyMap = Map();
const emptyList = List();

export function* defaultSaga() {
  try {
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onInit, onInit);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onRegisterOrganization, onRegisterOrganization);
    });
    yield fork(function* () {
      yield takeEvery(OrganizationsConstants.onFetchOrganizationPeople, onFetchOrganizationPeople);
    });
    yield fork(function* () {
      yield takeEvery(OrganizationsConstants.onSwitchOrganization, onSwitchOrganization); // eslint-disable-line
    });
    yield fork(function* () {
      yield takeEvery(OrganizationsConstants.onInviteUsersToOrganization, onInviteUsersToOrganization);
    });

    yield fork(function* () {
      yield takeEvery(OrganizationsConstants.onInviteGuestsToOrganization, onInviteGuestsToOrganization);
    });
    yield fork(function* () {
      yield takeEvery(OrganizationsConstants.onResendInvitation, onResendInvitation);
    });
    yield fork(function* () {
      yield takeEvery(OrganizationsConstants.onGenerateInvitationLink, onGenerateInvitationLink);
    });
    yield fork(function* () {
      yield takeEvery(OrganizationsConstants.onUpdateWorkspaceName, onUpdateWorkspaceName);
    });

    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onUpdateWorkspace, onUpdateWorkspace);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onFetchUserOrganizations, onFetchUserOrganizations);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onDeactivateUserFromOrganization, onDeactivateUserFromOrganization);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onReactivateUserFromOrganization, onReactivateUserFromOrganization);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onUpdateUserRole, onUpdateUserRole);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onLogoUpload, onLogoUpload);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onSetOrganizationStatus, onSetOrganizationStatus);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onFetchCurrentUserOrganizationRoles, onFetchCurrentUserOrganizationRoles);
    });
    yield fork(function* () {
      yield takeLatest(OrganizationsConstants.onUpdateUserInOrganizationData, onWatchUserInOrganizationChange);
    });
  } catch (error) {
    // TODO catch
  }
}

// All sagas to be loaded
export default [defaultSaga];

export function* onInit() {
  try {
    const currentUserId = yield select(selectCurrentUserId);
    yield put(OrganizationsActions.onFetchOrganizationPeople());
    yield put(OrganizationsActions.onFetchUserOrganizations(currentUserId));
  } catch (error) {
    handleError(error);
  }
}

export function* onRegisterOrganization({
  payload: { organizationName, switchToNewOrganization = false, onSuccess = () => {} },
}: PartialPayloadAction) {
  const currentUserId: Id = yield select(selectCurrentUserId);
  const organizationId = generateId();
  try {
    const createWorkspaceStatus = yield select(RequestModelSelectors.selectRequestStatus, {
      objectId: null,
      requestType: RequestTypesConstants.createWorkspace,
    });
    if ([RequestStatus.LOADING].includes(createWorkspaceStatus)) {
      return;
    }
    yield put(onSetRequestStatus(RequestTypesConstants.createWorkspace, null, RequestStatus.LOADING));

    const prevOrganizationIds = yield select(selectCurrentUserOrganizationIds);

    const result = yield cps(client.restApiClient.createWorkspace, organizationId, { name: organizationName });
    const { organization } = result;

    yield cps(localStorage.setItem, 'currentOrganizationId', organizationId);

    yield put(OrganizationsActions.onSetCurrentOrganizationId(organizationId));

    const { id: userInOrganizationId } = result.userInOrganization;
    const userInOrganization: UserInOrganization = {
      id: userInOrganizationId,
      organizationId,
      role: OrganizationPeopleRole.OWNER,
      userId: currentUserId,
      status: EntityStatus.EXISTS,
    };

    yield put(
      OrganizationsActions.onCreateUserInOrganizationData({
        userId: currentUserId,
        organizationId,
        organization,
        userInOrganization,
      }),
    );

    UserTracker.track(UserTrackerEvent.workspaceCreated, {
      previousOrganizationsCount: prevOrganizationIds.size,
    });

    if (switchToNewOrganization) {
      yield call(onSwitchOrganization, {
        payload: { organizationId, showLoader: false },
      });
    } else {
      yield call(AppModelSagas.onInitModels);
    }
    onSuccess();
    yield put(onSetRequestStatus(RequestTypesConstants.createWorkspace, null, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { currentUserId, organizationName });
    yield put(onSetRequestStatus(RequestTypesConstants.createWorkspace, null, RequestStatus.FAILURE, error));
    yield put(
      OrganizationsActions.onRegisterOrganizationFailure(
        makeActionResult({
          isOk: false,
          code: 'client.restApiClient.organizationRegister',
          error: error,
        }),
      ),
    );
  }
}

export function* onFetchOrganizationPeople({
  payload: { shouldPurgeState },
}: PayloadAction<OnFetchOrganizationPeoplePayload>) {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.getOrganizationPeople, currentOrganizationId, RequestStatus.LOADING),
    );

    const result = yield cps(client.restApiClient.getOrganizationPeople, currentOrganizationId);

    const currentUserId = yield select(selectCurrentUserId);
    const currentUserRole = yield select(selectCurrentUserOrganizationRole, {
      organizationId: currentOrganizationId,
    });
    const newUserRole = result.organizationPeopleRole[currentUserId];
    const isUserOrganizationRoleChanged = isUserConvertedToOrFromGuest(currentUserRole, newUserRole);

    if (shouldPurgeState || isUserOrganizationRoleChanged) {
      yield put(OrganizationsActions.onPurgeUsersInOrganizationData(currentOrganizationId, currentUserId));
    }

    yield call(onSaveOrganizationPeopleWithMetadata, result, currentOrganizationId);
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationPeople,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

function* onSaveOrganizationPeopleWithMetadata(result: OrganizationPeopleResourceData, currentOrganizationId: Id) {
  let organizationPeopleRole = emptyMap;
  let organizationPeopleStatus = emptyMap;
  let userInOrganizationIds = emptyMap;
  const actionsBatch = [];

  if (!isEmpty(result.organizationPeople)) {
    actionsBatch.push(UsersActions.onBatchUsersData(result.organizationPeople));
    const currentUserId = yield select(selectCurrentUserId);
    actionsBatch.push(UsersActions.onBatchUserOnlineStatus(result.organizationPeople, currentUserId));
    const organizationPeople = result.organizationPeople.map((user) => user.id);
    actionsBatch.push(OrganizationsActions.onBatchOrganizationsPeople(currentOrganizationId, organizationPeople));
  }
  if (!isEmpty(result.organizationPeopleRole)) {
    Object.keys(result.organizationPeopleRole).forEach((userId) => {
      organizationPeopleRole = organizationPeopleRole.set(userId, result.organizationPeopleRole[userId]);
    });
  }
  if (!isEmpty(result.organizationPeopleStatus)) {
    Object.keys(result.organizationPeopleStatus).forEach((userId) => {
      organizationPeopleStatus = organizationPeopleStatus.set(userId, result.organizationPeopleStatus[userId]);
    });
  }
  if (!isEmpty(result.userInOrganizationIds)) {
    Object.keys(result.userInOrganizationIds).forEach((userId) => {
      userInOrganizationIds = userInOrganizationIds.set(userId, result.userInOrganizationIds[userId]);
    });
  }

  if (!isEmpty(result.userInOrganizationCustomFields)) {
    const customFields = getCustomFieldsMap(result.userInOrganizationCustomFields, TargetType.USER_IN_ORGANIZATION);
    actionsBatch.push(ExtensionsModelActions.onBatchCustomFieldValues(customFields));
  }

  actionsBatch.push(
    onSetRequestStatus(RequestTypesConstants.getOrganizationPeople, currentOrganizationId, RequestStatus.SUCCESS),
  );
  actionsBatch.push(
    OrganizationsActions.onFetchOrganizationPeopleSuccess(
      makeActionResult({
        isOk: true,
        code: 'onFetchOrganizationPeopleSuccess',
        data: {
          organizationId: currentOrganizationId,
          organizationPeopleRole,
          organizationPeopleStatus,
          userInOrganizationIds,
        },
      }),
    ),
  );
  yield put(batchActions(actionsBatch));
}

/* This saga gets users array { userId, email }
 *  - does optimistic UI redux inserts
 *  - prepare data for backend
 *  - calls backend and get array of invitation statuses
 */
export function* onInviteUsersToOrganization({ payload: { users, isIOS, shouldRedirect } }: PartialPayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId);
  const currentUserId = yield select(selectCurrentUserId);
  let mockedUserInvitations = emptyMap as Map<string, Id>;

  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.inviteUsersToConversations, organizationId, RequestStatus.LOADING),
    );

    const canUsersBeInvitedToWorkspace = yield select(selectCanUsersBeInvitedToWorkspace, {
      usersToInviteCount: users.length,
    });
    if (!canUsersBeInvitedToWorkspace) {
      const usersPerWorkspaceLimit = yield select(selectUsersPerWorkspaceLimit);
      const isCurrentSubscriptionFree = yield select(selectIsCurrentSubscriptionFree);
      yield put(
        onAddAlert(
          {
            humanMessage: usersLimitReachedErrorMessage(usersPerWorkspaceLimit, isCurrentSubscriptionFree, isIOS),
          },
          'users-count-in-workspace-exceeded',
        ),
      );
      return null;
    }

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const existingUser = yield select(selectUserByEmail, {
        email: user.email,
      });
      if (existingUser) {
        const error = new Error('User already exists') as InternalError;
        error.code = ErrorType.USER_ALREADY_IN_ORGANIZATION;
        throw error;
      }
      if (!user.userId) {
        user.userId = generateId();
      }

      const { userId, email } = user;

      const optimisticUser = new User({ id: userId, email: email });
      yield put(UsersActions.onCreateUser(optimisticUser));

      mockedUserInvitations = mockedUserInvitations.set(email, userId);
    }

    const usersResult = yield cps(client.restApiClient.inviteUsersToConversations, organizationId, users);

    let newConversationIds = emptyList as List<Id>;

    for (let i = 0; i < usersResult.length; i++) {
      const { status, user, userId, project } = usersResult[i];
      const mockedUserId = mockedUserInvitations.get(user.email);
      if (status === APIResultStatus.OK && user) {
        yield put(UsersActions.onCreateUser(new User(user)));
        yield put(ProjectsModelActions.onCreateProjectData(project));
        yield put(ProjectsModelActions.onCreateProjectPeopleIds(project.id, [currentUserId, userId]));
        yield put(
          ProjectsModelActions.onCreateProjectPeopleRole(project.id, {
            currentUserId: ProjectPeopleRole.MANAGER,
            userId: ProjectPeopleRole.MEMBER,
          }),
        );

        // Delete mocked user from redux
        if (mockedUserId !== userId) {
          yield put(UsersActions.onDeleteUser(mockedUserId));
        }

        const conversationId = generateConversationId([currentUserId, userId], organizationId);
        newConversationIds = newConversationIds.push(conversationId);
      } else {
        yield call(showUserInvitationError, usersResult[i]);
        const error = new Error(`User invitation error: ${status}`);
        yield put(UsersActions.onDeleteUser(mockedUserId));
        handleError(error, user);
      }
    }

    const firstConversationId = newConversationIds.first();
    if (!isMobileApp() && shouldRedirect && firstConversationId) {
      yield put(push(makeConversationLink(firstConversationId)));
    }

    yield put(
      onSetRequestStatus(RequestTypesConstants.inviteUsersToConversations, organizationId, RequestStatus.SUCCESS, null),
    );

    return yield usersResult;
  } catch (error) {
    handleError(error, users);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.inviteUsersToConversations,
        organizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );

    const deleteMockedUserActions = users.map((user) => {
      const mockedUserId = mockedUserInvitations.get(user.email);
      return UsersActions.onDeleteUser(mockedUserId);
    });
    yield put(batchActions(deleteMockedUserActions));

    return yield null;
  }
}

function* onInviteGuestsToOrganization({
  payload: { guestsEmails, projectIds, shouldNavigateToGuestConversation },
}: PayloadAction<OnInviteGuestsPayload>) {
  const organizationId = yield select(selectCurrentOrganizationId);
  const currentUserId = yield select(selectCurrentUserId);
  const canGuestsBeInvitedToWorkspace = yield select(selectCanGuestsBeInvitedToWorkspace, {
    guestsToInviteCount: guestsEmails.length * projectIds.length,
  });
  if (!canGuestsBeInvitedToWorkspace) {
    yield put(
      onAddAlert(
        {
          humanMessage: guestsLimitReachedErrorMessage,
        },
        'guests-count-in-workspace-exceeded',
      ),
    );
    return null;
  }

  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.inviteGuestsToOrganization, organizationId, RequestStatus.LOADING),
    );

    const results = yield cps(
      client.restApiClient.inviteGuestsToOrganization,
      organizationId,
      guestsEmails,
      projectIds,
    );

    let newConversationIds = emptyList as List<Id>;

    for (let i = 0; i < results.length; i++) {
      const { status, email, user, project } = results[i];
      if (status !== APIResultStatus.OK) {
        yield call(showUserInvitationError, { user: { email }, status });
        const error = new Error(`User invitation error: ${status}`);
        handleError(error);
      } else if (user) {
        const conversationId = generateConversationId([currentUserId, user.id], organizationId);
        yield put(UsersActions.onCreateUser(new User(user)));
        yield put(ProjectsModelActions.onCreateProjectData(project));
        yield put(ProjectsModelActions.onCreateProjectPeopleIds(project.id, [currentUserId, user.id]));
        yield put(
          ProjectsModelActions.onCreateProjectPeopleRole(project.id, {
            currentUserId: ProjectPeopleRole.MANAGER,
            userId: ProjectPeopleRole.MEMBER,
          }),
        );
        newConversationIds = newConversationIds.push(conversationId);
      }
    }

    const firstConversationId = newConversationIds.first();
    if (!isMobileApp() && shouldNavigateToGuestConversation && firstConversationId) {
      yield put(push(makeConversationLink(firstConversationId)));
    }

    yield put(
      onSetRequestStatus(RequestTypesConstants.inviteGuestsToOrganization, organizationId, RequestStatus.SUCCESS, null),
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.inviteGuestsToOrganization,
        organizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

function* showUserInvitationError(result) {
  let message = '';
  const { status, user, userId } = result;
  switch (status) {
    case ErrorType.USER_ALREADY_IN_ORGANIZATION: {
      message = i18n.t(`{{email}} already is a member of your workspace.`, {
        email: user.email,
      });
      break;
    }

    default: {
      message = i18n.t(`Something went wrong and we can’t invite {{email}} to conversation`, {
        email: user ? user.email : '',
      });
      break;
    }
  }
  yield put(
    onAddAlert(
      {
        humanMessage: HumanMessage({
          text: message,
          kind: HumanMessageKind.error,
        }),
      },
      `InviteUserFailed:${userId}`,
    ),
  );
}

export function* onResendInvitation({ payload: { userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.resendInvitationToOrganization, userId, RequestStatus.LOADING));

    const organizationId = yield select(selectCurrentOrganizationId);

    yield cps(client.restApiClient.resendInvitationToOrganization, organizationId, userId);

    yield put(onSetRequestStatus(RequestTypesConstants.resendInvitationToOrganization, userId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { userId });
    yield put(
      onSetRequestStatus(RequestTypesConstants.resendInvitationToOrganization, userId, RequestStatus.FAILURE, error),
    );
  }
}

export function* onGenerateInvitationLink({ payload: { userId } }: PartialPayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId);
  const keyParts = [organizationId, userId];
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.generateInvitationLink, keyParts, RequestStatus.LOADING));

    const invitationLink = yield cps(client.restApiClient.generateInvitationLink, organizationId, userId);

    yield put(OrganizationsActions.onSetUserInvitationLink(userId, invitationLink));

    yield put(onSetRequestStatus(RequestTypesConstants.generateInvitationLink, keyParts, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { userId });
    yield put(onSetRequestStatus(RequestTypesConstants.generateInvitationLink, keyParts, RequestStatus.FAILURE, error));
  }
}

export function* onSwitchOrganization({ payload: { organizationId, showLoader, clearModels } }: PartialPayloadAction) {
  try {
    yield cps(localStorage.setItem, 'currentOrganizationId', organizationId);
    yield put(AppModelActions.onReloadModels(showLoader, clearModels));
  } catch (error) {
    handleError(error, { organizationId });
  }
}

export function* onUpdateWorkspaceName({ payload: { organizationId, name } }: PartialPayloadAction) {
  try {
    yield put(OrganizationsActions.onUpdateWorkspace(organizationId, { name }));
  } catch (error) {
    handleError(error, { organizationId });
  }
}

export function* onUpdateWorkspace({
  payload: { organizationId, fields = {}, ignoreDebounce = false },
}: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateOrganization, organizationId, RequestStatus.LOADING));

    if (ignoreDebounce) {
      // ok
    } else {
      yield delay(defaultDebounceTime);
    }

    yield put(
      OrganizationsActions.onUpdateWorkspaceSuccess(
        makeActionResult({
          isOk: true,
          code: 'onUpdateWorkspaceSuccess',
          data: { organization: fields },
        }),
      ),
    );

    yield cps(client.restApiClient.updateOrganization, organizationId, fields);
    yield put(onSetRequestStatus(RequestTypesConstants.updateOrganization, organizationId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { organizationId });
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateOrganization, organizationId, RequestStatus.FAILURE, error),
    );
    yield put(
      OrganizationsActions.onUpdateWorkspaceFailure(
        makeActionResult({
          isOk: false,
          code: 'onUpdateWorkspaceFailure',
          error: error,
        }),
      ),
    );
  }
}

export function* onDeactivateUserFromOrganization({ payload: { userId, organizationId } }: PartialPayloadAction) {
  if (!organizationId) {
    organizationId = yield select(selectCurrentOrganizationId);
  }
  try {
    const currentUserId = yield select(selectCurrentUserId);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.deactivateUserFromOrganization,
        [userId, organizationId],
        RequestStatus.LOADING,
      ),
    );

    yield put(OrganizationsActions.onDeactivateUserFromOrganizationSuccess(userId, organizationId));

    yield cps(client.restApiClient.deactivateUserFromOrganization, organizationId, userId);

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.deactivateUserFromOrganization,
        [userId, organizationId],
        RequestStatus.SUCCESS,
      ),
    );

    if (currentUserId !== userId) {
      yield put(OrganizationsActions.onSetOpenedReactivateUserModalId(userId));
    }
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.deactivateUserFromOrganization,
        [userId, organizationId],
        RequestStatus.FAILURE,
        error,
      ),
    );
    yield put(OrganizationsActions.onDeactivateUserFromOrganizationFailure(userId, organizationId));
  }
}

export function* onReactivateUserFromOrganization({ payload: { userId } }: PartialPayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId);
  try {
    const isUserGuest = yield select(selectIsUserOrganizationGuest, { userId });

    if (isUserGuest) {
      const userAssignedProjects = yield select(selectUserAssignedProjectIds, {
        userId,
      });
      const canGuestBeConverted = yield select(selectCanGuestsBeInvitedToWorkspace, {
        guestsToInviteCount: userAssignedProjects.size,
      });
      if (!canGuestBeConverted) {
        yield put(onSetRequestStatus(RequestTypesConstants.updateUserRole, userId, RequestStatus.FAILURE));
        return yield put(
          onAddAlert(
            {
              humanMessage: guestsLimitReachedErrorMessage,
            },
            'guestsLimitReachedErrorMessage',
            false,
          ),
        );
      }
    } else {
      const canUsersBeInvitedToWorkspace = yield select(selectCanUsersBeInvitedToWorkspace, { usersToInviteCount: 1 });
      if (!canUsersBeInvitedToWorkspace) {
        const usersPerWorkspaceLimit = yield select(selectUsersPerWorkspaceLimit);
        const isCurrentSubscriptionFree = yield select(selectIsCurrentSubscriptionFree);
        yield put(
          onAddAlert(
            {
              humanMessage: usersLimitReachedErrorMessage(usersPerWorkspaceLimit, isCurrentSubscriptionFree),
            },
            'usersCountInWorkspaceExceeded',
          ),
        );
        return null;
      }
    }
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.reactivateUserFromOrganization,
        [userId, organizationId],
        RequestStatus.LOADING,
      ),
    );

    yield put(OrganizationsActions.onReactivateUserFromOrganizationSuccess(userId, organizationId));

    yield cps(client.restApiClient.reactivateUserFromOrganization, organizationId, userId);

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.reactivateUserFromOrganization,
        [userId, organizationId],
        RequestStatus.SUCCESS,
      ),
    );
    yield put(OrganizationsActions.onSetOpenedReactivateUserModalId(null));
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.reactivateUserFromOrganization,
        [userId, organizationId],
        RequestStatus.FAILURE,
        error,
      ),
    );
    yield put(OrganizationsActions.onReactivateUserFromOrganizationFailure(userId, organizationId));
  }
}

export function* onFetchUserOrganizations({ payload: { userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getOrganizations, userId, RequestStatus.LOADING));
    const result = yield cps(client.restApiClient.getOrganizations);

    let organizations = emptyList;
    const actionsBatch = [];

    if (!isEmpty(result.organizations)) {
      organizations = List(result.organizations);
      actionsBatch.push(OrganizationsActions.onBatchOrganizationsData(result.organizations, userId));
    }

    if (!isEmpty(result.organizationsCustomFields)) {
      const customFields = getCustomFieldsMap(result.organizationsCustomFields, TargetType.ORGANIZATION);
      actionsBatch.push(ExtensionsModelActions.onBatchCustomFieldValues(customFields));
    }

    actionsBatch.push(onSetRequestStatus(RequestTypesConstants.getOrganizations, userId, RequestStatus.SUCCESS));
    yield put(batchActions(actionsBatch));

    return yield organizations;
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.getOrganizations, userId, RequestStatus.FAILURE, error));
    throw error;
  }
}

export function* onUpdateUserRole({ payload: { userId, organizationId, role } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserRole, userId, RequestStatus.LOADING));

    switch (role) {
      case OrganizationPeopleRole.OWNER: {
        const currentUserId = yield select(selectCurrentUserId);
        yield put(OrganizationsActions.onSetUserRole(currentUserId, organizationId, OrganizationPeopleRole.MEMBER));
        break;
      }
      case OrganizationPeopleRole.ADMIN: {
        // it's fine, nothing to check here
        break;
      }
      case OrganizationPeopleRole.MEMBER: {
        const previousRole = yield select(selectUserOrganizationRole, {
          userId,
        });
        const hasWorkspaceAvailableSeats = yield select(selectCanUsersBeInvitedToWorkspace, { usersToInviteCount: 1 });

        if (previousRole === OrganizationPeopleRole.GUEST && !hasWorkspaceAvailableSeats) {
          yield put(onSetRequestStatus(RequestTypesConstants.updateUserRole, userId, RequestStatus.FAILURE));
          return yield put(
            onAddAlert(
              {
                humanMessage: convertToUserTooMuchUsersErrorMessage,
              },
              'convertToUserTooMuchUsersErrorMessage',
              false,
            ),
          );
        }
        break;
      }
      case OrganizationPeopleRole.GUEST: {
        const userAssignedProjects = yield select(selectUserAssignedProjectIds, { userId });

        if (userAssignedProjects.size === 0) {
          yield put(onSetRequestStatus(RequestTypesConstants.updateUserRole, userId, RequestStatus.FAILURE));
          return yield put(
            onAddAlert(
              {
                humanMessage: noSpacesForGuestErrorMessage,
              },
              'noSpacesForGuest',
              false,
            ),
          );
        }

        const canGuestBeConverted = yield select(selectCanGuestsBeInvitedToWorkspace, {
          guestsToInviteCount: userAssignedProjects.size,
        });
        if (!canGuestBeConverted) {
          yield put(onSetRequestStatus(RequestTypesConstants.updateUserRole, userId, RequestStatus.FAILURE));
          return yield put(
            onAddAlert(
              {
                humanMessage: guestsLimitReachedErrorMessage,
              },
              'guestsLimitReachedErrorMessage',
              false,
            ),
          );
        }
        break;
      }

      default:
        throw new Error('Unknown organization role');
    }

    yield put(OrganizationsActions.onSetUserRole(userId, organizationId, role));

    yield cps(client.restApiClient.updateUserRole, organizationId, userId, role);
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserRole, userId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserRole, userId, RequestStatus.FAILURE, error));
    handleError(error, { userId, organizationId, role });
  }
}

function* onLogoUpload({ payload: { file } }: PartialPayloadAction) {
  try {
    if (!file) {
      return;
    }
    const organizationId = yield select(selectCurrentOrganizationId);
    yield call(handleUploadChannel, file, handleLogoUploadStep, {
      organizationId,
    });
  } catch (error) {
    handleError(error);
    yield put(
      onAddAlert(
        makeActionResult({
          isOk: false,
          code: 'onUpdateWorkspaceLogoFailure',
          error: error,
        }),
      ),
    );
  }
}

export function* handleLogoUploadStep(step: UploadStep, context: AnyDict) {
  const { error, url } = step;
  const { organizationId } = context;

  if (error) {
    throw error;
  }
  if (url) {
    const logo = getThumbnailUrl(url);
    yield put(OrganizationsActions.onUpdateWorkspace(organizationId, { logo }, true));
    return true;
  }
  return false;
}

function* onSetOrganizationStatus({ payload: { organizationId, status } }: PartialPayloadAction) {
  try {
    const isCurrentUserOganizationOwner = yield select(selectIsCurrentUserOrganizationOwner, { organizationId });
    if (!isCurrentUserOganizationOwner) {
      return yield put(
        onAddAlert({
          humanMessage: status === EntityStatus.EXISTS ? workspaceOwnerUnarchiveError : workspaceOwnerArchiveError,
        }),
      );
    }
    yield put(onSetRequestStatus(RequestTypesConstants.updateOrganization, organizationId, RequestStatus.LOADING));

    yield cps(client.restApiClient.updateOrganization, organizationId, {
      status,
    });
    yield put(onSetRequestStatus(RequestTypesConstants.updateOrganization, organizationId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { organizationId });
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateOrganization, organizationId, RequestStatus.FAILURE, error),
    );
  }
}

function* onFetchCurrentUserOrganizationRoles() {
  const userId = yield select(selectCurrentUserId);
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getUserOrganizationRoles, userId, RequestStatus.LOADING));
    const userOrganizationRoles = yield cps(client.restApiClient.getUserOrganizationRoles);
    let organizationsPeopleRole = yield select(selectOrganizationsPeopleRoleDomain);
    Object.keys(userOrganizationRoles).forEach((organizationId) => {
      const role = userOrganizationRoles[organizationId];
      organizationsPeopleRole = organizationsPeopleRole.setIn([organizationId, userId], role);
    });
    yield put(OrganizationsActions.onFetchCurrentUserOrganizationRolesSuccess(organizationsPeopleRole));
    yield put(onSetRequestStatus(RequestTypesConstants.getUserOrganizationRoles, userId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(RequestTypesConstants.getUserOrganizationRoles, userId, RequestStatus.FAILURE, error));
  }
}

function* onWatchUserInOrganizationChange({ payload }: PayloadAction<OnUpdateUserInOrganizationDataPayload>) {
  try {
    const { organizationId, userInOrganization } = payload;

    const currentUserRole = yield select(selectCurrentUserOrganizationRole, {
      organizationId,
    });
    const newRole = userInOrganization?.role;
    yield put(OrganizationsActions.onUpdateUserInOrganizationDataSuccess(payload));

    if (isUserConvertedToOrFromGuest(currentUserRole, newRole)) {
      // @ts-ignore
      yield call(onFetchOrganizationPeople, {
        payload: { shouldPurgeState: true },
      });
    }
  } catch (error) {
    handleError(error);
  }
}

export function* createUserIfNotExisting(email: string, userId: Id) {
  userId = userId || generateId();

  const user = yield select(selectUserByEmail, { email });
  if (user) {
    return user.id;
  } else {
    const usersResult = yield call(onInviteUsersToOrganization, {
      payload: { users: [{ email, userId }] },
    });
    if (!usersResult) {
      throw new Error('User not invited to organization');
    }
    const userResult = usersResult[0];
    if (userResult && userResult.user) {
      return userResult.user.id;
    }
  }
}
