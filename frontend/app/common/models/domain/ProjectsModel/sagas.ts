import { defaultDebounceTime } from 'common/utils/debounceTimes';
import { fromJS, List, Map } from 'immutable';
import { call, cps, delay, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import handleError from '../../../utils/handleError';
import makeActionResult from '../../../utils/makeActionResult';

import { generateConversationId } from 'common/utils/generateCombinedId';
import ProjectColors from '../../../commonStyles/projectColors';
import generateId from '../../../utils/generate-pushid';
import * as PopUpAlertsModelActions from '../../component/PopUpAlertsModel/actions';
import { HumanMessage } from '../HumanMessageModel/models';
import { HumanMessageKind } from '../HumanMessageModel/types';
import { selectCurrentOrganizationId, selectIsUserOrganizationGuest } from '../OrganizationsModel/selectors/domain';
import { selectCanGuestsBeInvitedToWorkspace } from '../SubscriptionLimitsModel/selectors';
import { selectTaskFollowerIds } from '../TasksModel/selectors';
import { selectCurrentUserId } from '../UsersModel/selectors/domain';
import * as ProjectActions from './actions';
import * as ProjectConstants from './constants';
import { Project } from './models';
import * as ProjectSelectors from './selectors';

import { UserTrackerEvent } from '../../component/UserTrackerEventModel/constants';
import * as EntityModelSelectors from '../EntityModel/selectors';
import { EntityStatus, EntityType } from '../EntityModel/types';
import * as ListsModelSelectors from '../ListsModel/selectors';
import * as MessagesModelConstants from '../MessagesModel/constants';
import * as MessagesModelSelectors from '../MessagesModel/selectors';
import { getProjectTypeByPeople, prepareProjectPeople } from './helpers';
import { OrganizationProjectsData, ProjectInterface, ProjectPeopleRole, ProjectRecordInterface } from './types';

import { onSetContainerAccessLossTimestamp, onSetRequestStatus } from '../RequestModel/actions';
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes';
import { RequestStatus } from '../RequestModel/types';

import { AnyDict, AppEventType, PartialPayloadAction, PayloadAction } from 'common/types';
import { timestampNow } from 'common/utils/epoch';
import { Id } from 'common/utils/identifier';
import { filterList, getMapOfRecords } from 'common/utils/immutableUtils';
import { i18n } from 'i18n';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import { batchActions } from 'redux-batched-actions';
import { AppEventEmitter, HeySpaceClient as client, UserTracker } from '../../../services';
import { TargetType } from '../ExtensionsModel/types';
import { getCustomFieldsMap } from '../ExtensionsModel/utils';
import { createUserIfNotExisting } from '../OrganizationsModel/sagas';
import { selectIsCurrentUserOrganizationGuest } from '../OrganizationsModel/selectors';
import { generateCreateProjectRequestId } from '../RequestModel/createRequestId';
import { generateObjectPeople, parseObjectPeople, parsePeopleRoles } from '../RequestModel/dataParsers';
import { getRequestTypeWithParams } from '../RequestModel/helpers';
import { guestsLimitReachedErrorMessage } from '../SubscriptionModel/constants/humanMessages';
import * as ProjectsModelActions from './actions';
import {
  OnCreateProjectFilesPayload,
  OnDebounceRefetchProjectFilesPayload,
  OnGetOrganizationProjectsPayload,
  OnSetProjectLatestVisitPayload,
  OnUploadProjectFilePayload,
} from './payloads';
import { selectProjectPeopleRole } from './selectors';
import { selectProjectPeople } from './selectors/domain';
import { selectCanUserInviteToProject, selectIsProjectEditable } from './selectors/permission';

import * as FilesModelActions from '../FilesModel/actions';
import { getFilesQueryId } from '../FilesModel/helpers';
import { filesQueryClient } from '../FilesModel/queryClient';
import { selectFile } from '../FilesModel/selectors';

const emptyMap = Map();

export function* defaultSaga() {
  try {
    yield fork(function* () {
      yield takeEvery(ProjectConstants.onFetchProject, onFetchProject);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onProjectCreate, onProjectCreate);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onProjectUpdate, onProjectUpdate);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onNameUpdate, onNameUpdate);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onStatusUpdate, onStatusUpdate);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onDescriptionUpdate, onDescriptionUpdate);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onColorUpdate, onColorUpdate);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onBackgroundUpdate, onBackgroundUpdate);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onIconTypeUpdate, onIconTypeUpdate);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onUpdateProjectPrivacy, onUpdateProjectPrivacy);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onMemberUpdate, onMemberUpdate);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onMemberRemove, onMemberRemove);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onRemoveGuestFromAllSpaces, onRemoveGuestFromAllSpaces);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onMemberAdd, onMemberAdd);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onFollowerAdd, onFollowerAdd);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onFollowerRemove, onFollowerRemove);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onCreateUserAndAddToSubscribers, onCreateUserAndAddToSubscribers);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onSetIsConversationVisible, onSetIsConversationVisible);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onCreateConversationIfDoesNotExist, onCreateConversationIfDoesNotExist);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onRemoveProjectPerson, onRemoveProjectPerson);
    });

    yield fork(function* () {
      yield takeEvery(MessagesModelConstants.onCreateMessageData, onWatchMessageSendAndShowConversation);
    });

    yield fork(function* () {
      yield takeEvery(MessagesModelConstants.onCreateMessageAttachmentsIds, onBatchProjectFileIds);
    });

    yield fork(function* () {
      yield takeEvery(MessagesModelConstants.onUpdateMessageReadData, onUpdateMessageRead);
    });

    yield fork(function* () {
      yield takeEvery(MessagesModelConstants.onUpdateMessageReadSuccess, onUpdateMessageRead);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onCopySpace, onCopySpace);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onAddUsersToProject, onAddUsersToProject);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onGetOrganizationProjectsPeople, onGetOrganizationProjectsPeople);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onGetOrganizationProjects, onGetOrganizationProjects);
    });

    yield fork(function* () {
      yield takeEvery(
        ProjectConstants.onGetOrganizationProjectsHaveUnreadMessages,
        onGetOrganizationProjectsHaveUnreadMessages,
      );
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onGetConversationSettings, onGetConversationSettings);
    });

    yield fork(function* () {
      yield takeEvery(ProjectConstants.onSetProjectLatestVisit, onSetProjectLatestVisit);
    });
    yield fork(function* () {
      yield takeEvery(ProjectConstants.onCreateProjectFiles, onCreateProjectFiles);
    });
    yield fork(function* () {
      yield takeEvery(ProjectConstants.onUploadProjectFile, onUploadProjectFile);
    });
    yield fork(function* () {
      yield takeEvery(ProjectConstants.onUploadProjectBackground, onUploadProjectBackground);
    });

    yield fork(function* () {
      yield takeLatest(ProjectConstants.onDebounceRefetchProjectFiles, onDebounceRefetchProjectFiles);
    });
  } catch (error) {
    // TODO catch
  }
}

