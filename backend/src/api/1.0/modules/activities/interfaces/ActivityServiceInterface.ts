import { Id } from "../../common/identifier";
import { ActivityDbRow, TargetType, TaskDbRow, ListDbRow, ContainerType } from "../../db/schema";
import { GetActivitiesResult, Changes } from "../types";


export interface ActivityServiceInterface {

  /**
   * @param {string} containerType
   * @param {Id} containerId
   * @return {Promise<GetActivitiesResult>}
   */
  getActivities(containerType: ContainerType, containerId: Id, page: string, limit: number): Promise<GetActivitiesResult>

  createActivity(activity: ActivityDbRow): Promise<boolean>

  createActivityContainer(containerId: Id, activityId: Id, containerType: string): Promise<boolean>

  createActivityTarget(targetId: Id, activityId: Id, targetType: string): Promise<boolean>

  createActivityChanges(activityId: Id, changes?: Changes): Promise<boolean>

  createActivityTaskCreated(task: TaskDbRow, creatorId: Id, trx?: Transaction): Promise<boolean>

  createActivityTaskUpdated(task: TaskDbRow, creatorId: Id, changes: Changes, trx?: Transaction): Promise<boolean>

  createActivityTaskPeopleAdded(taskId: Id, creatorId: Id, userId: Id, trx?: Transaction): Promise<boolean>

  createActivityTaskPeopleDeleted(taskId: Id, creatorId: Id, userId: Id, trx?: Transaction): Promise<boolean>

  createActivityChecklistAssigneesAdded(checklistItemId: Id, creatorId: Id, userId: Id, trx?: Transaction): Promise<boolean>

  createActivityChecklistAssigneesRemoved(checklistItemId: Id, creatorId: Id, userId: Id, trx?: Transaction): Promise<boolean>

  createActivityTaskListCreated(list: ListDbRow, creatorId: Id, trx?: Transaction): Promise<boolean>

  createActivityTaskListUpdated(listId: Id, creatorId: Id, changes: Changes, trx?: Transaction): Promise<boolean>

  createActivityProjectPeopleAdded(projectId: Id, creatorId: Id, userId: Id, trx?: Transaction): Promise<boolean>

  createActivityProjectPeopleDeleted(projectId: Id, creatorId: Id, userId: Id, trx?: Transaction): Promise<boolean>

  createActivityProjectUpdated(projectId: Id, creatorId: Id, changes: Changes, trx?: Transaction): Promise<boolean>

  createActivityFileAttachedToTask(fileId: Id, taskId: Id, creatorId: Id, trx?: Transaction): Promise<boolean>

  createActivityCustomFieldValueUpdate(
    creatorId: Id,
    targetType: TargetType,
    targetId: Id,
    changes: Changes,
    trx?: Transaction
  ): Promise<boolean>
}
