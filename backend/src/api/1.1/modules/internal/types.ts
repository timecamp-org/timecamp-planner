import { Id, IdMap } from '../common/identifier';
import {
  ListDbRow,
  TaskDbRow,
  ProjectDbRow,
  FileDbRow,
  ConversationSettingsDbRow,
  TagDbRow,
  OrganizationDbRow,
  UserInProjectDbRow,
  UserInTaskDbRow,
  UnreadNotificationDbRow,
  UserInOrganizationDbRow,
  TaskTimeEstimateDbRow,
} from '../db/schema';
import { TaskPeopleMap, TaskFollowersMap, ChecklistMap } from '../tasks/types';
import { CustomFieldValues, CustomFieldValuesMap, ExtensionsData } from '../extensions/types';
import { OrganizationProjectsPeople } from '../organizations/types';
import { ProjectsFollowersMap, ProjectsHaveUnreadMessages, OrganizationIdByProjectId } from '../projects/types';
import { TaskTagIdsMap, TaskTagsMap } from '../tags/types';
import { OrganizationSubscriptionCancellationStatus } from '../payment/types';
import { ChecklistItemBasicData } from '../checklist/types';
import { MapOfArrays } from '../common/types';

export type ListsFollowers = {
  [listId: string]: Id[];
};

export type TasksTags = {
  [taskId: string]: Id[];
};

export type ProjectViewData = {
  lists: Partial<ListDbRow>[];
  listFollowers: ListsFollowers;
  projectFollowers: Id[];
  tasks: Partial<TaskDbRow>[];
  taskTimeEstimates: TaskTimeEstimateDbRow[];
  checklistsItemsBasicData: ChecklistItemBasicData[];
  taskPeople: TaskPeopleMap;
  taskTagIds: TasksTags;
  taskFollowers: TaskFollowersMap;
  projectCustomFields?: CustomFieldValues;
  tasksCustomFields?: CustomFieldValuesMap;
  extensionsData?: ExtensionsData;
};

export type ConversationViewData = {
  lists: Partial<ListDbRow>[];
  listFollowers: ListsFollowers;
  projectsFollowers: ProjectsFollowersMap;
  tasks: Partial<TaskDbRow>[];
  taskPeople: TaskPeopleMap;
  taskTagIds: TasksTags;
  taskFollowers: TaskFollowersMap;
  projectCustomFields?: CustomFieldValues;
  tasksCustomFields?: CustomFieldValuesMap;
  extensionsData?: ExtensionsData;
};

export type LatestActiveConversation = {
  containerId: Id;
  messageId: Id;
  createdAt: number;
};

export enum GetLatestActiveUserConversationsResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  USER_NOT_FOUND,
}

export interface GetLatestActiveUserConversationsResult {
  status: GetLatestActiveUserConversationsResultStatus;
  latestActiveConversationsData?: LatestActiveConversation[];
}

export interface OrganizationViewData {
  projects: ProjectDbRow[];
  projectsPeople: OrganizationProjectsPeople;
  projectsCustomFields: CustomFieldValuesMap;
  projectsHaveUnreadMessages: ProjectsHaveUnreadMessages;
  organizationIdByProjectId: OrganizationIdByProjectId;
  conversationsSettings: Partial<ConversationSettingsDbRow>[];
  subscriptionCancellationRequestStatus: OrganizationSubscriptionCancellationStatus | null;
  extensionsData: ExtensionsData;
}

export enum GetOrganizationViewDataResultStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  USER_NOT_FOUND,
}

export interface GetOrganizationViewDataResult {
  status: GetOrganizationViewDataResultStatus;
  organizationViewData?: OrganizationViewData;
}

export enum GetTaskDetailsStatus {
  OK,
  TASK_NOT_FOUND,
}

export interface TaskDetailsData {
  task: TaskDbRow;
  attachments: Array<FileDbRow>;
  checklist: ChecklistMap;
  checklistItemsAssignees: IdMap;
  tags: TaskTagsMap;
  tasksTagsIds: TaskTagIdsMap;
  customFields: CustomFieldValues;
  parentList: ListDbRow;
  followers: Id[];
  people: UserInTaskDbRow[];
  extensionsData?: ExtensionsData;
}

export interface GetTaskDetailsResult {
  status: GetTaskDetailsStatus;
  data?: TaskDetailsData;
}

export enum GetOrganizationTagsOverviewDataStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
}

export interface GetOrganizationTagsOverviewDataResult {
  status: GetOrganizationTagsOverviewDataStatus;
  tagsData?: Array<Partial<TagDbRow>>;
  tasksTagIds?: TaskTagIdsMap;
}

export enum OnboardingType {
  NO_SPACES = 'no_spaces',
  SPACE_WITHOUT_CARDS = 'space_without_cards',
  SPACE_WITH_CARDS = 'space_with_cards',
}

export enum GetUserInitialDataStatus {
  OK,
}

export interface GetUserInitialDataResult {
  status: GetUserInitialDataStatus;
  currentOrganization?: OrganizationDbRow;
  currentUserInOrganization?: UserInOrganizationDbRow;
  firstProject?: ProjectDbRow;
  firstProjectPeople?: UserInProjectDbRow[];
}

export interface FrontendBackgroundResources {
  projects: ProjectDbRow[];
  projectsPeople: OrganizationProjectsPeople;
  projectIdsWithUnreadMessages: Id[];
  unreadNotifications: UnreadNotificationDbRow[];
}

export interface ProjectBoardData {
  projectTasksPeople: MapOfArrays<UserInTaskDbRow>;
  projectTasksTagsIds: MapOfArrays<Id>;
  projectTasksFollowers: MapOfArrays<Id>;
  projectListsFollowers: MapOfArrays<Id>;
  projectListsExtensionsData: ExtensionsData;
  projectTasksExtensionsData: ExtensionsData;
  projectTasksChecklistsBasicData: ChecklistItemBasicData[];
  taskTimeEstimates: TaskTimeEstimateDbRow[];
}
