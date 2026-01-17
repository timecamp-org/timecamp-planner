
import Table, { ForeignKey, UniqueKey } from '../db/Table'
import {
  TaskDbRow,
  TaskRole,
  UserFollowsTaskDbRow,
  UserInTaskDbRow,
  TaskAttachmentDbRow,
  TaskHasTagDbRow,
  FileDbRow,
  ContainerType,
} from '../db/schema'
import { first, union, get } from 'lodash'

import { EventDelegate } from '../../../../utils/EventDelegate'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { violatesForeignKey, violatesUniqueKey } from '../../../../utils'
import * as types from './types';
import { TaskServiceInterface } from './interfaces/TaskServiceInterface';
import { inject, injectable } from 'inversify';
import { FilesModule } from '../files/FilesModule';
import { TimeServiceInterface } from '../common/time/TimeServiceInterface';
import { CommonModule } from '../common/CommonModule';
import { Id, generateId } from '../common/identifier';
import { ChecklistModule } from '../checklist/ChecklistModule';
import { ChecklistItemServiceInterface } from '../checklist/ChecklistItemServiceInterface';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { OrderModule } from '../order/OrderModule';
import { OrderServiceInterface } from '../order/OrderServiceInterface';
import { OrderServiceFactoryInterface } from '../order/OrderServiceFactoryInterface';
import { TaskProviderInterface } from './interfaces/TaskProviderInterface'
import { TasksModule } from './TasksModule'
import {
  GetUserLatestVisitedTasksResult,
  GetUserLatestVisitedTasksStatus,
  SetUserLatestTaskVisitDateResult,
  SetUserLatestTaskVisitDateResultStatus,
  CopyCardOptionsInteface
} from './types'
import { UserServiceInterface } from '../users/UserServiceInterface'
import { UsersModule } from '../users/UsersModule'
import { OrganizationsModule } from '../organizations/OrganizationsModule'
import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { QueryModifier } from '../../../../services/types'
import { ActivityServiceInterface } from '../activities/interfaces/ActivityServiceInterface';
import { ActivitiesModule } from '../activities/ActivitiesModule';
import { FileProviderInterface } from '../files/interfaces/FileProviderInterface';
import { FileServiceInterface } from '../files/interfaces/FileServiceInterface';
import { DeleteFileStatus } from '../files/types';
import { AttachmentServiceInterface } from '../files/interfaces/AttachmentServiceInterface';
import { TaskAttachmentProviderInterface } from './interfaces/TaskAttachmentProviderInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { UserInTaskProviderInterface } from './interfaces/UserInTaskProviderInterface';
import { UserFollowingTaskProviderInterface } from './interfaces/UserFollowingTaskProviderInterface';

const defaultCopyCardOptions: CopyCardOptionsInteface = {
  withAttachments: true,
}

