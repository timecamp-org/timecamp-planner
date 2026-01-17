import { i18n } from 'common/i18n';
import { PayloadAction } from 'common/types';
import { isAppVersionCodeNewerThanCurrent } from 'common/utils/appVersionUtils';
import { generateTimeBetween } from 'common/utils/debounceTimes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import * as PopUpAlertsModelActions from 'models/component/PopUpAlertsModel/actions';
import { refreshPage } from 'models/component/PopUpAlertsModel/constants/actionsTypes';
import * as payloads from 'models/domain/AppModel/payloads';
import { AppPlatform } from 'models/domain/AppModel/types';
import { HumanMessage } from 'models/domain/HumanMessageModel/models';
import { HumanMessageKind } from 'models/domain/HumanMessageModel/types';
import { ProjectPeopleRole } from 'models/domain/ProjectsModel/types';
import { UserInterface } from 'models/domain/UsersModel/types';
import { batchActions } from 'redux-batched-actions';
import { call, cps, delay, fork, put, select, spawn, takeEvery, takeLatest } from 'redux-saga/effects';
import { ActivityFeed, Config, HeySpaceClient as client, localStorage } from '../../../services';
import handleError from '../../../utils/handleError';
import isMobileApp from '../../../utils/isMobileApp';
import makeActionResult from '../../../utils/makeActionResult';
import * as EntityModelActions from '../EntityModel/actions';
import * as ExtensionsModelActions from '../ExtensionsModel/actions';
import * as GuestsModelActions from '../GuestsModel/actions';
import * as IntegrationsModelActions from '../IntegrationsModel/actions';
import * as JobStatusModelActions from '../JobStatusModel/actions';
import * as NotificationsModelActions from '../NotificationsModel/actions';
import { parseUnreadNotifications } from '../NotificationsModel/dataParsers';
import * as OrganizationGroupsModelActions from '../OrganizationGroupsModel/actions';
import * as OrganizationsModelActions from '../OrganizationsModel/actions';
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain';
import * as ProjectsModelActions from '../ProjectsModel/actions';
import * as RequestModelActions from '../RequestModel/actions';
import { parseObjectPeople } from '../RequestModel/dataParsers';
import { onFetchUserInitialData, onHideInactiveConversations } from '../RequestModel/sagas';
import * as SubscriptionModelActions from '../SubscriptionModel/actions';
import * as TagsModelActions from '../TagsModel/actions';
import * as UserStatusModelActions from '../UserStatusModel/actions';
import * as UsersModelActions from '../UsersModel/actions';
import { User } from '../UsersModel/models';
import { selectCurrentUserId } from '../UsersModel/selectors/domain';
import * as actions from './actions';
import * as constants from './constants';

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(constants.onInit, onInit);
    });

    yield fork(function* () {
      yield takeLatest(constants.onInitBackgroundResources, onInitBackgroundResources);
    });

    yield fork(function* () {
      yield takeLatest(constants.onInitModels, onInitModels);
    });

    yield fork(function* () {
      yield takeEvery(constants.onSetDoUserWantToUseNotSupportedBrowser, onSetDoUserWantToUseNotSupportedBrowser);
    });

    yield fork(function* () {
      yield takeEvery(constants.onReloadModels, onReloadModels);
    });

    yield fork(function* () {
      yield takeLatest(constants.onSetIsWorkspacesPanelVisible, onSetIsWorkspacesPanelVisible);
    });

    yield fork(function* () {
      yield takeEvery(constants.onReceiveNewAppVersion, onReceiveNewAppVersion);
    });
  },
];

export function* onInit(action?: PayloadAction<payloads.OnInitPayload>) {
  try {
    const user = yield call(onInitCoreApp);

    if (!user) {
      return yield call(finishInit);
    }
    yield call(onFetchUserInitialData);
    yield call(finishInit);

    if (action?.payload?.initCoreOnly) {
      return;
    }
    return yield call(onInitAppModules);
  } catch (error) {
    handleError(error);
    return yield call(finishInit, false);
  }
}

function* onInitCoreApp() {
  let user: UserInterface;
  try {
    user = yield cps(client.restApiClient.getCurrentUser);
    yield call(onInitAuthenticationData, user);
  } catch (error) {
    if (error.params?.body.code !== 401) {
      handleError(error);
    }
  }
  return user;
}

