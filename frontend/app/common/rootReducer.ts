/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */

import { connectRouter } from 'connected-react-router/immutable';
import { combineReducers } from 'redux-immutable';

import { domain as AppModelDomain } from './models/domain/AppModel/constants';
import AppModelReducer from './models/domain/AppModel/reducer';

import { domain as EntityModelDomain } from './models/domain/EntityModel/constants';
import EntityModelReducer from './models/domain/EntityModel/reducer';

import { domain as CurrentUserModelDomain } from './models/domain/CurrentUserModel/constants';
import CurrentUserModelReducer from './models/domain/CurrentUserModel/reducer';

import { domain as SearchModelDomain } from './models/component/SearchModel/constants';
import SearchModelReducer from './models/component/SearchModel/reducer';

import { domain as TasksModelDomain } from './models/domain/TasksModel/constants';
import TasksModelReducer from './models/domain/TasksModel/reducer';

import { domain as TasksTimeEstimatesDomain } from './models/domain/TaskTimeEstimateModel/constants';
import TasksTimeEstimatesModelReducer from './models/domain/TaskTimeEstimateModel/reducer';

import { domain as ListsModelDomain } from './models/domain/ListsModel/constants';
import ListsModelReducer from './models/domain/ListsModel/reducer';

import { domain as ChecklistsModelDomain } from './models/domain/ChecklistsModel/constants';
import ChecklistsModelReducer from './models/domain/ChecklistsModel/reducer';

import { domain as ProjectsModelDomain } from './models/domain/ProjectsModel/constants';
import ProjectsModelReducer from './models/domain/ProjectsModel/reducer';

import { domain as OrganizationsModelDomain } from './models/domain/OrganizationsModel/constants';
import OrganizationsModelReducer from './models/domain/OrganizationsModel/reducer';

import { domain as UsersModelDomain } from './models/domain/UsersModel/constants';
import UsersModelReducer from './models/domain/UsersModel/reducer';

import { domain as MessagesModelDomain } from './models/domain/MessagesModel/constants';
import MessagesModelReducer from './models/domain/MessagesModel/reducer';

import { domain as TagsModelDomain } from './models/domain/TagsModel/constants';
import TagsModelReducer from './models/domain/TagsModel/reducer';

import { domain as NotificationsModelDomain } from './models/domain/NotificationsModel/constants';
import NotificationsModelReducer from './models/domain/NotificationsModel/reducer';

import { domain as PaginationModelDomain } from './models/domain/PaginationModel/constants';
import PaginationModelReducer from './models/domain/PaginationModel/reducer';

import { domain as CredentialsModelDomain } from './models/component/CredentialsModel/constants';
import CredentialsModelReducer from './models/component/CredentialsModel/reducer';

import { domain as ActivitiesModelDomain } from './models/domain/ActivitiesModel/constants';
import ActivitiesModelReducer from './models/domain/ActivitiesModel/reducer';

import { domain as FiltersModelDomain } from './models/component/FiltersModel/constants';
import FiltersModelReducer from './models/component/FiltersModel/reducer';

import { domain as PopUpAlertsModelDomain } from './models/component/PopUpAlertsModel/constants';
import PopUpAlertsModelReducer from './models/component/PopUpAlertsModel/reducer';

import { domain as FilesModelDomain } from './models/domain/FilesModel/constants';
import FilesReducer from './models/domain/FilesModel/reducer';

import { domain as RequestStatusDomain } from './models/domain/RequestModel/constants';
import RequestStatusReducer from './models/domain/RequestModel/reducer';

import { domain as ExtensionsModelDomain } from './models/domain/ExtensionsModel/constants';
import ExtensionsModelReducer from './models/domain/ExtensionsModel/reducer';

import { domain as LinkPreviewModelDomain } from './models/domain/LinkPreviewModel/constants';
import LinkPreviewModelReducer from './models/domain/LinkPreviewModel/reducer';

import { domain as AddUsersToProjectModalModelDomain } from './models/component/AddUsersToProjectModalModel/constants';
import AddUsersToProjectModalModelReducer from './models/component/AddUsersToProjectModalModel/reducer';

import { domain as SubscriptionModelDomain } from './models/domain/SubscriptionModel/constants';
import SubscriptionModelReducer from './models/domain/SubscriptionModel/reducer';

import { domain as MobileNavigationModelDomain } from './models/mobile/NavigationModel/constants';
import MobileNavigationModelReducer from './models/mobile/NavigationModel/reducer';

import { domain as CreateSpaceModelDomain } from './models/mobile/CreateSpaceModel/constants';
import CreateSpaceReducer from './models/mobile/CreateSpaceModel/reducer';

import { domain as RouterModelDomain } from './models/domain/RouterModel/constants';
import RouterModelReducer from './models/domain/RouterModel/reducer';

import { domain as OAuthModelDomain } from './models/domain/OAuthModel/constants';
import OAuthModelReducer from './models/domain/OAuthModel/reducer';

import { domain as IntegrationsModelDomain } from './models/domain/IntegrationsModel/constants';
import IntegrationsModelReducer from './models/domain/IntegrationsModel/reducer';

import isMobileApp from './utils/isMobileApp';

import { domain as ModalsDomain } from './models/component/ModalsModel/constants';
import ModalsReducer from './models/component/ModalsModel/reducer';

import { domain as UserStatusDomain } from './models/domain/UserStatusModel/constants';
import UserStateReducer from './models/domain/UserStatusModel/reducer';

import { domain as ProjectSettingsDomain } from './models/domain/ProjectsSettingsModel/constants';
import ProjectsSettingsReducer from './models/domain/ProjectsSettingsModel/reducer';

