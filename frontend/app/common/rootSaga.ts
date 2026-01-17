import { all, fork } from 'redux-saga/effects';
import isMobileApp from './utils/isMobileApp';

import FiltersModelSagas from './models/component/FiltersModel/sagas';
import SearchModelSagas from './models/component/SearchModel/sagas';
import AppModelSagas from './models/domain/AppModel/sagas';
import CurrentUserModelSagas from './models/domain/CurrentUserModel/sagas';
import EntityModelSagas from './models/domain/EntityModel/sagas';

import ModalsSaga from './models/component/ModalsModel/sagas';
import PopUpAlertsModelSaga from './models/component/PopUpAlertsModel/sagas';
import ChatWithMeSaga from './models/domain/ChatWithMeModel/sagas';
import ChecklistsModelSagas from './models/domain/ChecklistsModel/sagas';
import ExtensionsModelSaga from './models/domain/ExtensionsModel/sagas';
import FilesModelSaga from './models/domain/FilesModel/sagas';
import GuestsSaga from './models/domain/GuestsModel/sagas';
import IntegrationsModelSaga from './models/domain/IntegrationsModel/sagas';
import JobStatusSaga from './models/domain/JobStatusModel/sagas';
import LinkPreviewModelSaga from './models/domain/LinkPreviewModel/sagas';
import ListsModelSagas from './models/domain/ListsModel/sagas';
import MessagesModelSagas from './models/domain/MessagesModel/sagas';
import NotificationsModelSagas from './models/domain/NotificationsModel/sagas';
import OAuthModelSaga from './models/domain/OAuthModel/sagas';
import OrganizationGroupsModelSagas from './models/domain/OrganizationGroupsModel/sagas';
import OrganizationsModelSagas from './models/domain/OrganizationsModel/sagas';
import OverwatchSaga from './models/domain/OverwatchModel/sagas';
import PersonalProjectStructureSaga from './models/domain/PersonalProjectStructureModel/sagas';
import ProjectsModelSagas from './models/domain/ProjectsModel/sagas';
import ProjectsSettingsSaga from './models/domain/ProjectsSettingsModel/sagas';
import RequestModelSaga from './models/domain/RequestModel/sagas';
import ScheduleSaga from './models/domain/ScheduleModel/sagas';
import TagsModelSagas from './models/domain/TagsModel/sagas';
import TaskRecurrenceSaga from './models/domain/TaskRecurrenceModel/sagas';
import TaskTimeEstimateSaga from './models/domain/TaskTimeEstimateModel/sagas';
import TasksModelSagas from './models/domain/TasksModel/sagas';
import TimecampTimerSaga from './models/domain/Timecamp/sagas';
import UserAppsSaga from './models/domain/UserAppsModel/sagas';
import UserStatusSaga from './models/domain/UserStatusModel/sagas';
import UsersModelSagas from './models/domain/UsersModel/sagas';
import ViewSettingsSaga from './models/domain/ViewSettingsModel/sagas';

export default function* rootSaga() {
  let sagas = [
    ...AppModelSagas,
    ...CurrentUserModelSagas,
    ...SearchModelSagas,
    ...FiltersModelSagas,
    ...EntityModelSagas,
    ...OAuthModelSaga,

    ...TasksModelSagas,
    ...ListsModelSagas,
    ...ChecklistsModelSagas,
    ...UsersModelSagas,
    ...OrganizationsModelSagas,
    ...ProjectsModelSagas,
    ...MessagesModelSagas,
    ...TagsModelSagas,
    ...NotificationsModelSagas,
    ...FilesModelSaga,
    ...RequestModelSaga,
    ...ExtensionsModelSaga,
    ...LinkPreviewModelSaga,
    ...PopUpAlertsModelSaga,
    ...IntegrationsModelSaga,
    ...ProjectsSettingsSaga,
    ...GuestsSaga,
    ...TaskTimeEstimateSaga,
    ...ScheduleSaga,
    ...TimecampTimerSaga,
  ];

  if (!isMobileApp()) {
    sagas = [
      ...sagas,
      ...ChatWithMeSaga,
      ...TaskRecurrenceSaga,
      ...UserStatusSaga,
      ...UserAppsSaga,
      ...JobStatusSaga,
      ...ViewSettingsSaga,
      ...OverwatchSaga,
      ...ModalsSaga,
      ...PersonalProjectStructureSaga,
      ...OrganizationGroupsModelSagas,
    ];
  }

  yield all(sagas.map(fork));
}