// All sagas to be loaded
export default [defaultSaga];

function* onCreateConversationIfDoesNotExist({ payload: { id, people } }: PartialPayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId);
  const conversationHash = generateConversationId(people, organizationId);

  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createConversationIfDoesNotExist,
        conversationHash,
        RequestStatus.LOADING,
      ),
    );
    let conversationId = yield select(ProjectSelectors.selectConversationId, {
      people,
    });

    let conversationData = null;
    if (!conversationId) {
      try {
        conversationData = yield cps(client.restApiClient.getConversation, organizationId, people.toJS());
        conversationId = conversationData.conversation.id;
      } catch (error) {
        // doNothing
      }
    }

    if (!conversationId) {
      conversationId = id || generateId();
      yield put(
        ProjectActions.onProjectCreate(
          {
            id: conversationId,
            isPrivate: true,
            projectType: getProjectTypeByPeople(people, true),
          },
          people,
          true,
        ),
      );
    }

    if (conversationData) {
      const { conversation, peopleRole } = conversationData;
      let projectPeopleRole = emptyMap;
      peopleRole.forEach((user) => {
        projectPeopleRole = projectPeopleRole.set(user.userId, user.role);
      });
      yield put(
        ProjectActions.onProjectCreateSuccess(
          makeActionResult({
            isOk: true,
            code: 'onProjectCreateSuccess',
            data: {
              projectId: conversation.id,
              project: Project(conversation),
              projectPeople: people.sort(),
              projectPeopleRole: projectPeopleRole,
              organizationId,
            },
          }),
        ),
      );
    }

    const isVisible = yield select(ProjectSelectors.selectIsConversationVisible, { conversationId: conversationHash });

    if (!isVisible) {
      yield put(ProjectActions.onSetIsConversationVisible(conversationHash, true));
    }

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createConversationIfDoesNotExist,
        conversationHash,
        RequestStatus.SUCCESS,
      ),
    );
  } catch (error) {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.createConversationIfDoesNotExist,
        conversationHash,
        RequestStatus.FAILURE,
        error,
      ),
    );
    handleError(error);
  }
}