import { domain as ChatWithMeDomain } from './models/domain/ChatWithMeModel/constants';
import ChatWithMeReducer from './models/domain/ChatWithMeModel/reducer';

import { domain as FullCalendarModelDomain } from './models/component/FullCalendarModel/constants';
import FullCalendarModelReducer from './models/component/FullCalendarModel/reducer';

import { domain as TaskRecurrenceModelDomain } from './models/domain/TaskRecurrenceModel/constants';
import TaskRecurrenceModelReducer from './models/domain/TaskRecurrenceModel/reducer';

import { domain as EntityHistoryModelDomain } from './models/domain/EntityHistoryModel/constants';
import EntityHistoryModelReducer from './models/domain/EntityHistoryModel/reducer';

import { domain as UserAppModelDomain } from './models/domain/UserAppsModel/constants';
import UserAppsReducer from './models/domain/UserAppsModel/reducer';

import { domain as ViewSettingsModelDomain } from './models/domain/ViewSettingsModel/constants';
import ViewSettingsReducer from './models/domain/ViewSettingsModel/reducer';

import { domain as JobStatusDomain } from './models/domain/JobStatusModel/constants';
import JobStatusReducer from './models/domain/JobStatusModel/reducer';
import { ApplicationState } from './types';

import { domain as GuestsModelDomain } from './models/domain/GuestsModel/constants';
import GuestsReducer from './models/domain/GuestsModel/reducer';

import { domain as PersonalProjectStructureDomain } from './models/domain/PersonalProjectStructureModel/constants';
import PersonalProjectStructureReducer from './models/domain/PersonalProjectStructureModel/reducer';
import { domain as ScheduleDomain } from './models/domain/ScheduleModel/constants';
import ScheduleReducer from './models/domain/ScheduleModel/reducer';

import { domain as OrganizationGroupsDomain } from './models/domain/OrganizationGroupsModel/constants';
import OrganizationGroupsReducer from './models/domain/OrganizationGroupsModel/reducer';

import { domain as TimecampTimerDomain } from './models/domain/Timecamp/constants';
import TimecampTimerReducer from './models/domain/Timecamp/reducer';

export default function (asyncReducers, history) {
  const reducers = {
    [RouterModelDomain]: RouterModelReducer,
    [AppModelDomain]: AppModelReducer,
    [OAuthModelDomain]: OAuthModelReducer,
    [EntityModelDomain]: EntityModelReducer,
    [CurrentUserModelDomain]: CurrentUserModelReducer,
    [SearchModelDomain]: SearchModelReducer,
    [FiltersModelDomain]: FiltersModelReducer,
    [PaginationModelDomain]: PaginationModelReducer,
    [CredentialsModelDomain]: CredentialsModelReducer,
    //@ts-ignore
    [CredentialsModelDomain]: CredentialsModelReducer,
    [ModalsDomain]: ModalsReducer,

    [TasksModelDomain]: TasksModelReducer,
    [TasksTimeEstimatesDomain]: TasksTimeEstimatesModelReducer,
    [ListsModelDomain]: ListsModelReducer,
    [ChecklistsModelDomain]: ChecklistsModelReducer,
    [UsersModelDomain]: UsersModelReducer,
    [OrganizationsModelDomain]: OrganizationsModelReducer,
    [ProjectsModelDomain]: ProjectsModelReducer,
    [MessagesModelDomain]: MessagesModelReducer,
    [TagsModelDomain]: TagsModelReducer,
    [NotificationsModelDomain]: NotificationsModelReducer,
    [ActivitiesModelDomain]: ActivitiesModelReducer,
    [PopUpAlertsModelDomain]: PopUpAlertsModelReducer,
    [FilesModelDomain]: FilesReducer,
    [RequestStatusDomain]: RequestStatusReducer,
    [ExtensionsModelDomain]: ExtensionsModelReducer,
    [LinkPreviewModelDomain]: LinkPreviewModelReducer,
    [AddUsersToProjectModalModelDomain]: AddUsersToProjectModalModelReducer,
    [SubscriptionModelDomain]: SubscriptionModelReducer,
    [IntegrationsModelDomain]: IntegrationsModelReducer,
    [UserStatusDomain]: UserStateReducer,
    [ProjectSettingsDomain]: ProjectsSettingsReducer,
    [EntityHistoryModelDomain]: EntityHistoryModelReducer,
    [GuestsModelDomain]: GuestsReducer,
    [ScheduleDomain]: ScheduleReducer,
    [TimecampTimerDomain]: TimecampTimerReducer,

    ...asyncReducers,
  };

  if (!isMobileApp()) {
    reducers.router = connectRouter(history);
    reducers[ChatWithMeDomain] = ChatWithMeReducer;
    reducers[FullCalendarModelDomain] = FullCalendarModelReducer;
    reducers[TaskRecurrenceModelDomain] = TaskRecurrenceModelReducer;
    reducers[TasksTimeEstimatesDomain] = TasksTimeEstimatesModelReducer;
    reducers[UserAppModelDomain] = UserAppsReducer;
    reducers[JobStatusDomain] = JobStatusReducer;
    reducers[ViewSettingsModelDomain] = ViewSettingsReducer;
    reducers[PersonalProjectStructureDomain] = PersonalProjectStructureReducer;
    reducers[OrganizationGroupsDomain] = OrganizationGroupsReducer;
  } else {
    reducers[MobileNavigationModelDomain] = MobileNavigationModelReducer;
    reducers[CreateSpaceModelDomain] = CreateSpaceReducer;
  }

  return combineReducers<ApplicationState>(reducers);
}
