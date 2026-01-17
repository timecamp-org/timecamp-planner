import { Id } from '../../common/identifier';
import {
  ActivityDbRow,
  ContainerType,
  ListDbRow,
  ProjectDbRow,
  TargetType,
  TaskDbRow,
  TaskTimeEstimateDbRow,
} from '../../db/schema';
import { Changes, GetActivitiesResult } from '../types';

export interface ActivityServiceInterface {
  /**
   * @param {string} containerType
   * @param {Id} containerId
   * @return {PromiseLike<GetActivitiesResult>}
   */
  getActivities(
    containerType: ContainerType,
    containerId: Id,
    page: string,
    limit: number
  ): PromiseLike<GetActivitiesResult>;

  createActivity(activity: ActivityDbRow): PromiseLike<boolean>;

  createActivityContainer(containerId: Id, activityId: Id, containerType: string): PromiseLike<boolean>;

  createActivityTarget(targetId: Id, activityId: Id, targetType: string): PromiseLike<boolean>;

  createActivityChanges<T>(activityId: Id, changes?: Changes<T>): PromiseLike<boolean>;

  createActivityTaskCreated(task: TaskDbRow, creatorId: Id, trx?: Transaction): PromiseLike<boolean>;

  createActivityTaskUpdated(
    task: TaskDbRow,
    creatorId: Id,
    changes: Changes<TaskDbRow>,
    trx?: Transaction
  ): PromiseLike<boolean>;

  createActivityTaskPeopleAdded(taskId: Id, creatorId: Id, userId: Id, trx?: Transaction): PromiseLike<boolean>;

  createActivityTaskPeopleDeleted(taskId: Id, creatorId: Id, userId: Id, trx?: Transaction): PromiseLike<boolean>;

  createActivityChecklistAssigneesAdded(
    checklistItemId: Id,
    creatorId: Id,
    userId: Id,
    trx?: Transaction
  ): PromiseLike<boolean>;

  createActivityChecklistAssigneesRemoved(
    checklistItemId: Id,
    creatorId: Id,
    userId: Id,
    trx?: Transaction
  ): PromiseLike<boolean>;

  createActivityTaskListCreated(list: ListDbRow, creatorId: Id, trx?: Transaction): PromiseLike<boolean>;

  createActivityTaskListUpdated(
    listId: Id,
    creatorId: Id,
    changes: Changes<ListDbRow>,
    trx?: Transaction
  ): PromiseLike<boolean>;

  createActivityProjectPeopleAdded(projectId: Id, creatorId: Id, userId: Id, trx?: Transaction): PromiseLike<boolean>;

  createActivityProjectPeopleDeleted(projectId: Id, creatorId: Id, userId: Id, trx?: Transaction): PromiseLike<boolean>;

  createActivityProjectUpdated(
    projectId: Id,
    creatorId: Id,
    changes: Changes<ProjectDbRow>,
    trx?: Transaction
  ): PromiseLike<boolean>;

  createActivityFileAttachedToTask(fileId: Id, taskId: Id, creatorId: Id, trx?: Transaction): PromiseLike<boolean>;

  createActivityCustomFieldValueUpdate(
    creatorId: Id,
    targetType: TargetType,
    targetId: Id,
    changes: Changes<TaskDbRow>,
    trx?: Transaction
  ): PromiseLike<boolean>;

  createActivityTaskTimeEstimateUpdated(
    estimate: TaskTimeEstimateDbRow,
    creatorId: Id,
    changes: Changes<Pick<TaskTimeEstimateDbRow, 'minutes'>>,
    trx: Transaction
  ): PromiseLike<boolean>;
}
