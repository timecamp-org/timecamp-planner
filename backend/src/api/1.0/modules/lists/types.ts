import { ListDbRow, TaskDbRow, UserFollowsTaskListDbRow, UserFollowsTaskDbRow, UserInTaskDbRow, TaskHasTagDbRow, ChecklistItemDbRow } from '../db/schema';
import { IdMap, Id } from '../common/identifier';
import { TaskFollowersMap, TaskPeopleMap } from '../tasks/types';
import { TaskTagIdsMap } from '../tags/types';
import { TasksChecklistItemsMap } from '../checklist/types';

export enum CopyListStatus {
  OK, LIST_NOT_FOUND
}

export enum MoveAllTasksInListStatus {
  OK, SOURCE_LIST_NOT_FOUND, DESTINATION_LIST_NOT_FOUND
}

export enum GetListRelatedObjectsStatus {
  OK, LIST_NOT_FOUND
}

export enum CreateListStatus {
  OK, LIST_ALREADY_EXISTS, LIST_WITH_ORDER_ALREADY_EXISTS
}

export enum UpdateListStatus {
  OK,
  LIST_NOT_FOUND,
}

export enum GetListStatus {
  OK,
  LIST_NOT_FOUND,
}

export enum GetProjectListsAndListsFollowersStatus {
  OK,
  PROJECT_NOT_FOUND,
}

export enum AddListFollowerStatus {
  OK,
  USER_ALREADY_FOLLOWING_LIST,
  LIST_NOT_FOUND,
  USER_NOT_FOUND,
}

export enum RemoveListFollowerStatus {
  OK,
  LIST_FOLLOWER_NOT_FOUND,
}

export enum RemoveListsFollowerStatus {
  OK,
}

export interface MoveAllTasksInListResult {
  status: MoveAllTasksInListStatus,
}

export interface CopyListResult {
  status: CopyListStatus;
  newTaskListId?: Id,
}

export interface CreateListResult {
  status: CreateListStatus;
  list?: ListDbRow,
}

export interface UpdateListResult {
  status: UpdateListStatus;
}

export interface GetListResult {
  status: GetListStatus;
  list?: ListDbRow,
}

export interface GetListRelatedObjectsResult {
  status: GetListRelatedObjectsStatus,
  data?: ListRelatedObjectsSourceData,
}

export interface ListRelatedObjectsSourceData {
  list: ListDbRow,
  listFollowers: IdMap,
  listTasks: TaskDbRow[],
  listTasksFollowers: TaskFollowersMap,
  listTasksPeople: TaskPeopleMap,
  listTasksTags: TaskTagIdsMap,
  listTasksChecklistItems: TasksChecklistItemsMap,
}

export interface ListRelatedObjectsInsertData {
  list: ListDbRow,
  listFollowers: UserFollowsTaskListDbRow[],
  listTasks: TaskDbRow[],
  listTasksFollowers: UserFollowsTaskDbRow[],
  listTasksPeople: UserInTaskDbRow[],
  listTasksTags: TaskHasTagDbRow[],
  listTasksChecklistItems: ChecklistItemDbRow[],
}

export interface ListIdsByTaskIds {
  [taskId: string]: Id,
}

export interface GetProjectListsAndListsFollowersResult {
  status: GetProjectListsAndListsFollowersStatus,
  data?: ProjectListsAndListFollowers,
}

export interface ProjectListsAndListFollowers {
  lists: ListDbRow[],
  listsFollowers: IdMap,
}

export interface AddListFollowerResult {
  status: AddListFollowerStatus,
}

export interface RemoveListFollowerResult {
  status: RemoveListFollowerStatus,
}

export interface RemoveListsFollowerResult {
  status: RemoveListsFollowerStatus,
}

export interface ListNamesMap {
  [id: string]: string,
}

export interface ListMap {
  [id: string]: string,
}

export interface CreateListJson {
  id: Id,
  projectId: Id,
  order: number,
  name: string,
  isArchived: boolean,
  creatorId: Id,
}

export type UpdateListJson = Partial<CreateListJson>

export type ListOrderByProjectId = {
  [projectId: string]: number,
}

export interface CopyListOptions {
  shouldCopyListFollowers?: boolean,
  shouldCopyTaskFollowers?: boolean,
  shouldCopyTaskPeople?: boolean,
}