function* onFetchProject({ payload: { projectId, queryParams = {} } }: PartialPayloadAction) {
  const requestType = getRequestTypeWithParams(RequestTypesConstants.getProject, queryParams);
  try {
    yield put(onSetRequestStatus(requestType, projectId, RequestStatus.LOADING));

    const result = yield cps(client.restApiClient.getProject, projectId, queryParams);
    let peopleIds = null;
    let peopleRole = null;

    if (!isEmpty(result.projectPeople)) {
      const parsedPeople = parsePeopleRoles<ProjectPeopleRole>(result.projectPeople);
      peopleIds = parsedPeople.peopleIds;
      peopleRole = parsedPeople.peopleRole;
    }
    yield put(ProjectActions.onFetchProjectSuccess(Project(result.project), peopleIds, peopleRole));
    yield put(onSetRequestStatus(requestType, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(requestType, projectId, RequestStatus.FAILURE, error));
  }
}

function* onProjectCreate({
  payload: { projectFields, projectPeople, isConversation, callback },
}: PartialPayloadAction) {
  const id = projectFields.id || generateId();
  const currentUserId = client.userContext.getUserId();
  const organizationId = yield select(selectCurrentOrganizationId);
  const requestId = generateCreateProjectRequestId(
    currentUserId,
    id,
    projectFields.projectType,
    projectPeople,
    organizationId,
  );
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.createProject, requestId, RequestStatus.LOADING));

    const isCurrentUserGuest = yield select(selectIsCurrentUserOrganizationGuest);
    if (!isConversation && isCurrentUserGuest) {
      return yield call(showPermissionAlert, i18n.t(`You don't have permission to create a project!`));
    }

    const rawObjectProject: ProjectInterface = Object.assign(
      {},
      {
        id,
        name: '',
        status: EntityStatus.EXISTS,
        color: ProjectColors.getRandomProjectColor(),
      },
      projectFields,
    );
    // TODO get project default name from translation

    const { projectPeopleIds, projectPeopleRole, rawProjectPeople } = prepareProjectPeople(
      projectPeople,
      currentUserId,
      id,
    );

    rawObjectProject.projectType = getProjectTypeByPeople(projectPeople, isConversation);

    const immutableProject = Project(rawObjectProject);

    yield put(
      ProjectActions.onProjectCreateSuccess(
        makeActionResult({
          isOk: true,
          code: 'onProjectCreateSuccess',
          data: {
            projectId: immutableProject.id,
            project: immutableProject,
            projectPeople: projectPeopleIds,
            projectPeopleRole,
            organizationId,
          },
        }),
      ),
    );

    yield call(
      client.restApiClient.createProject,
      rawObjectProject.id,
      {
        organizationId,
        status: EntityStatus.EXISTS,
        name: rawObjectProject.name,
        description: rawObjectProject.description,
        projectType: rawObjectProject.projectType,
        isPrivate: rawObjectProject.isPrivate,
        color: rawObjectProject.color,
        iconType: rawObjectProject.iconType,
        projectPeople: rawProjectPeople,
      },
      callback,
    );

    UserTracker.track(UserTrackerEvent.spaceCreated);

    yield put(onSetRequestStatus(RequestTypesConstants.createProject, requestId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { projectFields });
    yield put(onSetRequestStatus(RequestTypesConstants.createProject, requestId, RequestStatus.FAILURE, error));
  }
}

function* onProjectUpdate({
  payload: { projectId, projectFields = {}, ignoreDebounce = false },
}: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateProject, projectId, RequestStatus.LOADING));
    if (ignoreDebounce) {
      // ok
    } else {
      yield delay(defaultDebounceTime);
    }

    const isProjectEditable = yield select(selectIsProjectEditable, {
      projectId,
    });
    if (!isProjectEditable) {
      return yield call(showPermissionAlert);
    }

    let immutableProject = yield select(ProjectSelectors.selectProject, {
      projectId,
    });

    immutableProject = immutableProject.merge(fromJS(projectFields));
    immutableProject = Project(immutableProject);

    yield put(
      ProjectActions.onProjectUpdateSuccess(
        makeActionResult({
          isOk: true,
          code: 'onProjectUpdateSuccess',
          data: {
            projectId: immutableProject.get('id'),
            project: immutableProject,
          },
        }),
      ),
    );

    yield cps(client.restApiClient.updateProject, projectId, {
      name: projectFields.name,
      description: projectFields.description,
      isPrivate: projectFields.isPrivate,
      color: projectFields.color,
      startDate: projectFields.startDate,
      dueDate: projectFields.dueDate,
      status: projectFields.status,
      iconType: projectFields.iconType,
      backgroundImageUrl: projectFields.backgroundImageUrl,
    });

    yield put(onSetRequestStatus(RequestTypesConstants.updateProject, projectId, RequestStatus.SUCCESS));
    Object.keys(projectFields)
      .filter((field) => !['isPrivate', 'status'].includes(field))
      .forEach((field) => UserTracker.track(UserTrackerEvent.spaceEdited, { what: field }));
  } catch (error) {
    handleError(error, { projectId, projectFields });
    yield put(onSetRequestStatus(RequestTypesConstants.updateProject, projectId, RequestStatus.FAILURE, error));
  }
}

function* onNameUpdate({ payload: { projectId, name } }: PartialPayloadAction) {
  try {
    yield put(ProjectActions.onProjectUpdate(projectId, { name }));
  } catch (error) {
    handleError(error, { projectId, name });
  }
}

