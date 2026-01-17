import { Map, Seq } from 'immutable';
import { FullCalendarState } from 'models/component/FullCalendarModel/types';
import { ModalsState } from 'models/component/ModalsModel/types';
import { ActivitiesState } from 'models/domain/ActivitiesModel/types';
import { AppState } from 'models/domain/AppModel/types';
import { ChatWithMeState } from 'models/domain/ChatWithMeModel/types';
import { ChecklistsState } from 'models/domain/ChecklistsModel/types';
import { EntityHistoryState } from 'models/domain/EntityHistoryModel/types';
import { EntityState } from 'models/domain/EntityModel/types';
import { ExtensionsState } from 'models/domain/ExtensionsModel/types';
import { FilesState } from 'models/domain/FilesModel/types';
import { JobStatusState } from 'models/domain/JobStatusModel/types';
import { LinkPreviewState } from 'models/domain/LinkPreviewModel/types';
import { TaskListsState } from 'models/domain/ListsModel/types';
import { NotificationsState } from 'models/domain/NotificationsModel/types';
import { GroupsState } from 'models/domain/OrganizationGroupsModel/types';
import { OrganizationsState } from 'models/domain/OrganizationsModel/types';
import { PersonalProjectStructureState } from 'models/domain/PersonalProjectStructureModel/types';
import { ProjectType, ProjectsState } from 'models/domain/ProjectsModel/types';
import { ProjectsSettingsState } from 'models/domain/ProjectsSettingsModel/types';
import { RequestsState } from 'models/domain/RequestModel/types';
import { TagsState } from 'models/domain/TagsModel/types';
import { TaskRecurrenceState } from 'models/domain/TaskRecurrenceModel/types';
import { TasksState } from 'models/domain/TasksModel/types';
import { UserAppsState } from 'models/domain/UserAppsModel/types';
import { UserStatusState } from 'models/domain/UserStatusModel/types';
import { UsersState } from 'models/domain/UsersModel/types';
import { ViewSettingsState } from 'models/domain/ViewSettingsModel/types';
import { PushNotificationsConfigInterface } from '../PushNotificationClient/types';
import { FiltersState } from './models/component/FiltersModel/types';
import { CurrentUserState } from './models/domain/CurrentUserModel/types';
import { GuestsState } from './models/domain/GuestsModel/types';
import { RouterState } from './models/domain/RouterModel/types';
import { TimecampTimerState } from './models/domain/Timecamp/types';
import { Id } from './utils/identifier';

export type Dict<T> = { [_: string]: T };
export type AnyDict = Dict<any>;
export type AnyMap = Map<string, any>;
export type StringDict = Dict<string>;
export type PropertiesOfType<T, TVal> = {
  [P in keyof T]: T[P] extends TVal ? P : never;
}[keyof T];
export type StringPropertiesOf<T> = PropertiesOfType<T, string>;
export type Callback = (error, result) => void;
export type Maybe<T> = T | null;

export type ImmutableMap<T, V> = {
  setIn(keys: T[], value: V);
  delete(key: T, value: V);
  deleteIn(keys: T[]);
  updateIn(keys: T[], value: V);
  getIn(keys: T[], notSetValue?: any);
  mergeIn(keys: T[], value: V);
  mergeDeep(value: V);
  merge(value: V);
  set(key: T, value: V);
  update(key: T, value: V);
  get(key: T, notSetValue?: any);
  filter(predicate: (value: V, key: T) => boolean);
  forEach(sideEffect: (value: V, key: T) => void);
  keySeq(): Seq.Indexed<T>;
};

