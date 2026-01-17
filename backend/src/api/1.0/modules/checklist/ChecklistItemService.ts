
import Table, { ForeignKey, UniqueKey } from '../db/Table'
import { ChecklistItemDbRow } from '../db/schema'
import { violatesForeignKey, violatesUniqueKey } from '../../../../utils'
import { Id, IdMap } from '../common/identifier'
import { ChecklistItemServiceInterface } from './ChecklistItemServiceInterface'
import {
  AddChecklistItemAssigneeResult,
  AddChecklistItemAssigneeStatus,
  ChecklistItemBasicData,
  CheckListItemJson,
  CreateChecklistItemResult,
  CreateChecklistItemStatus,
  DeleteChecklistItemResult,
  DeleteChecklistItemStatus,
  RemoveChecklistItemAssigneeResult,
  RemoveChecklistItemAssigneeStatus,
  TasksChecklistItemsMap,
  UpdateChecklistItemResult,
  UpdateChecklistItemStatus,
} from './types'
import { inject, injectable } from 'inversify'
import { OrderServiceInterface } from '../order/OrderServiceInterface'
import { OrderServiceFactoryInterface } from '../order/OrderServiceFactoryInterface'
import { OrderModule } from '../order/OrderModule'

import { CommonModule } from '../common/CommonModule'
import { TimeServiceInterface } from '../common/time/TimeServiceInterface'
import { EntityHistoryModule } from '../entityHistory/EntityHistoryModule'
import { EntityHistoryServiceFactoryInterface } from '../entityHistory/EntityHistoryServiceFactoryInterface'
import { EntityHistoryServiceInterface } from '../entityHistory/EntityHistoryServiceInterface'
import { QueryModifier } from '../../../../services/types'
import { ActivitiesModule } from '../activities/ActivitiesModule'
import { ActivityServiceInterface } from '../activities/interfaces/ActivityServiceInterface'
import { ChecklistModule } from './ChecklistModule'
import { ChecklistItemProviderInterface } from './ChecklistItemProviderInterface'
import { DbModule } from '../db/DbModule'
import { ConnectionInterface } from '../db/ConnectionInterface'

@injectable()
export class ChecklistItemService implements ChecklistItemServiceInterface {

  protected orderService: OrderServiceInterface
  protected timeService: TimeServiceInterface
  protected entityHistoryService: EntityHistoryServiceInterface<ChecklistItemDbRow>

  constructor(
    @inject(OrderModule.OrderServiceFactoryInterface) orderFactoryService: OrderServiceFactoryInterface,
    @inject(EntityHistoryModule.EntityHistoryServiceFactoryInterface) entityHistoryFactoryService: EntityHistoryServiceFactoryInterface,
    @inject(CommonModule.TimeServiceInterface) timeService: TimeServiceInterface,
    @inject(ActivitiesModule.ActivityServiceInterface)
    private activityService: ActivityServiceInterface,
    @inject(ChecklistModule.ChecklistItemProviderInterface)
    private checklistItemProvider: ChecklistItemProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    this.orderService = orderFactoryService.create<ChecklistItemDbRow>(Table.CHECKLIST_ITEM, 'taskId', 'order')
    this.entityHistoryService = entityHistoryFactoryService.create<ChecklistItemDbRow>(['name'])
    this.timeService = timeService;
  }