function* onStatusUpdate({ payload: { projectId, status, ignoreDebounce = false } }: PartialPayloadAction) {
  try {
    const isArchiving = status === EntityStatus.ARCHIVED;

    if (isArchiving) {
      yield call(onArchiveProject, projectId);
    }

    yield call(onProjectUpdate, { payload: { projectId, projectFields: { status }, ignoreDebounce } });

    const projectName = yield select(ProjectSelectors.selectProjectName, { projectId });

    yield put(
      PopUpAlertsModelActions.onAddAlert({
        humanMessage: HumanMessage({
          kind: HumanMessageKind.success,
          text: i18n.t(`You've successfully {{status}} Project {{projectName}}`, {
            status: isArchiving ? i18n.t('project|archived') : i18n.t('project|unarchived'),
            projectName,
          }),
        }),
      }),
    );
  } catch (error) {
    handleError(error, { projectId, status });
  }
}

function* onArchiveProject(projectId: Id) {
  const guestUserIds = yield select(ProjectSelectors.selectProjectGuests, {
    projectId,
  });
  for (let i = 0; i < guestUserIds.size; i++) {
    const userId = guestUserIds.get(i);
    yield call(onMemberRemove, { payload: { projectId, userId } });
  }
}

function* onDescriptionUpdate({ payload: { projectId, description } }: PartialPayloadAction) {
  try {
    yield put(ProjectActions.onProjectUpdate(projectId, { description }));
  } catch (error) {
    handleError(error, { projectId, description });
  }
}

function* onColorUpdate({ payload: { projectId, color } }: PartialPayloadAction) {
  try {
    yield put(ProjectActions.onProjectUpdate(projectId, { color }));
  } catch (error) {
    handleError(error, { projectId, color });
  }
}

function* onBackgroundUpdate({
  payload: { projectId, backgroundImageUrl },
}: PartialPayloadAction<{ projectId: string; backgroundImageUrl: string }>) {
  try {
    yield put(ProjectActions.onProjectUpdate(projectId, { backgroundImageUrl }, true));
  } catch (error) {
    handleError(error, { projectId, backgroundImageUrl });
  }
}

function* onIconTypeUpdate({ payload: { projectId, iconType } }: PartialPayloadAction) {
  try {
    yield put(ProjectActions.onProjectUpdate(projectId, { iconType }));
  } catch (error) {
    handleError(error, { projectId, iconType });
  }
}

function* onUpdateProjectPrivacy({ payload: { projectId, isPrivate } }: PartialPayloadAction) {
  try {
    yield put(ProjectActions.onProjectUpdate(projectId, { isPrivate }));
  } catch (error) {
    handleError(error, { projectId, isPrivate });
  }
}

function* onMemberUpdate({ payload: { projectId, userId, role } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateProjectPeopleRole, projectId, RequestStatus.LOADING));

    const isProjectEditable = yield select(selectIsProjectEditable, {
      projectId,
    });
    if (!isProjectEditable) {
      return yield call(
        showPermissionAlert,
        i18n.t(`You don't have permission to change member role in this project!`),
      );
    }

    let peopleRole = yield select(ProjectSelectors.selectProjectPeopleRole, {
      projectId,
    });
    if (role === ProjectPeopleRole.MANAGER) {
      // Update old leader if exists
      peopleRole = transferLeadership(peopleRole);
    }

    peopleRole = peopleRole.set(userId, role);

    yield cps(client.restApiClient.updateProjectPeopleRole, projectId, userId, role);

    yield put(ProjectActions.onUpdateProjectPeopleRole(projectId, peopleRole));
    yield put(onSetRequestStatus(RequestTypesConstants.updateProjectPeopleRole, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { projectId, userId, role });
    yield put(
      onSetRequestStatus(RequestTypesConstants.updateProjectPeopleRole, projectId, RequestStatus.FAILURE, error),
    );
  }
}

function transferLeadership(peopleRole) {
  let oldLeaderId;
  peopleRole.forEach((userRole, memberId) => {
    if (userRole === ProjectPeopleRole.MANAGER) {
      oldLeaderId = memberId;
    }
  });
  if (oldLeaderId) {
    peopleRole = peopleRole.set(oldLeaderId, ProjectPeopleRole.MEMBER);
  }
  return peopleRole;
}

function* onMemberRemove({ payload: { projectId, userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeProjectPeopleRole, projectId, RequestStatus.LOADING));
    const currentUserId = yield select(selectCurrentUserId);
    if (currentUserId !== userId) {
      const isProjectEditable = yield select(selectIsProjectEditable, {
        projectId,
      });
      if (!isProjectEditable) {
        return yield call(showPermissionAlert, i18n.t(`You don't have permission to remove member from this project!`));
      }
    }

    if (currentUserId === userId) {
      yield put(onSetContainerAccessLossTimestamp(EntityType.PROJECT_DATA, projectId, timestampNow()));
    }

    const isUserGuest = yield select(selectIsUserOrganizationGuest, { userId });
    const userAssignedProjects = yield select(ProjectSelectors.selectUserAssignedProjectIds, { userId });

    if (isUserGuest && userAssignedProjects.size === 1) {
      yield call(onRemoveGuestFromAllSpaces, { payload: { userId } });
      yield put(onSetRequestStatus(RequestTypesConstants.removeProjectPeopleRole, projectId, RequestStatus.SUCCESS));
      return null;
    }

    let people = yield select(selectProjectPeople, { projectId });
    let peopleRole = yield select(ProjectSelectors.selectProjectPeopleRole, {
      projectId,
    });
    const index = people.indexOf(userId);

    people = people.remove(index);
    peopleRole = peopleRole.remove(userId);

    AppEventEmitter.emit(AppEventType.REMOVE_PROJECT_MEMBER, {
      projectId,
      userId,
    });

    yield put(ProjectActions.onUpdateProjectPeopleIds(projectId, people));
    yield put(ProjectActions.onUpdateProjectPeopleRole(projectId, peopleRole));

    yield cps(client.restApiClient.removeProjectPeopleRole, projectId, userId);

    UserTracker.track(UserTrackerEvent.memberRemoved, { where: 'space' });

    yield put(onSetRequestStatus(RequestTypesConstants.removeProjectPeopleRole, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { projectId, userId });
    yield put(
      onSetRequestStatus(RequestTypesConstants.removeProjectPeopleRole, projectId, RequestStatus.FAILURE, error),
    );
  }
}