@injectable()
export class TaskService
implements TaskServiceInterface {

  public taskCreatedEvent: EventDelegate<types.TaskCreatedEventData>;
  private orderService: OrderServiceInterface

  constructor(
    @inject(InfrastructureModule.LoggerInterface)
      logger: LoggerInterface,
    @inject(ChecklistModule.ChecklistItemServiceInterface)
    private checklistItemsService: ChecklistItemServiceInterface,
    @inject(FilesModule.FileProviderInterface)
    private fileProvider: FileProviderInterface,
    @inject(FilesModule.FileServiceInterface)
    private fileService: FileServiceInterface,
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(FilesModule.AttachmentServiceInterface)
    private attachmentService: AttachmentServiceInterface,
    @inject(TasksModule.TaskAttachmentProviderInterface)
    private taskAttachmentProvider: TaskAttachmentProviderInterface,
    @inject(OrderModule.OrderServiceFactoryInterface)
    orderFactoryService: OrderServiceFactoryInterface,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private organizationProvider: OrganizationProviderInterface,
    @inject(ActivitiesModule.ActivityServiceInterface)
    private activityService: ActivityServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
    @inject(TasksModule.UserInTaskProviderInterface)
    private userInTaskProvider: UserInTaskProviderInterface,
    @inject(TasksModule.UserFollowingTaskProviderInterface)
    private userFollowingTaskProvider: UserFollowingTaskProviderInterface,
  ) {
    this.orderService = orderFactoryService.create<TaskDbRow>(Table.TASK, 'taskListId', 'order')
    this.taskCreatedEvent = new EventDelegate<types.TaskCreatedEventData>(logger);
  }

  async createTask(id: Id, userId: Id, taskJson: types.TaskJson): Promise<types.CreateTaskResult> {
    return await this.connection.getConnection().transaction(async (trx) => {
      return this.doCreateTask(trx, id, userId, taskJson)
    })
  }

  async doCreateTask(trx: Transaction, id: Id, userId: Id, taskJson: types.TaskJson): Promise<types.CreateTaskResult> {
    try {
      if (!taskJson.projectId) {
        return { status: types.CreateTaskStatus.PROJECT_NOT_FOUND }
      }
      if (!taskJson.taskListId) {
        return { status: types.CreateTaskStatus.LIST_NOT_FOUND }
      }

      const validationResult = this.validateTaskJson(taskJson)
      switch (validationResult.status) {
        case types.TaskJsonValidationStatus.DUE_DATE_EARLIER_THAN_START_DATE:
          return { status: types.CreateTaskStatus.DUE_DATE_EARLIER_THAN_START_DATE }

        default:
          break;
      }

      const taskRow: Partial<TaskDbRow> = this.getTaskDbRowFromTaskJson(taskJson)
      taskRow.creatorId = userId
      taskRow.id = id

      const task = await this.taskProvider.insertTask(taskRow, trx)

      await this.orderService.moveItemsToMakeRoomInTheList(trx, id, task.taskListId, task.order)

      await this.activityService.createActivityTaskCreated(task, task.creatorId, trx)

      await this.taskCreatedEvent.triggerEvent({
        task,
        creatorId: userId,
        trx,
      })
      return { status: types.CreateTaskStatus.OK, task }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.TASK_ID)) {
        return { status: types.CreateTaskStatus.TASK_ALREADY_EXISTS }
      } else if (violatesUniqueKey(error, UniqueKey.TASK_ORDER_FOR_TASK_LIST)) {
        return { status: types.CreateTaskStatus.TASK_WITH_ORDER_ALREADY_EXISTS }
      } else {
        throw error;
      }
    }
  }

  async createTasks(tasks: TaskDbRow[], trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .insert(tasks)
      .into(Table.TASK)
      .returning('*')
  }

  async attachTagsToTasks(tasksWithTags: TaskHasTagDbRow[], trx: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .insert(tasksWithTags)
      .into(Table.TASK_HAS_TAG)
      .returning('*')
  }

  async updateTask(id: Id, taskJson: types.TaskJson, actorId?: Id): Promise<types.UpdateTaskResult> {
    try {
      return await this.connection.getConnection().transaction(trx => this.doUpdateTask(
        trx,
        id,
        taskJson,
        actorId
      ));
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.TASK_ORDER_FOR_TASK_LIST)) {
        return { status: types.UpdateTaskStatus.TASK_WITH_ORDER_ALREADY_EXISTS }
      } else {
        throw error;
      }
    }
  }

  async doUpdateTask(trx: Transaction, id: Id, taskJson: types.TaskJson, actorId?: Id): Promise<types.UpdateTaskResult> {
    const old = await this.connection.getQueryBuilder()
      .select<TaskDbRow>()
      .from(Table.TASK)
      .transacting(trx)
      .first()
      .where('id', id)

    if (!old) {
      return { status: types.UpdateTaskStatus.TASK_NOT_FOUND }
    }

    const validationResult = this.validateTaskJson(taskJson, old)
    switch (validationResult.status) {
      case types.TaskJsonValidationStatus.DUE_DATE_EARLIER_THAN_START_DATE:
        return { status: types.UpdateTaskStatus.DUE_DATE_EARLIER_THAN_START_DATE }

      default:
        break;
    }

    const newTaskOrder = this.getTaskNewOrder(old, taskJson)
    if (newTaskOrder !== undefined) {
      taskJson.order = newTaskOrder
    }

    if (taskJson.order >= 0 && (taskJson.order !== old.order || taskJson.taskListId !== old.taskListId)) {
      await this.orderService.moveItemsToMakeRoomInTheList(trx, id, taskJson.taskListId || old.taskListId, taskJson.order)
    }

    const result = await this.connection.getQueryBuilder()
      .from(Table.TASK)
      .transacting(trx)
      .where('id', id)
      .update(taskJson)
      .returning('*')
      .then<TaskDbRow>(first)

    if (taskJson.projectId) {
      await this.removeTaskPeopleWithoutProjectAccess(taskJson.projectId, id, trx)
    }

    await this.activityService.createActivityTaskUpdated(result, actorId, { new: this.getTaskDbRowFromTaskJson(taskJson), old }, trx)

    return { status: types.UpdateTaskStatus.OK }
  }

  validateTaskJson(newTaskJson: types.TaskJson, oldTask?: TaskDbRow): types.TaskJsonValidationResult {
    if (this.isDueDateAndStartDateIncorrect(newTaskJson, oldTask)) {
      return { status: types.TaskJsonValidationStatus.DUE_DATE_EARLIER_THAN_START_DATE }
    }

    return { status: types.TaskJsonValidationStatus.OK }
  }

  getTaskDbRowFromTaskJson(taskJson: types.TaskJson): Partial<TaskDbRow> {
    const newFields: any = { ...taskJson }

    if (taskJson.dueDate) {
      newFields.dueDate = this.timeService.getDateFromString(taskJson.dueDate)
    }

    if (taskJson.startDate) {
      newFields.startDate = this.timeService.getDateFromString(taskJson.startDate)
    }

    return newFields
  }

  isDueDateAndStartDateIncorrect(newTaskJson: types.TaskJson, oldTask?: TaskDbRow) {
    const newTaskRow = this.getTaskDbRowFromTaskJson(newTaskJson)
    const dueDate = get(newTaskRow, 'dueDate', oldTask && oldTask.dueDate)
    const startDate = get(newTaskRow, 'startDate', oldTask && oldTask.startDate)
    const isEqual = this.timeService.isDateEqual(dueDate, startDate)
    const isDueDateAfterStartDate = this.timeService.isDate1AfterDate2(dueDate, startDate)

    return dueDate && startDate && !(isEqual || isDueDateAfterStartDate)
  }

  getTaskNewOrder(oldTask: TaskDbRow, newTask: types.TaskJson): number {
    if (newTask.isArchived === true) {
      return null
    }

    if (newTask.isArchived === false && oldTask.isArchived === true) {
      return 1
    }

    return newTask.order
  }

  async removeTaskPeopleWithoutProjectAccess(projectId: Id, taskId: Id, trx: Transaction): Promise<void> {
    // TODO: Refactor ProjectService/TaskService to resolve circular dependency
    // TODO: and use ProjectService here instead of raw query to Table.PROJECT
    const { isPrivate: projectIsPrivate } = await this.connection.getQueryWithTransaction(trx)
      .from(Table.PROJECT)
      .select('isPrivate')
      .first()
      .where('id', projectId)

    if (projectIsPrivate) {
      await this.doRemoveTaskPeopleNotInProjectMembers(taskId, projectId, trx)
    }
  }

  async doRemoveTaskPeopleNotInProjectMembers(taskId: Id, projectId: Id, trx: Transaction): Promise<void> {
    const projectMemberIds = await this.connection.getQueryWithTransaction(trx)
      .from(Table.USER_IN_PROJECT)
      .where('projectId', projectId)
      .pluck('user_id')

    const taskFollowerIdsPromise = this.getTaskFollowerIds(taskId, trx)
    const taskAssigneeIdsPromise = this.taskProvider.getTaskAssigneeIds(taskId, trx)

    const [
      taskFollowerIds = [],
      taskAssigneeIds = [],
    ] = await Promise.all([
      taskFollowerIdsPromise,
      taskAssigneeIdsPromise,
    ])

    const followerIdsToRemove = taskFollowerIds
      .filter(userId => !projectMemberIds.includes(userId))
    const assigneeIdsToRemove = taskAssigneeIds
      .filter(userId => !projectMemberIds.includes(userId))

    const removeFollowersPromise = this.removeTaskFollowersByIds(taskId, followerIdsToRemove, trx)

    const removeAssigneesPromise = this.removeTaskAssigneesByIds(taskId, assigneeIdsToRemove, trx)

    await Promise.all([removeFollowersPromise, removeAssigneesPromise])
  }

  async removeTaskFollowersByIds(taskId: Id, followerIdsToRemove: Array<Id>, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .from(Table.USER_FOLLOWS_TASK)
      .whereIn('userId', followerIdsToRemove)
      .andWhere('taskId', taskId)
      .del()
  }

  async removeTaskAssigneesByIds(taskId: Id, assigneeIdsToRemove: Array<Id>, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .from(Table.USER_IN_TASK)
      .whereIn('userId', assigneeIdsToRemove)
      .andWhere('taskId', taskId)
      .andWhere('role', TaskRole.ASSIGNEE)
      .del()
  }

  async getTaskById(id: Id, trx?: Transaction): Promise<TaskDbRow> {
    return await this.taskProvider.getTaskById(id, trx);
  }

  async getTasksByIds(tasksIds): Promise<TaskDbRow[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.TASK)
      .whereIn('id', tasksIds)
  }

  async doAddTaskPeople(trx: Transaction, taskId: Id, userId: Id, role: TaskRole, actorId?: Id): Promise<types.AddTaskPeopleResult> {
    try {
      const taskPerson = {
        role,
        taskId,
        userId
      }
      await this.connection.getQueryBuilder()
        .transacting(trx)
        .insert(taskPerson)
        .into(Table.USER_IN_TASK)

      await this.activityService.createActivityTaskPeopleAdded(taskId, actorId, userId, trx)
      return { status: types.AddTaskPeopleStatus.OK }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.USER_IN_TASK)) {
        return { status: types.AddTaskPeopleStatus.USER_ALREADY_IN_TASK }
      } else if (violatesForeignKey(error, ForeignKey.USER_IN_TASK_TASK_ID)) {
        return { status: types.AddTaskPeopleStatus.TASK_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_IN_TASK_USER_ID)) {
        return { status: types.AddTaskPeopleStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }

  }

  async addTaskPeople(taskId: Id, userId: Id, role: TaskRole, actorId?: Id): Promise<types.AddTaskPeopleResult> {
    return await this.connection.getConnection().transaction(async (trx) => {
      return await this.doAddTaskPeople(trx, taskId, userId, role, actorId)
    })
  }

  async updateTaskPeopleRole(taskId: Id, userId: Id, role: TaskRole): Promise<types.UpdateTaskPeolpeResult> {
    const affectedRowsNumber = await this.connection.getQueryBuilder()
      .from(Table.USER_IN_TASK)
      .update({ role })
      .where('taskId', taskId)
      .where('user_id', userId)

    if (affectedRowsNumber === 0) {
      return { status: types.UpdateTaskPeopleStatus.TASK_PEOPLE_NOT_FOUND }
    } else {
      return { status: types.UpdateTaskPeopleStatus.OK }
    }
  }

  async deleteTaskPeopleRole(taskId: Id, userId: Id, actorId?: Id): Promise<types.DeleteTaskPeolpeResult> {
    return await this.connection.getConnection().transaction(async (trx) => {
      return await this.doDeleteTaskPeopleRole(trx, taskId, userId, actorId)
    })
  }

  async doDeleteTaskPeopleRole(trx: Transaction, taskId: Id, userId: Id, actorId?: Id): Promise<types.DeleteTaskPeolpeResult> {
    const affectedRowsNumber = await this.connection.getQueryBuilder()
      .from(Table.USER_IN_TASK)
      .transacting(trx)
      .where('taskId', taskId)
      .where('user_id', userId)
      .del()

    await this.activityService.createActivityTaskPeopleDeleted(taskId, actorId, userId, trx)

    if (affectedRowsNumber === 0) {
      return {
        status: types.DeleteTaskPeopleStatus.TASK_PEOPLE_NOT_FOUND
      }
    } else {
      return {
        status: types.DeleteTaskPeopleStatus.OK
      }
    }
  }

  async attachTagToTask(taskId: Id, tagId: Id): Promise<types.AttachTagToTaskResult> {
    try {
      await this.connection.getQueryBuilder()
        .insert({
          taskId,
          tagId
        })
        .into(Table.TASK_HAS_TAG)

      return { status: types.AttachTagToTaskStatus.OK }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.TASK_HAS_TAG)) {
        return { status: types.AttachTagToTaskStatus.TASK_ALREADY_HAS_TAG }
      } else if (violatesForeignKey(error, ForeignKey.TASK_HAS_TAG_TAG_ID)) {
        return { status: types.AttachTagToTaskStatus.TAG_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.TASK_HAS_TAG_TASK_ID)) {
        return { status: types.AttachTagToTaskStatus.TASK_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async detachTagFromTask(taskId: Id, tagId: Id): Promise<types.DetachTagFromTaskResult> {
    const affectedRowsNumber = await this.connection.getQueryBuilder()
      .from(Table.TASK_HAS_TAG)
      .where('taskId', taskId)
      .where('tag_id', tagId)
      .del()

    if (affectedRowsNumber === 0) {
      return { status: types.DetachTagFromTaskStatus.TASK_TAG_NOT_FOUND }
    } else {
      return { status: types.DetachTagFromTaskStatus.OK }
    }
  }

  async attachFileToTask(taskId: Id, fileId: Id, actorId?: Id): Promise<types.AttachFileToTaskResult> {
    try {
      await this.connection.getConnection().transaction(async (trx) => {
        await this.taskAttachmentProvider.createTaskAttachment(taskId, fileId, trx)
        await this.activityService.createActivityFileAttachedToTask(fileId, taskId, actorId, trx)
      })
      return { status: types.AttachFileToTaskStatus.OK }
    } catch (error) {
      if (violatesForeignKey(error, ForeignKey.TASK_ATTACHMENT_FILE_ID)) {
        return { status: types.AttachFileToTaskStatus.FILE_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.TASK_ATTACHMENT_TASK_ID)) {
        return { status: types.AttachFileToTaskStatus.TASK_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async detachFileFromTask(taskId: Id, fileId: Id): Promise<types.DetachFileFromTaskResult> {
    return await this.connection.getConnection().transaction(async (trx) => {
      const affectedRowsNumber = await this.taskAttachmentProvider.deleteTaskAttachment(taskId, fileId, trx)
      if (affectedRowsNumber === 0) {
        return { status: types.DetachFileFromTaskStatus.TASK_ATTACHMENT_NOT_FOUND }
      }

      const isFileAttached = await this.attachmentService.isFileAttached(ContainerType.TASK, taskId, fileId, trx)
      if (!isFileAttached) {
        const { status } = await this.fileService.doDeleteFile(trx, fileId)
        if (status !== DeleteFileStatus.OK) {
          return { status: types.DetachFileFromTaskStatus.FILE_NOT_FOUND }
        }
      }
      return { status: types.DetachFileFromTaskStatus.OK }
    })
  }

  async getTaskChecklist(taskId: Id, trx?: Transaction): Promise<types.GetTaskChecklistResult> {
    const task = await this.getTaskById(taskId, trx)
    if (!task) {
      return { status: types.GetTaskChecklistStatus.TASK_NOT_FOUND }
    }
    const checklist = await this.checklistItemsService.getChecklistItemsWhereTaskId(taskId, null, trx)

    return { status: types.GetTaskChecklistStatus.OK, data: checklist }
  }

  async copyTask(
    sourceTaskId: Id,
    userId: Id,
    name: string,
    order: number,
    newTaskId?: Id,
    newTask?: Partial<TaskDbRow>,
    options?: CopyCardOptionsInteface,
  ): Promise<types.CopyTaskResult> {
    return await this.connection.getConnection().transaction(async (trx) => {
      return await this.doCopyTask(trx, sourceTaskId, userId, name, order, newTaskId, newTask, options)
    })
  }

  async doCopyTask(
    trx: Transaction,
    sourceTaskId: Id,
    userId: Id,
    name: string,
    order: number,
    newTaskId?: Id,
    newTask?: Partial<TaskDbRow>,
    options?: CopyCardOptionsInteface,
  ): Promise<types.CopyTaskResult> {

    const copyCardOptions: CopyCardOptionsInteface = { ...defaultCopyCardOptions, ...options }

    const relatedObjectsResult = await this.getTaskRelatedObjects(sourceTaskId, copyCardOptions, trx)
    if (!relatedObjectsResult.data) {
      return { status: types.CopyTaskStatus.TASK_NOT_FOUND }
    }


    const dataToInsert: types.TaskRelatedObjectsInsertData = await this.prepareTaskRelatedObjectsToInsert(
      relatedObjectsResult.data,
      userId,
      name,
      order,
      newTaskId,
      copyCardOptions,
    )

    if (newTask) {
      dataToInsert.task = { ...dataToInsert.task, ...newTask }
    }

    // insert all prepared data to db
    await this.doInsertTaskRelatedObjects(trx, dataToInsert, userId, copyCardOptions)

    await this.activityService.createActivityTaskCreated(dataToInsert.task, userId, trx)

    return {
      status: types.CopyTaskStatus.OK,
      newTaskId: dataToInsert.task.id,
    }
  }

  public async doInsertTaskRelatedObjects(
    trx: Transaction,
    dataToInsert: types.TaskRelatedObjectsInsertData,
    userId: Id,
    copyCardOptions: CopyCardOptionsInteface,
  ): Promise<void> {
    await this.connection.getQueryBuilder()
      .transacting(trx)
      .insert(dataToInsert.task)
      .into(Table.TASK)

    await this.orderService.moveItemsToMakeRoomInTheList(trx, dataToInsert.task.id, dataToInsert.task.taskListId, dataToInsert.task.order)

    let promises: types.TaskRelatedDataPromise[] = [];
  

    if (dataToInsert.taskFollowers.length) {
      promises.push(this.connection.getQueryBuilder()
        .transacting(trx)
        .insert(dataToInsert.taskFollowers)
        .into(Table.USER_FOLLOWS_TASK))
    }

    if (dataToInsert.taskPeople.length) {
      const addPeopleToTaskPromises = dataToInsert.taskPeople
        .map(userInTaskRow => this.doAddTaskPeople(
          trx,
          dataToInsert.task.id,
          userInTaskRow.userId,
          userInTaskRow.role,
          userId,
        ))
      promises = [...promises, ...addPeopleToTaskPromises]
    }


    if (dataToInsert.taskTags.length) {
      promises.push(this.connection.getQueryBuilder()
        .transacting(trx)
        .insert(dataToInsert.taskTags)
        .into(Table.TASK_HAS_TAG))
    }

    if (dataToInsert.checklistItems.length) {
      promises.push(this.connection.getQueryBuilder()
        .transacting(trx)
        .insert(dataToInsert.checklistItems)
        .into(Table.CHECKLIST_ITEM))
    }

    if (copyCardOptions.withAttachments && dataToInsert.taskAttachments.length) {
      const insertTaskAttachmentsPromise = this.connection.getQueryBuilder()
        .transacting(trx)
        .insert(dataToInsert.taskAttachments)
        .into(Table.TASK_ATTACHMENT)
      promises.push(insertTaskAttachmentsPromise)
    }

    await Promise.all(promises)
  }

  private async getTaskRelatedObjects(taskId: Id, copyCardOptions: CopyCardOptionsInteface, trx?: Transaction): Promise<types.GetTaskRelatedObjectsResult> {
    const task: TaskDbRow = await this.getTaskById(taskId, trx)
    if (!task) {
      return { status: types.GetTaskRelatedObjectsStatus.TASK_NOT_FOUND }
    }

    const taskFollowerIdsPromise = this.getTaskFollowerIds(taskId, trx)
    const taskPeoplePromise = this.getTaskPeople(taskId, trx)
    const taskTagIdsPromise = this.getTaskTags(taskId, trx)
    const taskChecklistPromise = this.getTaskChecklist(taskId, trx)

    let promises = []
    promises = [
      taskFollowerIdsPromise,
      taskPeoplePromise,
      taskTagIdsPromise,
      taskChecklistPromise,
    ]

    if (copyCardOptions.withAttachments) {
      const taskAttachmentIds = await this.getTaskAttachmentIds(taskId, trx)
      const filesPromise = this.fileProvider.getFilesByIds(taskAttachmentIds, trx)
      promises.push(filesPromise)
    }

    const [
      taskFollowerIds,
      taskPeople,
      taskTagIds,
      taskChecklistResult,
      taskAttachments,
    ] = await Promise.all(promises)

    const taskRelatedObjects: types.TaskRelatedObjectsData = {
      task,
      taskFollowerIds,
      taskPeople,
      taskTagIds,
      checklistItems: taskChecklistResult.data,
      taskAttachments,
    }

    return {
      status: types.GetTaskRelatedObjectsStatus.OK,
      data: taskRelatedObjects,
    }
  }

  private async prepareTaskRelatedObjectsToInsert(
    data: types.TaskRelatedObjectsData,
    userId: Id,
    name: string,
    order: number,
    newTaskId?: Id,
    copyCardOptions: CopyCardOptionsInteface = defaultCopyCardOptions,
  ): Promise<types.TaskRelatedObjectsInsertData> {
    // prepare all rows to insert
    newTaskId = newTaskId || generateId()
    const newTask = {
      ...data.task,
      id: newTaskId,
      name,
      creatorId: userId,
      order,
    }

    const newTaskFollowers: Array<UserFollowsTaskDbRow> = data.taskFollowerIds
      .map(followerId => ({
        taskId: newTaskId,
        userId: followerId
      }))

    const newTaskPeople: Array<UserInTaskDbRow> = data.taskPeople
      .map(user => ({
        ...user,
        taskId: newTaskId,
      }))

    const newTaskTags: Array<TaskHasTagDbRow> = data.taskTagIds
      .map(tagId => ({
        tagId,
        taskId: newTaskId
      }))

    const newChecklistItems = data.checklistItems.map(item => ({
      ...item,
      taskId: newTaskId,
      id: generateId(),
    }))

    const preparedTaskRelatedObjects: types.TaskRelatedObjectsInsertData = {
      task: newTask,
      taskFollowers: newTaskFollowers,
      taskPeople: newTaskPeople,
      taskTags: newTaskTags,
      checklistItems: newChecklistItems,
    }

    if (copyCardOptions.withAttachments) {
      const newTaskAttachments = this.prepareTaskAttachments(data.taskAttachments, newTaskId)
      preparedTaskRelatedObjects.taskAttachments = newTaskAttachments
    }

    return preparedTaskRelatedObjects
  }

  private prepareTaskAttachments(
    taskAttachments: FileDbRow[],
    newTaskId: Id,
  ): TaskAttachmentDbRow[] {
    if (!taskAttachments || taskAttachments.length === 0) {
      return []
    }
    return taskAttachments.map(file => ({
      fileId: file.id,
      taskId: newTaskId,
    }))
  }

  async addTaskFollower(taskId: Id, userId: Id): Promise<types.AddTaskFollowerResult> {
    try {
      const taskFollower = {
        taskId,
        userId,
      }

      await this.connection.getQueryBuilder()
        .insert(taskFollower)
        .into(Table.USER_FOLLOWS_TASK)

      return { status: types.AddTaskFollowerStatus.OK }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.USER_FOLLOWS_TASK)) {
        return { status: types.AddTaskFollowerStatus.USER_ALREADY_FOLLOWING_TASK }
      } else if (violatesForeignKey(error, ForeignKey.USER_FOLLOWS_TASK_TASK_ID)) {
        return { status: types.AddTaskFollowerStatus.TASK_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_FOLLOWS_TASK_USER_ID)) {
        return { status: types.AddTaskFollowerStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async removeTaskFollower(taskId: Id, userId: Id): Promise<types.RemoveTaskFollowerResult> {
    const affectedRowsNumber = await this.connection.getQueryBuilder()
      .from(Table.USER_FOLLOWS_TASK)
      .where('taskId', taskId)
      .where('user_id', userId)
      .del()

    if (affectedRowsNumber === 0) {
      return { status: types.RemoveTaskFollowerStatus.TASK_FOLLOWER_NOT_FOUND }
    }

    return { status: types.RemoveTaskFollowerStatus.OK }
  }

  async removeTasksFollower(taskIds: Id[], userId: Id, trx?: Transaction): Promise<types.RemoveTasksFollowerResult> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .from(Table.USER_FOLLOWS_TASK)
      .whereIn('taskId', taskIds)
      .where('user_id', userId)
      .del()

    return { status: types.RemoveTasksFollowerStatus.OK }
  }

  async getTaskPeople(taskId: Id, trx?: Transaction): Promise<Array<UserInTaskDbRow>> {
    const taskPeople = await this.connection.getQueryWithTransaction(trx)
      .from(Table.USER_IN_TASK)
      .where('taskId', taskId)

    return taskPeople
  }

  async getTasksPeople(tasksIds: Id[], trx?: Transaction): Promise<types.TaskPeopleMap> {
    const taskPeople = {}
    const usersInTasks = await this.getUsersInTasks(tasksIds, trx)
    tasksIds.forEach(taskId => {
      taskPeople[taskId] = usersInTasks
        .filter(userInTask => userInTask.taskId === taskId)
        .map(taskPerson => {
          return { userId: taskPerson.userId, role: taskPerson.role }
        })
    })

    return taskPeople
  }

  async getTaskAttachmentIds(taskId: Id, trx?: Transaction): Promise<Array<Id>> {
    return await this.connection.getQueryWithTransaction(trx)
      .select('fileId')
      .from(Table.TASK_ATTACHMENT)
      .where('taskId', taskId)
      .pluck('file_id')
  }

  async getTaskFollowerIdsWithAssignees(taskId: Id, trx?: Transaction): Promise<Id[]> {
    const usersInTask = await this.userInTaskProvider.getUserIdsInTask(taskId, trx)

    const taskFollowers = await this.userFollowingTaskProvider.getUserIdsFollowingTask(taskId, trx)

    return union(usersInTask, taskFollowers)
  }

  async getTaskFollowerIds(taskId: Id, trx?: Transaction): Promise<Id[]> {
    return await this.userFollowingTaskProvider.getUserIdsFollowingTask(taskId, trx)
  }

  async getTasksFollowers(tasksIds: Id[], trx?: Transaction): Promise<types.TaskFollowersMap> {
    const taskFollowers = {}
    const usersFollowingTasks = await this.getUsersFollowingTasks(tasksIds, trx)
    tasksIds.forEach(taskId => {
      taskFollowers[taskId] = usersFollowingTasks.filter(
        userFollowingTask => userFollowingTask.taskId === taskId).map(follower => follower.userId)
    })

    return taskFollowers
  }

  async getUsersFollowingTasks(tasksIds: Id[], trx?: Transaction): Promise<Array<UserFollowsTaskDbRow>> {
    return await this.connection.getQueryWithTransaction(trx)
      .from(Table.USER_FOLLOWS_TASK)
      .whereIn('taskId', tasksIds)
  }

  async getTaskTags(taskId: Id, trx?: Transaction): Promise<Array<Id>> {
    const taskTags = await this.connection.getQueryWithTransaction(trx)
      .from(Table.TASK_HAS_TAG)
      .where('taskId', taskId)

    return taskTags
      .map(taskTag => taskTag.tagId)
  }

  async getTasksTags(tasksIds: Id[]): Promise<types.TaskTagsMap> {
    const result = {}
    const tasksIdsTagsIds = await this.connection.getQueryBuilder()
      .from(Table.TASK_HAS_TAG)
      .whereIn('taskId', tasksIds)
    tasksIds.forEach(taskId => {
      result[taskId] = tasksIdsTagsIds
        .filter(userFollowingTask => userFollowingTask.taskId === taskId)
        .map(taskTag => taskTag.tagId)
    })
    return result
  }

  async getUsersInTasks(tasksIds: Id[], trx?: Transaction): Promise<Array<UserInTaskDbRow>> {
    return await this.connection.getQueryWithTransaction(trx)
      .from(Table.USER_IN_TASK)
      .whereIn('taskId', tasksIds)
  }

  // TODO: Check if task is in private project and if it is -> check if currentUser is member of that project
  async getTasksUserIsAssigneeOf(userId: Id, decorateQuery?: QueryModifier): Promise<any> {
    const query = this.connection.getQueryBuilder()
      .select(`${Table.TASK}.*`)
      .from(Table.TASK)
      .join(Table.USER_IN_TASK, `${Table.TASK}.id`, `${Table.USER_IN_TASK}.taskId`)
      .where({
        [`${Table.USER_IN_TASK}.userId`]: userId,
        [`${Table.USER_IN_TASK}.role`]: TaskRole.ASSIGNEE,
      })

    if (decorateQuery) {
      decorateQuery(query)
    }

    return await query
  }

  async getUserLatestVisitedTasks(userId: Id, organizationId: Id, count: number): Promise<GetUserLatestVisitedTasksResult> {
    const userPromise = this.userService.getUserById(userId)
    const organizationPromise = this.organizationProvider.getOrganization(organizationId)
    const [user, organization] = await Promise.all([userPromise, organizationPromise])

    if (!organization) {
      return {
        status: GetUserLatestVisitedTasksStatus.ORGANIZATION_NOT_FOUND
      }
    }

    if (!user) {
      return {
        status: GetUserLatestVisitedTasksStatus.USER_NOT_FOUND
      }
    }

    const data = await this.taskProvider.getUserLatestVisitedTasks(userId, organizationId, count)
    return {
      status: GetUserLatestVisitedTasksStatus.OK,
      data,
    }
  }

  async setUserLatestTaskVisitDate(userId: Id, taskId: Id, visitedAt: Date): Promise<SetUserLatestTaskVisitDateResult> {
    try {
      await this.taskProvider.setUserLatestTaskVisitDate(userId, taskId, visitedAt)

      return { status: SetUserLatestTaskVisitDateResultStatus.OK }
    } catch (error) {
      if (violatesForeignKey(error, ForeignKey.FK_TASK_LATEST_VISITED_TASK_ID)) {
        return { status: SetUserLatestTaskVisitDateResultStatus.TASK_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.FK_TASK_LATEST_VISITED_USER_ID)) {
        return { status: SetUserLatestTaskVisitDateResultStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async getCreatedTaskCount(userId: Id, organizationId?: Id, trx?: Transaction): Promise<number> {
    let query = this.connection.getQueryWithTransaction(trx)
      .count(`${Table.TASK}.id`)
      .from(Table.TASK)
      .where(`${Table.TASK}.creatorId`, userId)
      .first()
      ;

    if (organizationId) {
      query = query
        .join(Table.PROJECT, `${Table.TASK}.projectId`, `${Table.PROJECT}.id`)
        .where(`${Table.PROJECT}.organizationId`, organizationId)
    }

    const countResults = await query

    return parseInt(countResults.count as string);
  }

  async getListsLastTasksOrder(listIds: Id[], trx?: Transaction): Promise<types.TaskOrderByListId> {
    const taskOrderByListId: types.TaskOrderByListId = {}

    const listIdOrderRows = await this.connection.getQueryWithTransaction(trx)
      .select('taskListId')
      .max('order')
      .from(Table.TASK)
      .whereIn('taskListId', listIds)
      .groupBy('taskListId')

    listIdOrderRows.forEach(listIdAndOrder => {
      taskOrderByListId[listIdAndOrder.taskListId] = listIdAndOrder.max
    })

    return taskOrderByListId
  }
}
