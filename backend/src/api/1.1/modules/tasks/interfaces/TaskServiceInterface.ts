import {
  CreateTaskResult,
  UpdateTaskResult,
  AddTaskPeopleResult,
  UpdateTaskPeolpeResult,
  DeleteTaskPeolpeResult,
  AttachTagToTaskResult,
  DetachTagFromTaskResult,
  AttachFileToTaskResult,
  DetachFileFromTaskResult,
  GetTaskChecklistResult,
  AddTaskFollowerResult,
  RemoveTaskFollowerResult,
  RemoveTasksFollowerResult,
  TaskPeopleMap,
  TaskFollowersMap,
  TaskTagsMap,
  TaskCreatedEventData,
  CopyTaskResult,
  TaskOrderByListId,
  TaskJson,
  SetUserLatestTaskVisitDateResult,
  GetUserLatestVisitedTasksResult,
  CopyCardOptionsInteface,
  GetTaskTimeEstimatesResult,
  CreateTaskTimeEstimatesResult,
  UpdateTaskTimeEstimatesResult,
  GetOrganizationTasksScheduleResult,
  DeleteTaskTimeEstimatesResult,
} from '../types';

import { Id } from '../../common/identifier';

import {
  TaskDbRow,
  UserFollowsTaskDbRow,
  UserInTaskDbRow,
  TaskHasTagDbRow,
  TaskRole,
  TaskTimeEstimateDbRow,
} from '../../db/schema';
import { EventDelegate } from '../../../../../utils/EventDelegate';
import { QueryModifier } from '../../../../../services/types';

export interface TaskServiceInterface {
  createTask(
    id: Id,
    userId: Id,
    taskJson: TaskJson
  ): PromiseLike<CreateTaskResult>;

  doCreateTask(
    trx: Transaction,
    id: Id,
    userId: Id,
    taskJson: TaskJson
  ): PromiseLike<CreateTaskResult>;

  createTasks(tasks: TaskDbRow[], trx?: Transaction): PromiseLike<void>;

  updateTask(id: Id, taskJson, actorId?: Id): PromiseLike<UpdateTaskResult>;

  doUpdateTask(
    trx: Transaction,
    id,
    taskJson: TaskJson,
    actorId?: Id
  ): PromiseLike<UpdateTaskResult>;

  copyTask(
    sourceTaskId: Id,
    userId: Id,
    name: string,
    order: number,
    newTaskId?: Id,
    newTask?: Partial<TaskDbRow>,
    options?: CopyCardOptionsInteface
  ): PromiseLike<CopyTaskResult>;

  doCopyTask(
    trx: Transaction,
    sourceTaskId: Id,
    userId: Id,
    name: string,
    order: number,
    newTaskId?: Id,
    newTask?: Partial<TaskDbRow>
  ): PromiseLike<CopyTaskResult>;

  doRemoveTaskPeopleNotInProjectMembers(
    taskId: string,
    projectId: string,
    trx: Transaction
  ): PromiseLike<void>;

  getTaskById(id: Id): PromiseLike<TaskDbRow>;

  addTaskPeople(
    taskId: Id,
    userId: Id,
    role: TaskRole,
    actorId?: Id
  ): PromiseLike<AddTaskPeopleResult>;

  updateTaskPeopleRole(
    taskId: Id,
    userId: Id,
    role: TaskRole
  ): PromiseLike<UpdateTaskPeolpeResult>;

  deleteTaskPeopleRole(
    taskId: Id,
    userId: Id,
    actorId?: Id
  ): PromiseLike<DeleteTaskPeolpeResult>;

  doDeleteTaskPeopleRole(
    trx: Transaction,
    taskId: Id,
    userId: Id,
    actorId?: Id
  ): PromiseLike<DeleteTaskPeolpeResult>;

  attachTagsToTasks(
    tasksWithTags: TaskHasTagDbRow[],
    trx: Transaction
  ): PromiseLike<void>;

  detachTagFromTask(taskId, tagId): PromiseLike<DetachTagFromTaskResult>;

  attachTagToTask(taskId: Id, tagId: Id): PromiseLike<AttachTagToTaskResult>;

