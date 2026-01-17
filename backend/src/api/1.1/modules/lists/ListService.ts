
import Table, { ForeignKey, UniqueKey } from '../db/Table'
import { chain, set } from 'lodash'
import { generateId, Id } from '../common/identifier';

import {
  ListDbRow,
  ProjectType,
  TaskDbRow,
  TaskHasTagDbRow,
  UserFollowsTaskDbRow,
  UserInTaskDbRow,
  ChecklistItemDbRow,
} from '../db/schema'

import { violatesForeignKey, violatesUniqueKey } from '../../../../utils'
import { TaskChanges } from '../activities/types'
import { RemoveProjectFollowerEventData } from '../projects/types';
import { TaskServiceInterface } from '../tasks/interfaces/TaskServiceInterface';
import { inject, injectable } from 'inversify';
import { TasksModule } from '../tasks/TasksModule';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ListServiceInterface } from './interfaces/ListServiceInterface';
import {
  CreateListResult,
  CreateListStatus,
  UpdateListResult,
  UpdateListStatus,
  GetProjectListsAndListsFollowersResult,
  GetProjectListsAndListsFollowersStatus,
  AddListFollowerResult,
  AddListFollowerStatus,
  RemoveListFollowerResult,
  RemoveListFollowerStatus,
  RemoveListsFollowerResult,
  RemoveListsFollowerStatus,
  MoveAllTasksInListResult,
  MoveAllTasksInListStatus,
  CopyListResult,
  GetListRelatedObjectsResult,
  ListRelatedObjectsInsertData,
  CopyListStatus,
  GetListRelatedObjectsStatus,
  ListRelatedObjectsSourceData,
  ListIdsByTaskIds,
  ListNamesMap,
  ListMap,
  UpdateListJson,
  CreateListJson,
  ListOrderByProjectId,
  CopyListOptions,
  GetListResult,
  GetListStatus,
} from './types';
import { TagServiceInterface } from '../tags/TagServiceInterface';
import { TagsModule } from '../tags/TagsModule';
import { OrderModule } from '../order/OrderModule';
import { OrderServiceFactoryInterface } from '../order/OrderServiceFactoryInterface';
import { OrderServiceInterface } from '../order/OrderServiceInterface';
import { QueryModifier } from '../../../../services/types';
import { ListProviderInterface } from './interfaces/ListProviderInterface';
import { ListsModule } from './ListsModule';
import { ActivityServiceInterface } from '../activities/interfaces/ActivityServiceInterface';
import { ActivitiesModule } from '../activities/ActivitiesModule';
import { ListFollowersProviderInterface } from './interfaces/ListFollowersProviderInterface';
import { ChecklistItemServiceInterface } from '../checklist/ChecklistItemServiceInterface';
import { ChecklistModule } from '../checklist/ChecklistModule';
import { ProjectFollowersServiceInterface } from '../projects/interfaces/ProjectFollowersServiceInterface';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';
import { unarchivedListAndTasksModifier } from './queryDecorators';
import { UserInProjectProviderInterface } from '../projects/interfaces/UserInProjectProviderInterface';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { ConversationServiceInterface } from '../projects/interfaces/ConversationServiceInterface';

const defaultCopyListOptions: CopyListOptions = {
  shouldCopyListFollowers: true,
  shouldCopyTaskFollowers: true,
  shouldCopyTaskPeople: true,
}

@injectable()
export class ListService implements ListServiceInterface {

  private orderService: OrderServiceInterface

  constructor(
    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,
    @inject(TagsModule.TagServiceInterface)
    private tagService: TagServiceInterface,
    @inject(OrderModule.OrderServiceFactoryInterface)
    orderFactoryService: OrderServiceFactoryInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(ListsModule.ListFollowersProviderInterface)
    private listFollowersProvider: ListFollowersProviderInterface,
    @inject(ActivitiesModule.ActivityServiceInterface)
    private activityService: ActivityServiceInterface,
    @inject(ChecklistModule.ChecklistItemServiceInterface)
    private checklistItemsService: ChecklistItemServiceInterface,
    @inject(ProjectsModule.ProjectFollowersServiceInterface)
    private projectFollowersService: ProjectFollowersServiceInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProviderInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    this.taskService = taskService
    this.tagService = tagService
    this.orderService = orderFactoryService.create<ListDbRow>(Table.TASK_LIST, 'projectId', 'order')
    this.listProvider = listProvider
    this.listFollowersProvider = listFollowersProvider
    this.activityService = activityService
    this.checklistItemsService = checklistItemsService
    this.projectFollowersService = projectFollowersService
    this.userInProjectProvider = userInProjectProvider
    this.projectProvider = projectProvider

    this.attachToEntityEvents()
  }