  async createChecklistItem(id: Id, taskId: Id, checkListItem): Promise<CreateChecklistItemResult> {
    try {
      checkListItem.id = id
      checkListItem.taskId = taskId

      return await this.connection.getConnection().transaction(async (trx) => {
        await this.orderService.moveItemsToMakeRoomInTheList(trx, id, taskId, checkListItem.order)

        const createdChecklistItem = await this.checklistItemProvider.createChecklistItem(checkListItem, trx)

        return {
          status: CreateChecklistItemStatus.OK,
          checklistItem: createdChecklistItem
        }
      })

    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.CHECKLIST_ITEM_ID)) {
        return { status: CreateChecklistItemStatus.CHECKLIST_ITEM_ALREADY_EXISTS }
      } else if (violatesForeignKey(error, ForeignKey.CHECKLIST_ITEM_TASK_ID)) {
        return { status: CreateChecklistItemStatus.TASK_NOT_FOUND }
      } else if (violatesUniqueKey(error, UniqueKey.CHECKLIST_ITEM_ORDER_FOR_TASK)) {
        return { status: CreateChecklistItemStatus.CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS }
      }
      throw error;
    }
  }

  async createChecklistItems(checklistItems: ChecklistItemDbRow[], trx?: Transaction): Promise<void> {
    await this.checklistItemProvider.createChecklistItems(checklistItems, trx)
  }

  async updateChecklistItem(
    id: Id,
    taskId: Id,
    checkListItem: CheckListItemJson,
    updatedAt?: number,
  ): Promise<UpdateChecklistItemResult> {
    let status
    await this.connection.getConnection().transaction(async (trx) => {
      checkListItem.id = id
      checkListItem.taskId = taskId

      const previousChecklistItem = await this.checklistItemProvider.getChecklistItem(id, trx);

      if (checkListItem.order >= 0 && checkListItem.order !== previousChecklistItem.order) {
        await this.orderService.moveItemsToMakeRoomInTheList(trx, id, checkListItem.taskId || previousChecklistItem.taskId, checkListItem.order)
      }

      const entityHistory = this.entityHistoryService.getNewEntityHistory(previousChecklistItem, checkListItem, updatedAt)
      const checklistItemDbRow: Partial<ChecklistItemDbRow> = entityHistory ? { ...checkListItem, entityHistory } : { ...checkListItem }

      const affectedRowsNumber = await this.checklistItemProvider
        .updateChecklistItem(id, checklistItemDbRow, trx)

      if (affectedRowsNumber === 0) {
        status = UpdateChecklistItemStatus.CHECKLIST_ITEM_NOT_FOUND
      } else {
        status = UpdateChecklistItemStatus.OK
      }
    })

    return { status }
  }

  async deleteChecklistItem(id: Id): Promise<DeleteChecklistItemResult> {
    const affectedRowsNumber = await this.checklistItemProvider.deleteChecklistItem(id)

    if (affectedRowsNumber === 0) {
      return { status: DeleteChecklistItemStatus.CHECKLIST_ITEM_NOT_FOUND }
    } else {
      return { status: DeleteChecklistItemStatus.OK }
    }
  }

  async getChecklistItemsWhereTaskId(taskId: Id, decorate?: QueryModifier, trx?: Transaction): Promise<Array<ChecklistItemDbRow>> {
    const query = this.connection.getQueryWithTransaction(trx)
      .from(Table.CHECKLIST_ITEM)
      .where('taskId', taskId)

    if (decorate) {
      decorate(query)
    }

    return await query
  }

  async getTaskChecklistItemsAssignees(taskId: Id): Promise<IdMap> {
    return await this.checklistItemProvider.getTaskChecklistItemsAssignees(taskId)
  }

  async getTasksChecklistItems(taskIds: Id[], trx?: Transaction): Promise<TasksChecklistItemsMap> {
    const tasksChecklistItemsMap = {}
    const checklistItems: ChecklistItemDbRow[] = await this.connection.getQueryWithTransaction(trx)
      .from(Table.CHECKLIST_ITEM)
      .whereIn('taskId', taskIds)

    taskIds.forEach(taskId => {
      tasksChecklistItemsMap[taskId] = checklistItems.filter(item => item.taskId === taskId)
    })

    return tasksChecklistItemsMap
  }

  async getTasksChecklistItemsBasicData(taskIds: Id[]): Promise<ChecklistItemBasicData[]> {
    return await this.checklistItemProvider.getTasksChecklistItemsBasicData(taskIds)
  }

  async addChecklistItemAssignee(checklistItemId: Id, userId: Id, actorId: Id): Promise<AddChecklistItemAssigneeResult> {
    return await this.connection.getConnection()
      .transaction(async trx => {
        return await this.doAddChecklistItemAssignee(trx, checklistItemId, userId, actorId)
      })
  }

  private async doAddChecklistItemAssignee(trx: Transaction, checklistItemId: Id, userId: Id, actorId: Id): Promise<AddChecklistItemAssigneeResult> {
    try {
      await this.checklistItemProvider.addChecklistItemAssignee(checklistItemId, userId, trx)

      await this.activityService.createActivityChecklistAssigneesAdded(checklistItemId, actorId, userId, trx)

      return { status: AddChecklistItemAssigneeStatus.OK }
    } catch (error) {
      if (violatesUniqueKey(error, UniqueKey.USER_IN_CHECKLIST_ITEM)) {
        return { status: AddChecklistItemAssigneeStatus.USER_ALREADY_ASSIGNED }
      } else if (violatesForeignKey(error, ForeignKey.USER_IN_CHECKLIST_ITEM_USER_ID)) {
        return { status: AddChecklistItemAssigneeStatus.USER_NOT_FOUND }
      } else if (violatesForeignKey(error, ForeignKey.USER_IN_CHECKLIST_ITEM_CHECKLIST_ITEM_ID)) {
        return { status: AddChecklistItemAssigneeStatus.CHECKLIST_ITEM_NOT_FOUND }
      } else {
        throw error
      }
    }
  }

  async removeChecklistItemAssignee(checklistItemId: Id, userId: Id, actorId: Id): Promise<RemoveChecklistItemAssigneeResult> {
    return await this.connection.getConnection()
      .transaction(async trx => {
        return await this.doRemoveChecklistItemAssignee(trx, checklistItemId, userId, actorId)
      })
  }

  private async doRemoveChecklistItemAssignee(trx: Transaction, checklistItemId: Id, userId: Id, actorId: Id): Promise<RemoveChecklistItemAssigneeResult> {
    try {
      const checklistItem = await this.checklistItemProvider.getChecklistItem(checklistItemId, trx)

      if (!checklistItem) {
        return {
          status: RemoveChecklistItemAssigneeStatus.CHECKLIST_ITEM_NOT_FOUND,
        }
      }

      const affectedRowsNumber = await this.checklistItemProvider.removeChecklistItemAssignee(checklistItemId, userId, trx)

      if (affectedRowsNumber === 0) {
        return { status: RemoveChecklistItemAssigneeStatus.CHECKLIST_ASSIGNEE_NOT_FOUND }
      } else {
        await this.activityService.createActivityChecklistAssigneesRemoved(checklistItemId, actorId, userId, trx)
        return { status: RemoveChecklistItemAssigneeStatus.OK }
      }
    } catch (error) {
      throw error
    }
  }


}