function* onRemoveGuestFromAllSpaces({ payload: { userId } }: PartialPayloadAction) {
  const organizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.deleteGuestFromAllSpaces,
        [organizationId, userId],
        RequestStatus.LOADING,
      ),
    );

    yield cps(client.restApiClient.deleteGuestFromAllSpaces, organizationId, userId);

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.deleteGuestFromAllSpaces,
        [organizationId, userId],
        RequestStatus.SUCCESS,
      ),
    );
  } catch (error) {
    handleError(error, { userId });
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.deleteGuestFromAllSpaces,
        [organizationId, userId],
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

export function* onMemberAdd({ payload: { projectId, userId, role } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.addUserToProjectPeople, projectId, RequestStatus.LOADING));

    const currentUserId = yield select(selectCurrentUserId);

    if (userId === currentUserId) {
      // ok
    } else {
      // check permission for inviting other users
      const canUserInviteToProject = yield select(selectCanUserInviteToProject, { projectId });
      if (!canUserInviteToProject) {
        return yield call(showPermissionAlert, i18n.t(`You don't have permission to add member to this project!`));
      }
    }

    const isUserGuest = yield select(selectIsUserOrganizationGuest, { userId });
    if (isUserGuest) {
      const canInviteGuest = yield select(selectCanGuestsBeInvitedToWorkspace, {
        guestsToInviteCount: 1,
      });
      if (!canInviteGuest) {
        yield put(
          PopUpAlertsModelActions.onAddAlert(
            {
              humanMessage: guestsLimitReachedErrorMessage,
            },
            'guests-count-in-workspace-exceeded',
          ),
        );
        return null;
      }
    }

    let people = yield select(selectProjectPeople, { projectId });
    let peopleRole = yield select(ProjectSelectors.selectProjectPeopleRole, {
      projectId,
    });

    if (people.includes(userId)) {
      // ok
    } else {
      people = people.push(userId);
      peopleRole = peopleRole.set(userId, role);

      yield cps(client.restApiClient.addUserToProjectPeople, projectId, userId, role);

      yield put(ProjectActions.onUpdateProjectPeopleIds(projectId, people));
      yield put(ProjectActions.onUpdateProjectPeopleRole(projectId, peopleRole));
    }

    yield put(onSetRequestStatus(RequestTypesConstants.addUserToProjectPeople, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { projectId, userId });
    yield put(
      onSetRequestStatus(RequestTypesConstants.addUserToProjectPeople, projectId, RequestStatus.FAILURE, error),
    );
  }
}

export function* onFollowerAdd({ payload: { projectId, userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.addUserToProjectFollowers, projectId, RequestStatus.LOADING));
    let followerIds = yield select(ProjectSelectors.selectProjectFollowerIds, {
      projectId,
    });

    if (followerIds.includes(userId)) {
      // ok
    } else {
      followerIds = followerIds.push(userId);

      yield put(ProjectActions.onUpdateProjectFollowerIds(projectId, followerIds));

      yield cps(client.restApiClient.addUserToProjectFollowers, projectId, userId);
      UserTracker.track(UserTrackerEvent.followerAdded, { where: 'space' });
    }
    yield put(onSetRequestStatus(RequestTypesConstants.addUserToProjectFollowers, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { projectId, userId });
    yield put(
      onSetRequestStatus(RequestTypesConstants.addUserToProjectFollowers, projectId, RequestStatus.FAILURE, error),
    );
  }
}