  protected attachToEntityEvents() {
    this.projectFollowersService.removeProjectFollowerEvent.attach(this.removeProjectListsFollower.bind(this));
  }

  async createList(id: Id, listJson: CreateListJson): Promise<CreateListResult> {
    try {
      return await this.connection.getConnection().transaction(async (trx) => {
        listJson.id = id;
        const createdList = await this.listProvider.createList(listJson, trx);

        await this.orderService.moveItemsToMakeRoomInTheList(trx, id, listJson.projectId, listJson.order)

        await this.activityService.createActivityTaskListCreated(createdList, listJson.creatorId, trx)
        
        return {
          status: CreateListStatus.OK,
          list: createdList,
        }
      })

    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.LIST_ID)) {
        return { status: CreateListStatus.LIST_ALREADY_EXISTS }
      } else if (violatesUniqueKey(error, UniqueKey.TASK_LIST_ORDER_FOR_PROJECT)) {
        return { status: CreateListStatus.LIST_WITH_ORDER_ALREADY_EXISTS }
      } else {
        throw error;
      }
    }
  }

  async updateList(id: Id, listJson: UpdateListJson, actorId?: Id): Promise<UpdateListResult> {
    let status
    await this.connection.getConnection().transaction(async (trx) => {
      const previousList = await this.listProvider.getList(id, trx);

      if (listJson.isArchived === true) {
        listJson.order = null
      }

      if (listJson.isArchived === false && previousList.isArchived === true) {
        listJson.order = 1
      }

      if (previousList && listJson.order >= 0 && (listJson.order !== previousList.order || listJson.projectId !== previousList.projectId)) {
        await this.orderService.moveItemsToMakeRoomInTheList(trx, id, listJson.projectId || previousList.projectId, listJson.order)
      }

      const affectedRowsNumber = await this.listProvider.updateList(id, listJson, trx);

      if (affectedRowsNumber === 0) {
        status = UpdateListStatus.LIST_NOT_FOUND
      } else {
        await this.activityService.createActivityTaskListUpdated(id, actorId, { new: listJson, old: previousList }, trx)

        const destinationProjectId = listJson.projectId
        if (destinationProjectId && previousList.projectId !== destinationProjectId) {
          await this.updateListTasksDestinationProject(id, destinationProjectId, actorId, trx);
        }

        status = UpdateListStatus.OK
      }
    })

    return { status }
  }

  async getList(taskListId: Id): Promise<GetListResult> {
    const taskList = await this.listProvider.getList(taskListId)

    if (!taskList) {
      return {
        status: GetListStatus.LIST_NOT_FOUND
      }
    }

    return {
      list: taskList,
      status: GetListStatus.OK
    }
  }

  private async updateListTasksDestinationProject(taskListId: Id, destinationProjectId: Id, actorId: Id, trx: Transaction) {
    const listTaskIds = await this.listProvider.getListsTaskIds([taskListId], trx)
    const updateTaskPromises = listTaskIds
      .map(async taskId => {
        await this.taskService.doUpdateTask(trx, taskId, { projectId: destinationProjectId }, actorId);
        return
      })

    const manageListPeoplePromise = this.manageListPeopleAfterUpdate(taskListId, destinationProjectId, trx)

    await Promise.all([
      ...updateTaskPromises,
      manageListPeoplePromise,
    ])
  }

  async getProjectsLastListsOrder(projectIds: Id[], trx?: Transaction): Promise<ListOrderByProjectId> {
    const listOrderByProjectId: ListOrderByProjectId = {}

    const projectIdOrderRows = await this.connection.getQueryWithTransaction(trx)
      .select('projectId')
      .max('order')
      .from(Table.TASK_LIST)
      .whereIn('projectId', projectIds)
      .groupBy('projectId')

    projectIdOrderRows.forEach(projectIdAndOrder => {
      listOrderByProjectId[projectIdAndOrder.projectId] = projectIdAndOrder.max
    })

    return listOrderByProjectId
  }

  async manageListPeopleAfterUpdate(listId: string, projectId: string, trx: Transaction): Promise<void> {
    const { isPrivate: projectIsPrivate } = await this.projectProvider.getProject(projectId, trx)

    if (projectIsPrivate) {
      const projectMembersPromise = this.userInProjectProvider.getProjectPeople(projectId)
      const listFollowerIdsPromise = this.listFollowersProvider.getListFollowerIds(listId)

      const [
        projectMembers,
        listFollowerIds,
      ] = await Promise.all([
        projectMembersPromise,
        listFollowerIdsPromise,
      ])

      const projectMemberIds = projectMembers.map(({ userId }) => userId)
      const listFollowerIdsToRemove = listFollowerIds
        .filter(userId => !projectMemberIds.includes(userId))

      await this.listFollowersProvider.deleteListFollowers(listId, listFollowerIdsToRemove, trx);
    }
  }

  async getProjectListsAndListsFollowers(projectId: Id): Promise<GetProjectListsAndListsFollowersResult> {
    const project = await this.projectProvider.getProject(projectId)
    if (!project) {
      return { status: GetProjectListsAndListsFollowersStatus.PROJECT_NOT_FOUND }
    }
    let lists: ListDbRow[];

    if (project.projectType === ProjectType.PROJECT) {
      // This is normal project
      lists = await this.listProvider.getProjectLists(projectId)
    } else {
      // This is a conversation
      const tasks = await this.conversationService.getConversationTasks(projectId)
      lists = await this.listProvider.getListsByIds(tasks.map(task => task.taskListId));
    }

    const listsFollowers = await this.listFollowersProvider.getListsFollowerIdsByListIds(lists.map(list => list.id))

    return { status: GetProjectListsAndListsFollowersStatus.OK, data: { lists, listsFollowers } }
  }


  async addListFollower(listId: Id, userId: Id): Promise<AddListFollowerResult> {
    try {
      const listFollower = {
        taskListId: listId,
        userId: userId,
      }

      await this.connection.getQueryBuilder()
        .insert(listFollower)
        .into(Table.USER_FOLLOWS_TASK_LIST)

      return { status: AddListFollowerStatus.OK }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.USER_FOLLOWS_LIST)) {
        return { status: AddListFollowerStatus.USER_ALREADY_FOLLOWING_LIST }
      } else if (violatesForeignKey(error, ForeignKey.USER_FOLLOWS_LIST_LIST_ID)) {
        return { status: AddListFollowerStatus.LIST_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_FOLLOWS_LIST_USER_ID)) {
        return { status: AddListFollowerStatus.USER_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async removeListFollower(listId, userId): Promise<RemoveListFollowerResult> {
    const affectedRowsNumber = await this.listFollowersProvider.deleteListFollower(listId, userId);

    const listTasks = await this.listProvider.getListTasks(listId)
    const taskIds = listTasks.map(task => task.id)

    await this.taskService.removeTasksFollower(taskIds, userId)

    if (affectedRowsNumber === 0) {
      return { status: RemoveListFollowerStatus.LIST_FOLLOWER_NOT_FOUND }
    } else {
      return { status: RemoveListFollowerStatus.OK }
    }
  }

  async removeListsFollower(listIds: Id[], userId: Id, trx?: Transaction): Promise<RemoveListsFollowerResult> {
    await this.listFollowersProvider.deleteListsFollower(listIds, userId, trx);

    const taskIds = await this.listProvider.getListsTaskIds(listIds, trx);
    await this.taskService.removeTasksFollower(taskIds, userId, trx)

    return { status: RemoveListsFollowerStatus.OK }
  }

  async removeProjectListsFollower(params: RemoveProjectFollowerEventData): Promise<RemoveListsFollowerResult> {
    const projectLists = await this.listProvider.getProjectLists(params.projectId, params.trx)
    const listIds = projectLists.map(list => list.id)

    return await this.removeListsFollower(listIds, params.userId, params.trx)
  }

  async moveAllTasksInList(sourceListId: Id, destinationListId: Id, actorId: Id): Promise<MoveAllTasksInListResult> {
    return await this.connection.getConnection().transaction(trx => {
      return this.doMoveAllTasksInList(trx, sourceListId, destinationListId, actorId)
    })
  }

  async doMoveAllTasksInList(trx: Transaction, sourceListId: Id, destinationListId: Id, actorId: Id): Promise<MoveAllTasksInListResult> {
    const allDestinationListTasksPromise = this.listProvider.getListTasks(destinationListId, trx)
    const sourceListPromise = this.listProvider.getList(sourceListId, trx)
    const destinationListPromise = this.listProvider.getList(destinationListId, trx)

    const [sourceList, destinationList, allDestinationListTasks] = await Promise.all([
      sourceListPromise,
      destinationListPromise,
      allDestinationListTasksPromise,
    ])

    if (!sourceList) {
      return { status: MoveAllTasksInListStatus.SOURCE_LIST_NOT_FOUND }
    }

    if (!destinationList) {
      return { status: MoveAllTasksInListStatus.DESTINATION_LIST_NOT_FOUND }
    }

    const lastTaskInDestinationListOrderVal = allDestinationListTasks
      .reduce((acc, task) => Math.max(acc, task.order), 1)

    const updatedTasks = await this.connection.getQueryBuilder()
      .from(Table.TASK)
      .update({
        order: this.connection.getConnection().raw(`"order" + ${lastTaskInDestinationListOrderVal}`),
        taskListId: destinationListId,
      })
      .where({
        taskListId: sourceListId,
        isArchived: false
      })
      .returning('*')
      .transacting(trx)

    const changes: TaskChanges = { old: { taskListId: sourceListId }, new: { taskListId: destinationListId } }
    const updatedTaskActivitiesPromises = updatedTasks.map((task: TaskDbRow) => {
      changes.old.order = null
      changes.new.order = task.order
      return this.activityService.createActivityTaskUpdated(task, actorId, changes, trx)
    })

    await Promise.all(updatedTaskActivitiesPromises)

    return { status: MoveAllTasksInListStatus.OK }
  }

  async copyListWithTasks(
    sourceListId: Id,
    userId: Id,
    projectId?: Id,
    name?: string,
    order?: number,
    newListId?: Id,
    options?: CopyListOptions,
    trx?: Transaction,
  ): Promise<CopyListResult> {
    const copyListOptions = Object.assign({}, defaultCopyListOptions, options)
    const relatedObjectsResult: GetListRelatedObjectsResult = await this.getListRelatedObjects(sourceListId, trx);
    if (!relatedObjectsResult.data) {
      return { status: CopyListStatus.LIST_NOT_FOUND }
    }

    const dataToInsert: ListRelatedObjectsInsertData = this.prepareListRelatedObjectsToInsert(
      relatedObjectsResult.data, sourceListId, userId, projectId, name, order, newListId,
    );

    if (trx) {
      await this.doInsertListRelatedObjects(trx, dataToInsert, copyListOptions)
    } else {
      await this.insertListRelatedObjects(dataToInsert, copyListOptions)
    }

    return { status: CopyListStatus.OK, newTaskListId: dataToInsert.list.id }
  }

  async insertListRelatedObjects(dataToInsert: ListRelatedObjectsInsertData, options: CopyListOptions) {
    await this.connection.getConnection().transaction(async (trx) => {
      await this.doInsertListRelatedObjects(trx, dataToInsert, options)
    })
  }

  async doInsertListRelatedObjects(trx: Transaction, dataToInsert: ListRelatedObjectsInsertData, options: CopyListOptions) {
    await this.connection.getQueryBuilder()
      .insert(dataToInsert.list)
      .transacting(trx)
      .into(Table.TASK_LIST)

    await this.orderService.moveItemsToMakeRoomInTheList(trx, dataToInsert.list.id, dataToInsert.list.projectId, dataToInsert.list.order)

    const promises = []

    if (dataToInsert.listTasks.length) {
      promises.push(this.connection.getQueryBuilder()
        .insert(dataToInsert.listTasks)
        .transacting(trx)
        .into(Table.TASK))
    }


    if (options.shouldCopyListFollowers && dataToInsert.listFollowers.length) {
      const newListFollowersPromise = this.connection.getQueryBuilder()
        .insert(dataToInsert.listFollowers)
        .transacting(trx)
        .into(Table.USER_FOLLOWS_TASK_LIST)
      promises.push(newListFollowersPromise)
    }

    if (options.shouldCopyTaskFollowers && dataToInsert.listTasksFollowers.length) {
      const newTasksFollowersPromise = this.connection.getQueryBuilder()
        .insert(dataToInsert.listTasksFollowers)
        .transacting(trx)
        .into(Table.USER_FOLLOWS_TASK)
      promises.push(newTasksFollowersPromise)
    }

    if (options.shouldCopyTaskPeople && dataToInsert.listTasksPeople.length) {
      const newTasksPeoplePromise = this.connection.getQueryBuilder()
        .insert(dataToInsert.listTasksPeople)
        .transacting(trx)
        .into(Table.USER_IN_TASK)
      promises.push(newTasksPeoplePromise)
    }

    if (dataToInsert.listTasksTags.length) {
      const newTasksTagsPromise = this.connection.getQueryBuilder()
        .insert(dataToInsert.listTasksTags)
        .transacting(trx)
        .into(Table.TASK_HAS_TAG)
      promises.push(newTasksTagsPromise)
    }

    if (dataToInsert.listTasksChecklistItems.length) {
      const newTasksChecklistItemsPromise = this.connection.getQueryBuilder()
        .insert(dataToInsert.listTasksChecklistItems)
        .transacting(trx)
        .into(Table.CHECKLIST_ITEM)
      promises.push(newTasksChecklistItemsPromise)
    }

    if (promises.length) {
      await Promise.all(promises)
    }
  }


  private async getListRelatedObjects(listId: Id, trx?: Transaction): Promise<GetListRelatedObjectsResult> {
    const list: ListDbRow = await this.listProvider.getList(listId, trx)
    if (!list) {
      return { status: GetListRelatedObjectsStatus.LIST_NOT_FOUND }
    }

    const listFollowersPromise = this.listFollowersProvider.getListsFollowerIdsByListIds([listId], trx)
    const listTasksPromise = this.listProvider.getListTasks(listId, trx, unarchivedListAndTasksModifier)

    const [listFollowers, listTasks] = await Promise.all([listFollowersPromise, listTasksPromise])

    const listTaskIds = listTasks.map(task => task.id)
    const listTasksFollowersPromise = this.taskService.getTasksFollowers(listTaskIds, trx)
    const listTasksPeoplePromise = this.taskService.getTasksPeople(listTaskIds, trx)
    const tasksTagIdsPromise = this.tagService.getTasksTagsIds(listTaskIds, trx)
    const tasksChecklistItemsPromise = this.checklistItemsService.getTasksChecklistItems(listTaskIds, trx)

    const [listTasksFollowers, listTasksTags, listTasksPeople, listTasksChecklistItems] = await Promise.all([
      listTasksFollowersPromise,
      tasksTagIdsPromise,
      listTasksPeoplePromise,
      tasksChecklistItemsPromise,
    ])

    const listRelatedObjectsSourceData: ListRelatedObjectsSourceData = {
      list,
      listFollowers,
      listTasksPeople,
      listTasks,
      listTasksFollowers,
      listTasksTags,
      listTasksChecklistItems,
    }
    return { status: GetListRelatedObjectsStatus.OK, data: listRelatedObjectsSourceData }
  }

  private prepareListRelatedObjectsToInsert(
    data: ListRelatedObjectsSourceData,
    sourceListId: Id,
    userId: Id,
    projectId?: Id,
    name?: string,
    order?: number,
    newListId?: Id,
  ) {
    newListId = newListId ? newListId : generateId()
    projectId = projectId ? projectId : data.list.projectId

    const newList = {
      ...data.list,
      id: newListId,
      name: name || data.list.name,
      creatorId: userId,
      order: order || data.list.order,
      projectId,
    }

    const newListFollowers = data.listFollowers[sourceListId]
      .map(userId => ({ taskListId: newListId, userId }))

    const newTasks: TaskDbRow[] = []
    const newTasksFollowers: UserFollowsTaskDbRow[] = []
    const newTasksPeople: UserInTaskDbRow[] = []
    const newTasksTags: TaskHasTagDbRow[] = []
    const newTasksChecklistItems: ChecklistItemDbRow[] = []

    data.listTasks.forEach(task => {
      const newTaskId = generateId()

      newTasks.push({
        ...task,
        id: newTaskId,
        creatorId: userId,
        taskListId: newListId,
        projectId,
      })


      data.listTasksFollowers[task.id].forEach(taskFollowerId => {
        newTasksFollowers.push({
          taskId: newTaskId,
          userId: taskFollowerId,
        })
      })

      data.listTasksPeople[task.id].forEach(member => {
        newTasksPeople.push({
          taskId: newTaskId,
          userId: member.userId,
          role: member.role,
        })
      })

      data.listTasksTags[task.id].forEach(tagId => {
        newTasksTags.push({
          taskId: newTaskId,
          tagId
        })
      })

      data.listTasksChecklistItems[task.id].forEach(checklistItem => {
        newTasksChecklistItems.push({
          ...checklistItem,
          taskId: newTaskId,
          id: generateId(),
        })
      })
    })

    const copiedListRelatedObjects: ListRelatedObjectsInsertData = {
      list: newList,
      listFollowers: newListFollowers,
      listTasks: newTasks,
      listTasksFollowers: newTasksFollowers,
      listTasksPeople: newTasksPeople,
      listTasksTags: newTasksTags,
      listTasksChecklistItems: newTasksChecklistItems,
    }
    return copiedListRelatedObjects
  }

  async getListIdsByTaskIdsFromProjects(projectIds: Id[], decorate?: QueryModifier): Promise<ListIdsByTaskIds> {
    const listIdsByTaskIds = {}

    let query = this.connection.getQueryBuilder()
      .select(`${Table.TASK}.id`, `${Table.TASK}.task_list_id`)
      .from(Table.TASK_LIST)
      .join(Table.TASK, `${Table.TASK}.task_list_id`, `${Table.TASK_LIST}.id`)
      .whereIn(`${Table.TASK_LIST}.projectId`, projectIds)

    if (decorate) {
      decorate(query)
    }

    query = query.groupBy([`${Table.TASK}.id`, `${Table.TASK}.task_list_id`])

    const taskIdListId = await query

    taskIdListId.forEach(taskIdListId => {
      const { taskListId } = taskIdListId
      const taskId = taskIdListId.id
      listIdsByTaskIds[taskId] = taskListId
    })

    return listIdsByTaskIds
  }

  async getListNamesByOrganizationId(organizationId: Id, decorate?: QueryModifier): Promise<ListNamesMap> {
    const query = this.connection.getQueryBuilder()
      .select(`${Table.TASK_LIST}.id`, `${Table.TASK_LIST}.name`)
      .from(Table.TASK_LIST)
      .join(Table.PROJECT, `${Table.TASK_LIST}.projectId`, `${Table.PROJECT}.id`)
      .where({ organizationId })

    if (decorate) {
      decorate(query)
    }

    const result = await query

    return chain(result)
      .keyBy('id')
      .mapValues((row: ListDbRow): any => row.name)
      .value()
  }

  async getOrganizationListsMapsByParameters(organizationId: Id, keys: Array<string>, decorate?: QueryModifier): Promise<Array<ListMap>> {
    const query = this.connection.getQueryBuilder()
      .select()
      .from(Table.PROJECT)
      .join(Table.TASK_LIST, `${Table.TASK_LIST}.project_id`, `${Table.PROJECT}.id`)
      .where({ organizationId })

    if (decorate) {
      decorate(query)
    }

    const lists = await query
    const result = []

    lists.forEach(list => {
      const id = list.id
      keys.forEach((key, index) => {
        set(result, `[${index}].${id}`, list[key])
      })
    })

    return result
  }

}