function* onInitAppModules() {
  onInitLogging();
  yield call(onInitDoUserWantToUseNotSupportedBrowser);

  yield put(EntityModelActions.onInitActivityFeed());

  yield put(NotificationsModelActions.onUnmutePushNotifications());

  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  if (currentOrganizationId) {
    yield spawn(onInitModels);
  }
}

function* finishInit(isSuccess: boolean = true) {
  if (isSuccess) {
    yield put(
      actions.onInitSuccess(
        makeActionResult({
          isOk: true,
          code: 'onInitSuccess',
        }),
      ),
    );
  } else {
    yield put(
      actions.onInitFailure(
        makeActionResult({
          isOk: false,
          code: 'onInitFailure',
        }),
      ),
    );
  }
}

export function* onInitModels() {
  const currentOrganizationId = yield select(selectCurrentOrganizationId);
  if (!currentOrganizationId) {
    return;
  }

  yield fork(onHideInactiveConversations);

  try {
    if (isMobileApp()) {
      yield spawn(onInitMobileModels);
    } else {
      yield spawn(onInitWebModels);
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onInitWebModels() {
  try {
    yield put(OrganizationsModelActions.onInit());
    yield put(SubscriptionModelActions.onInit());
    yield put(GuestsModelActions.onInit());
    yield put(TagsModelActions.onInit());
    yield put(NotificationsModelActions.onInit());
    yield put(ExtensionsModelActions.onInit());
    yield put(JobStatusModelActions.onInit());
    yield put(IntegrationsModelActions.onInit());
    yield put(UserStatusModelActions.onInit());
    yield put(RequestModelActions.onInitDelayedRequests());
    yield put(OrganizationGroupsModelActions.onInit());
    yield fork(onInitWorkspacesPanel);
    yield fork(onCheckFrontendAppVersion);
  } catch (error) {
    handleError(error);
  }
}

export function* onInitMobileModels() {
  try {
    yield put(OrganizationsModelActions.onInit());
    yield put(SubscriptionModelActions.onInit());
    yield put(GuestsModelActions.onInit());
    yield put(TagsModelActions.onInit());
    yield put(NotificationsModelActions.onInit());
    yield put(ExtensionsModelActions.onInit());
  } catch (error) {
    handleError(error);
  }
}

export function* onCheckFrontendAppVersion() {
  try {
    const response = yield cps(client.restApiClient.getAppVersion, AppPlatform.WEB);

    if (response && isAppVersionCodeNewerThanCurrent(response.versionCode)) {
      yield call(showNewAppVersionAvailablePopUp);
    }
  } catch (error) {
    handleError(error);
  }
}

export function* onInitBackgroundResources() {
  try {
    const debounceTime = generateTimeBetween(0, Config.backgroundResourcesMaxDelay);

    yield delay(debounceTime);

    const actionsBatch = [];

    const currentOrganizationId = yield select(selectCurrentOrganizationId);
    if (!currentOrganizationId) {
      return;
    }

    const { unreadNotifications, projects, projectsPeople, projectIdsWithUnreadMessages } = yield cps(
      client.restApiClient.getBackgroundResources,
      currentOrganizationId,
    );

    if (!isEmpty(projects)) {
      actionsBatch.push(ProjectsModelActions.onBatchProjects(projects));
    }

    if (!isEmpty(projectIdsWithUnreadMessages)) {
      actionsBatch.push(ProjectsModelActions.onSetProjectsHaveUnreadMessages(projectIdsWithUnreadMessages));
    }

    if (!isEmpty(projectsPeople)) {
      const projectIds = Object.keys(projectsPeople);
      const { peopleIds, peopleRole } = parseObjectPeople<ProjectPeopleRole>(projectsPeople, projectIds);
      actionsBatch.push(ProjectsModelActions.onBatchProjectsPeopleIds(peopleIds));
      actionsBatch.push(ProjectsModelActions.onBatchProjectsPeopleRole(peopleRole));
    }

    if (!isEmpty(unreadNotifications)) {
      const {
        unreadNotificationsTypes,
        unreadNotificationsChronology,
        unreadNotificationsCreationTimestamp,
        notificationsExternalData,
      } = parseUnreadNotifications(unreadNotifications);

      actionsBatch.push(
        NotificationsModelActions.onFetchUnreadNotificationsSuccess(
          makeActionResult({
            isOk: true,
            code: 'onFetchUnreadNotificationsSuccess',
            data: {
              unreadNotificationsTypes,
              unreadNotificationsChronology,
              unreadNotificationsCreationTimestamp,
              notificationsExternalData,
            },
          }),
        ),
      );
    }

    yield put(batchActions(actionsBatch));
  } catch (error) {
    handleError(error);
  }
}

export function* onInitWorkspacesPanel() {
  const currentUserId = yield select(selectCurrentUserId);
  let isWorkspacesPanelVisible = JSON.parse(
    yield cps(localStorage.getItem, `isWorkspacesPanelVisible::${currentUserId}`),
  );

  if (isNil(isWorkspacesPanelVisible)) {
    isWorkspacesPanelVisible = true;
  }
  yield put(actions.onSetIsWorkspacesPanelVisible(isWorkspacesPanelVisible));
}

export function* onReloadModels({
  payload: { showLoader, clearModels },
}: PayloadAction<payloads.OnReloadModelsPayload>) {
  try {
    if (showLoader) {
      yield put(actions.onSetAppHasLoaded(false));
    }
    if (clearModels) {
      yield put(actions.onCleanModels());
      yield call(onFetchUserInitialData);
    }
    yield call(onInitModels);

    yield put(actions.onSetAppHasLoaded(true));
  } catch (error) {
    handleError(error);
    yield put(actions.onSetAppHasLoaded(true));
  }
}

function onInitLogging() {
  let isLoggingEnabled = false;

  window.__startLogging = () => {
    if (!isLoggingEnabled) {
      ActivityFeed.getEventEmitter().on('message', console.log);
      isLoggingEnabled = true;
    }
  };

  window.__stopLogging = () => {
    if (isLoggingEnabled) {
      ActivityFeed.getEventEmitter().off('message', console.log);
      isLoggingEnabled = false;
    }
  };
}

function* onInitAuthenticationData(user: UserInterface) {
  try {
    const actionsBatch = [];
    actionsBatch.push(UsersModelActions.onCreateUser(new User(user)));
    actionsBatch.push(UsersModelActions.setCurrentUserId(user.id));
    actionsBatch.push(UsersModelActions.onSetIsUserOnline(user.id, true));
    yield put(batchActions(actionsBatch));
  } catch (error) {
    handleError(error);
  }
}

export function onSetDoUserWantToUseNotSupportedBrowser({
  payload: { decision },
}: PayloadAction<payloads.OnSetDoUserWantToUseNotSupportedBrowserPayload>) {
  try {
    // use JSON.stringify cause localStorage saves values as strings
    localStorage.setItem('doUserWantToUseNotSupportedBrowser', JSON.stringify(decision), (error) => {
      if (error) {
        handleError(error);
      }
    });
  } catch (error) {
    handleError(error);
  }
}

export function* onInitDoUserWantToUseNotSupportedBrowser() {
  try {
    // use JSON.parse cause localStorage saves values as strings
    // if it's null default to false
    const doUserWantToUseNotSupportedBrowser =
      JSON.parse(yield cps(localStorage.getItem, 'doUserWantToUseNotSupportedBrowser')) || false;
    yield put(actions.onSetDoUserWantToUseNotSupportedBrowser(doUserWantToUseNotSupportedBrowser));
  } catch (error) {
    handleError(error);
  }
}

export function* onSetIsWorkspacesPanelVisible({
  payload: { isWorkspacesPanelVisible },
}: PayloadAction<payloads.OnSetIsWorkspacesPanelVisiblePayload>) {
  try {
    const currentUserId = yield select(selectCurrentUserId);
    yield cps(localStorage.setItem, `isWorkspacesPanelVisible::${currentUserId}`, `${isWorkspacesPanelVisible}`);
  } catch (error) {
    handleError(error);
  }
}

export function* onReceiveNewAppVersion({
  payload: { entity },
}: PayloadAction<payloads.OnReceiveNewAppVersionPayload>) {
  try {
    const { appVersionCode, appPlatform } = entity;
    // TODO: add check for current platform

    if (isAppVersionCodeNewerThanCurrent(appVersionCode)) {
      yield call(showNewAppVersionAvailablePopUp);
    }
  } catch (error) {
    handleError(error, entity);
  }
}

export function* showNewAppVersionAvailablePopUp() {
  const humanMessage = HumanMessage({
    kind: HumanMessageKind.information,
    text: i18n.t("We've got some exciting changes! Please reload our app to have the latest features and bugfixes."),
  });

  yield put(PopUpAlertsModelActions.onAddAlert({ humanMessage }, 'app-update-available', false, [refreshPage]));
}