export interface ApplicationState extends ImmutableMap<string, any> {
  RouterModel: RouterState;
  App: AppState;
  UsersModel: UsersState;
  NotificationsModel: NotificationsState;
  ModalsModel: ModalsState;
  CurrentUserModel: CurrentUserState;
  EntityModel: EntityState;
  PopUpAlertsModel: any;
  Search: any;
  OrganizationsModel: OrganizationsState;
  router: any;
  IntegrationsModel: any;
  UserAppsModel: UserAppsState;
  ProjectsSettingsModel: ProjectsSettingsState;
  SubscriptionModel: any;
  CredentialsModel: any;
  FiltersModel: FiltersState;
  ProjectsModel: ProjectsState;
  UsersStatusModel: UserStatusState;
  PaginationModel: any;
  TagsModel: TagsState;
  OAuthModel: any;
  FilesModel: FilesState;
  AddUsersToProjectModalModel: any;
  ChatWIthMeModel: ChatWithMeState;
  ListsModel: TaskListsState;
  TaskRecurrenceModel: TaskRecurrenceState;
  ExtensionsModel: ExtensionsState;
  EntityHistoryModel: EntityHistoryState;
  RequestModel: RequestsState;
  JobStatusModel: JobStatusState;
  TasksModel: TasksState;
  LinkPreviewModel: LinkPreviewState;
  FullCalendarModel: FullCalendarState;
  ActivitiesModel: ActivitiesState;
  ChecklistsModel: ChecklistsState;
  MessagesModel: any;
  ViewSettingsModel: ViewSettingsState;
  GuestsModel: GuestsState;
  PersonalProjectStructureModel: PersonalProjectStructureState;
  GroupsState: GroupsState;
  TimecampTimerState: TimecampTimerState;
}

export type AppConfigInterface = {
  restApiUri?: string;
  activityFeedUri?: string;
  activityFeedReconnectionDelay?: number;
  sentryDSN?: string;

  googleClientId?: string;
  googleDeveloperKey?: string;
  amazonResizeUrl?: string;
  isTrackingEnabled?: boolean;
  externalResources?: {
    calendly?: boolean;
    googleFonts?: boolean;
    googleApis?: boolean;
    jitsi?: boolean;
  };
  isRemoteDevtoolsEnabled?: boolean;
  userComApiKey?: string;
  landingPageUrl?: string;
  webAppUrl?: string;
  pushNotifications?: PushNotificationsConfigInterface;
  backgroundResourcesMaxDelay?: number;
  customerMessagingPlatformApiKey?: string;
};

/* This is gentle approach without typing payload and type
 * If more typecheck is needed, use typesafe-actions PayloadAction etc.
 */

export interface PayloadAction<T = any> {
  type: string;
  payload?: T;
}

export type ActionCreator<T> = (payload?: T) => PayloadAction<T>;

export type PartialPayloadAction<T = any> = Partial<PayloadAction<T>>;

export type ItemOrderByContainerId = Map<Id, Map<Id, number>>;

export type CalendarEvent = {
  start?: Date | null;
  end?: Date | null;
  id?: string;
  allDay?: boolean;
  title: string;
};

export enum PeriodType {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  DAILY = 'daily',
}

export enum Position {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum AppEventType {
  PUSH_NOTIFICATION_CLICKED = 'pushNotificationClicked',
  APP_RECONNECTED = 'appReconnected',
  APP_REFRESH = 'appRefresh',
  ALERT = 'alert',
  OPEN_CARD_COMMENTS = 'openCardComments',
  FOCUS_MESSAGE_INPUT = 'focusMessageInput',
  REMOVE_PROJECT_MEMBER = 'removeProjectMember',
  CARD_RESIZED = 'cardResized',
  DISPOSE_MEET = 'disposeMeet',
}

export interface InternalError extends Error {
  code: string;
}

export type FeedConsoleInterface = {
  unsubscribe(): void;
  close(): void;
  reconnect(): void;
};

export enum BaseQueryFieldValue {
  ALL = 'all',
}

export interface FirstProjectInterface {
  projectId: Id;
  projectType: ProjectType;
  conversationHash?: string;
}

export interface UrlConfigInterface {
  firstProjectData?: FirstProjectInterface;
}

export type SortOrder = 'asc' | 'desc';