export function* onFollowerRemove({ payload: { projectId, userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeProjectFollower, projectId, RequestStatus.LOADING));

    const people = yield select(selectProjectPeople, { projectId });
    let followerIds = yield select(ProjectSelectors.selectProjectFollowerIds, {
      projectId,
    });
    const index = people.indexOf(userId);

    if (index === -1) {
      // ok
    } else {
      followerIds = followerIds.filterNot((followerId) => followerId === userId);

      yield put(ProjectActions.onUpdateProjectFollowerIds(projectId, followerIds));

      let listsFollowerIds = emptyMap;
      let tasksFollowerIds = emptyMap;

      const projectListIds = yield select(ListsModelSelectors.selectProjectListIdsInOrder, { projectId });

      for (let listIndex = 0; listIndex < projectListIds.size; listIndex++) {
        const listId = projectListIds.get(listIndex);
        const listFollowers = yield select(ListsModelSelectors.selectListFollowers, { listId });
        listsFollowerIds = listsFollowerIds.set(
          listId,
          listFollowers.filter((followerId) => followerId !== userId),
        );

        const taskIds = yield select(ListsModelSelectors.selectTaskIdsInOrderByListId, { listId });

        for (let taskIndex = 0; taskIndex < taskIds.size; taskIndex++) {
          const taskId = taskIds.get(taskIndex);
          const taskFollowers = yield select(selectTaskFollowerIds, { taskId });
          tasksFollowerIds = tasksFollowerIds.set(
            taskId,
            taskFollowers.filter((followerId) => followerId !== userId),
          );
        }
      }

      yield put(
        ProjectActions.onFollowerRemoveSuccess(
          makeActionResult({
            isOk: true,
            code: 'onFollowerRemoveSuccess',
            data: {
              listsFollowerIds,
              tasksFollowerIds,
            },
          }),
        ),
      );

      yield cps(client.restApiClient.removeProjectFollower, projectId, userId);
    }
    yield put(onSetRequestStatus(RequestTypesConstants.removeProjectFollower, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { projectId, userId });
    yield put(onSetRequestStatus(RequestTypesConstants.removeProjectFollower, projectId, RequestStatus.FAILURE, error));
  }
}

function* onCreateUserAndAddToSubscribers({ payload: { projectId, email, role, userId } }: PartialPayloadAction) {
  try {
    userId = yield call(createUserIfNotExisting, email, userId);
    yield put(ProjectActions.onMemberAdd(projectId, userId, role));
    UserTracker.track(UserTrackerEvent.memberInvited, { source: 'space' });
  } catch (error) {
    handleError(error, { projectId, email, userId });
  }
}