  detachTagFromTask(
    taskId: Id,
    tagId: Id
  ): PromiseLike<DetachTagFromTaskResult>;

  attachFileToTask(
    taskId: Id,
    fileId: Id,
    actorId?: Id
  ): PromiseLike<AttachFileToTaskResult>;

  detachFileFromTask(
    taskId: Id,
    fileId: Id
  ): PromiseLike<DetachFileFromTaskResult>;

  getTaskChecklist(taskId: Id): PromiseLike<GetTaskChecklistResult>;

  addTaskFollower(taskId: Id, userId: Id): PromiseLike<AddTaskFollowerResult>;

  removeTaskFollower(
    taskId: Id,
    userId: Id
  ): PromiseLike<RemoveTaskFollowerResult>;

  removeTasksFollower(
    taskIds: Id[],
    userId: Id,
    trx?: Transaction
  ): PromiseLike<RemoveTasksFollowerResult>;

  getTaskAttachmentIds(taskId: Id): PromiseLike<Id[]>;

  getTasksPeople(
    taskIds: Array<Id>,
    trx?: Transaction
  ): PromiseLike<TaskPeopleMap>;

  getTaskFollowerIdsWithAssignees(taskId: Id): PromiseLike<Id[]>;

  getTaskFollowerIds(taskId: Id): PromiseLike<Id[]>;

  getTasksFollowers(
    taskIds: Array<Id>,
    trx?: Transaction
  ): PromiseLike<TaskFollowersMap>;

  getTasksTags(taskIds: Array<Id>): PromiseLike<TaskTagsMap>;

  getUsersFollowingTasks(
    taskIds: Array<Id>
  ): PromiseLike<Array<UserFollowsTaskDbRow>>;

  getTaskPeople(taskId: Id): PromiseLike<Array<UserInTaskDbRow>>;

  getUsersInTasks(taskIds: Array<Id>): PromiseLike<Array<UserInTaskDbRow>>;

  getTasksUserIsAssigneeOf(
    userId: Id,
    decorateQuery?: QueryModifier
  ): PromiseLike<any>;

  getTasksByIds(tasksIds: Array<Id>): PromiseLike<TaskDbRow[]>;

  setUserLatestTaskVisitDate(
    userId: Id,
    taskId: Id,
    visitedAt: Date
  ): PromiseLike<SetUserLatestTaskVisitDateResult>;

  getUserLatestVisitedTasks(
    userId: Id,
    organizationId: Id,
    count: number
  ): PromiseLike<GetUserLatestVisitedTasksResult>;

  /**
   * Returns number of tasks (including archived) that user has created.
   * If organizationId is provided, then only tasks from that organization are
   * counted.
   *
   * @param {Id} userId
   * @param {Id} organizationId
   * @return {PromiseLike<number>}
   */
  getCreatedTaskCount(
    userId: Id,
    organizationId?: Id,
    trx?: Transaction
  ): PromiseLike<number>;

  taskCreatedEvent: EventDelegate<TaskCreatedEventData>;

  getListsLastTasksOrder(
    listIds: Id[],
    trx?: Transaction
  ): PromiseLike<TaskOrderByListId>;

  getTaskTimeEstimates(
    taskId: Id,
    trx?: Transaction
  ): PromiseLike<GetTaskTimeEstimatesResult>;

  createTaskTimeEstimates(
    payload: Partial<TaskTimeEstimateDbRow>,
    actorId: Id,
    trx?: Transaction
  ): PromiseLike<CreateTaskTimeEstimatesResult>;

  updateTaskTimeEstimates(
    payload: Partial<TaskTimeEstimateDbRow>,
    actorId: Id,
    trx?: Transaction
  ): PromiseLike<UpdateTaskTimeEstimatesResult>;

  deleteTaskTimeEstimates(
    taskId: Id,
    actorId: Id,
    trx?: Transaction
  ): PromiseLike<DeleteTaskTimeEstimatesResult>;

  getOrganizationTasksSchedule(
    organizationId: Id,
    currentUserId: Id
  ): PromiseLike<GetOrganizationTasksScheduleResult>;
}