function* onSetIsConversationVisible({ payload: { conversationId, isVisible } }: PartialPayloadAction) {
  try {
    const isConversationVisible = yield select(ProjectSelectors.selectIsConversationVisible, { conversationId });
    if (isConversationVisible === isVisible) {
      return;
    }

    yield put(
      onSetRequestStatus(RequestTypesConstants.updateConversationVisibility, conversationId, RequestStatus.LOADING),
    );
    const organizationId = yield select(selectCurrentOrganizationId);
    yield put(ProjectActions.onSetIsConversationVisibleSuccess(conversationId, isVisible));
    //  @ts-ignore
    yield cps(client.restApiClient.updateConversationVisibility, organizationId, conversationId, isVisible);

    yield put(
      onSetRequestStatus(RequestTypesConstants.updateConversationVisibility, conversationId, RequestStatus.SUCCESS),
    );
  } catch (error) {
    handleError(error, { conversationId, isVisible });
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.updateConversationVisibility,
        conversationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

function* onWatchMessageSendAndShowConversation({ objectId, organizationId, message }: AnyDict) {
  try {
    const containerType = message.containerType;
    if (containerType === EntityType.PROJECT_DATA) {
      const currentUserId = yield select(selectCurrentUserId);
      if (currentUserId !== message.userId) {
        yield put(ProjectActions.onSetProjectHasUnreadMessages(objectId, true));
        yield put(ProjectActions.onSetOrganizationIdByProjectId(objectId, organizationId));
      }
    }
  } catch (error) {
    handleError(error);
  }
}

function* onRemoveProjectPerson({ payload: { projectId, userId, role } }: PartialPayloadAction) {
  try {
    const actionsBatch = [];
    const currentUserId = yield select(selectCurrentUserId);

    const currentProjectPeopleIds = yield select(selectProjectPeople, {
      projectId,
    });
    const currentProjectPeopleRole = yield select(selectProjectPeopleRole, {
      projectId,
    });
    const isCurrentUserRemovedFromSpace = userId === currentUserId && currentProjectPeopleIds.includes(currentUserId);

    if (isCurrentUserRemovedFromSpace) {
      actionsBatch.push(onSetContainerAccessLossTimestamp(EntityType.PROJECT_DATA, projectId, timestampNow()));
    }

    const newProjectPeopleIds = filterList<Id>(currentProjectPeopleIds, userId);
    const newProjectPeopleRole = currentProjectPeopleRole.delete(userId);

    actionsBatch.push(
      ProjectActions.onUpdateProjectPeopleSuccess(projectId, newProjectPeopleIds, newProjectPeopleRole),
    );
    yield put(batchActions(actionsBatch));
  } catch (error) {
    handleError(error);
  }
}

function* onBatchProjectFileIds({ containerId, messageAttachmentsIds }: AnyDict) {
  try {
    const containerType = yield select(EntityModelSelectors.selectEntityType, {
      entityId: containerId,
    });
    if (containerType === EntityType.PROJECT_DATA) {
      yield put(ProjectActions.onBatchProjectFileIds(List(messageAttachmentsIds), containerId));
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onAddUsersToProject({ payload: { userIds, projectId } }: PartialPayloadAction) {
  try {
    for (let i = 0; i < userIds.size; i++) {
      const userId = userIds.get(i);
      yield put(ProjectActions.onMemberAdd(projectId, userId, ProjectPeopleRole.MEMBER));
    }
  } catch (error) {
    handleError(error, { userIds, projectId });
  }
}

export function* onUpdateMessageRead({ containerType, containerId, userId, messageId, messageUserId }: AnyDict) {
  try {
    // @ts-ignore
    const lastMessageId = yield select(MessagesModelSelectors.selectLastMessageId, { objectId: containerId });
    const currentUserId = yield select(selectCurrentUserId);
    if (containerType !== EntityType.PROJECT_DATA || currentUserId !== userId) {
      return;
    }

    if ((!lastMessageId || lastMessageId !== messageId) && messageUserId !== currentUserId) {
      return yield put(ProjectActions.onSetProjectHasUnreadMessages(containerId, true));
    }

    if (lastMessageId === messageId) {
      return yield put(ProjectActions.onSetProjectHasUnreadMessages(containerId, false));
    }
  } catch (error) {
    handleError(error, {
      containerType,
      containerId,
      userId,
    });
  }
}

function* showPermissionAlert(message = i18n.t(`You don't have permission to edit this project!`)) {
  yield put(
    PopUpAlertsModelActions.onAddAlert({
      humanMessage: HumanMessage({
        kind: HumanMessageKind.error,
        text: message,
      }),
    }),
  );
}

function* onCopySpace({ payload: { projectId, name } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.copySpace, projectId, RequestStatus.LOADING));

    yield cps(client.restApiClient.copySpace, projectId, name);

    yield put(onSetRequestStatus(RequestTypesConstants.copySpace, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error, { projectId, name });
    yield put(onSetRequestStatus(RequestTypesConstants.copySpace, projectId, RequestStatus.FAILURE, error));
  }
}

function* onGetOrganizationProjectsPeople() {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationProjectsPeople,
        currentOrganizationId,
        RequestStatus.LOADING,
      ),
    );

    const projectsPeople = yield cps(client.restApiClient.getOrganizationProjectsProple, currentOrganizationId);

    if (!isEmpty(projectsPeople)) {
      const actionsBatch = [];
      const projectIds = Object.keys(projectsPeople);
      const { peopleIds, peopleRole } = parseObjectPeople<ProjectPeopleRole>(projectsPeople, projectIds);

      actionsBatch.push(ProjectActions.onBatchProjectsPeopleIds(peopleIds));
      actionsBatch.push(ProjectActions.onBatchProjectsPeopleRole(peopleRole));

      yield put(batchActions(actionsBatch));
    }

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationProjectsPeople,
        currentOrganizationId,
        RequestStatus.SUCCESS,
      ),
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationProjectsPeople,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

function* onGetOrganizationProjects({
  payload: { params, fillWithDefaults },
}: PayloadAction<OnGetOrganizationProjectsPayload>) {
  const currentOrganizationId: Id = yield select(selectCurrentOrganizationId);
  const currentUserId = yield select(selectCurrentUserId);
  const requestType = getRequestTypeWithParams(RequestTypesConstants.getOrganizationProjects, params);
  try {
    yield put(onSetRequestStatus(requestType, currentOrganizationId, RequestStatus.LOADING));

    const { projects, projectPeople, projectsHaveUnreadMessages, customFields } = yield cps(
      client.restApiClient.getOrganizationProjects,
      currentOrganizationId,
      params,
    );

    let result: OrganizationProjectsData = {
      projectsData: emptyMap as Map<Id, ProjectRecordInterface>,
      organizationIdByProjectId: emptyMap as Map<Id, Id>,
    };

    let projectIds = [];

    if (!isEmpty(projects)) {
      let organizationIdByProjectId = emptyMap as Map<Id, Id>;
      projects.forEach((project) => {
        organizationIdByProjectId = organizationIdByProjectId.set(project.id, currentOrganizationId);
      });

      result.projectsData = getMapOfRecords<ProjectInterface, ProjectRecordInterface>(projects, Project);
      result.organizationIdByProjectId = organizationIdByProjectId;

      projectIds = projects.map((project) => project.id);
    }

    if (!isEmpty(projectPeople)) {
      const projectPeopleGroupedByProjectId = groupBy(projectPeople, (role) => role.projectId);
      const { peopleIds, peopleRole } = parseObjectPeople<ProjectPeopleRole>(
        projectPeopleGroupedByProjectId,
        projectPeople.map((userInProject) => userInProject.projectId),
      );
      result.projectPeople = peopleIds;
      result.projectPeopleRole = peopleRole;
    } else if (fillWithDefaults) {
      const userProjectIds = yield select(ProjectSelectors.selectCurrentUserAssignedProjectIds);
      const projectIdsToFillWithDefaults = projectIds.filter((projectId) => !userProjectIds.includes(projectId));
      const { peopleIds, peopleRole } = generateObjectPeople<ProjectPeopleRole>(
        projectIdsToFillWithDefaults,
        currentUserId,
        ProjectPeopleRole.MEMBER,
      );
      result.projectPeople = peopleIds;
      result.projectPeopleRole = peopleRole;
    }

    if (!isEmpty(projectsHaveUnreadMessages)) {
      result.projectsHaveUnreadMessages = fromJS(projectsHaveUnreadMessages);
    }

    if (!isEmpty(customFields)) {
      const fields = getCustomFieldsMap(customFields, TargetType.PROJECT);
      result.customFields = fields;
    }

    yield put(ProjectActions.onGetOrganizationProjectsSuccess(result));
    yield put(onSetRequestStatus(requestType, currentOrganizationId, RequestStatus.SUCCESS));
  } catch (error) {
    handleError(error);
    yield put(onSetRequestStatus(requestType, currentOrganizationId, RequestStatus.FAILURE, error));
  }
}

function* onGetOrganizationProjectsHaveUnreadMessages() {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationProjectsHaveUnreadMessages,
        currentOrganizationId,
        RequestStatus.LOADING,
      ),
    );

    const projectIdsWithUnreadMessages = yield cps(
      client.restApiClient.getOrganizationProjectsHaveUnreadMessages,
      currentOrganizationId,
    );

    if (!isEmpty(projectIdsWithUnreadMessages)) {
      yield put(ProjectActions.onSetProjectsHaveUnreadMessages(projectIdsWithUnreadMessages));
    }

    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationProjectsHaveUnreadMessages,
        currentOrganizationId,
        RequestStatus.SUCCESS,
      ),
    );
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getOrganizationProjectsHaveUnreadMessages,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

function* onGetConversationSettings() {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  try {
    yield put(
      onSetRequestStatus(RequestTypesConstants.getConversationSettings, currentOrganizationId, RequestStatus.LOADING),
    );

    const result = yield cps(client.restApiClient.getUserOrganizationConversationsSettings, currentOrganizationId);

    const actionsBatch = [];

    if (!isEmpty(result)) {
      let visibility = emptyMap as Map<Id, boolean>;
      result.forEach((settings) => {
        visibility = visibility.set(settings.conversationHash, settings.isVisible);
      });
      actionsBatch.push(ProjectsModelActions.onBatchConversationsVisibility(visibility));
    }

    actionsBatch.push(
      onSetRequestStatus(RequestTypesConstants.getConversationSettings, currentOrganizationId, RequestStatus.SUCCESS),
    );
    yield put(batchActions(actionsBatch));
  } catch (error) {
    handleError(error);
    yield put(
      onSetRequestStatus(
        RequestTypesConstants.getConversationSettings,
        currentOrganizationId,
        RequestStatus.FAILURE,
        error,
      ),
    );
  }
}

function* onSetProjectLatestVisit({ payload: { projectId } }: PayloadAction<OnSetProjectLatestVisitPayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.setProjectLatestVisist, projectId, RequestStatus.LOADING));

    yield cps(client.restApiClient.setProjectLatestVisit, projectId);
    yield put(onSetRequestStatus(RequestTypesConstants.setProjectLatestVisist, projectId, RequestStatus.SUCCESS));
  } catch (error) {
    yield put(onSetRequestStatus(RequestTypesConstants.setProjectLatestVisist, projectId, RequestStatus.FAILURE));
  }
}

function* onDebounceRefetchProjectFiles({
  payload: { projectId },
}: PayloadAction<OnDebounceRefetchProjectFilesPayload>) {
  yield delay(1000);
  yield call(async () => {
    const queryId = getFilesQueryId(projectId);
    await filesQueryClient.fetchQuery(queryId);
  });
}

export function* onUploadProjectFile({ payload }: PayloadAction<OnUploadProjectFilePayload>) {
  const { fileId, objectId } = payload;

  yield call(client.restApiClient.createProjectFile, objectId, fileId);

  yield put(ProjectActions.onDebounceRefetchProjectFiles(objectId));
}

export function* onUploadProjectBackground({ payload }: PayloadAction<OnUploadProjectFilePayload>) {
  const { fileId, objectId, containerId } = payload;

  const { url } = yield select((state) => selectFile(state, { fileId }));

  yield put(ProjectActions.onBackgroundUpdate(objectId, url));
}

function* onCreateProjectFiles({ payload: { files, projectId } }: PayloadAction<OnCreateProjectFilesPayload>) {
  for (let i = 0; i < files.length; i++) {
    yield put(
      FilesModelActions.onQueueFilesAndStartUploading(
        [files[i]],
        projectId,
        projectId,
        ProjectActions.onUploadProjectFile,
      ),
    );
  }
}
