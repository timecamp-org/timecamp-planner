import { injectable, inject } from 'inversify'
import { Id, IdMap } from '../common/identifier'

import { ChecklistItemDbRow } from '../db/schema'
import { first } from 'lodash'

import Table from '../db/Table'
import { ChecklistItemProviderInterface } from './ChecklistItemProviderInterface'
import { ChecklistItemBasicData } from './types'
import { DbModule } from '../db/DbModule'
import { ConnectionInterface } from '../db/ConnectionInterface'

@injectable()
export class ChecklistItemProvider implements ChecklistItemProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) { }

  public async createChecklistItem(checklistItem: ChecklistItemDbRow, trx?: Transaction): Promise<ChecklistItemDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .insert(checklistItem)
      .into(Table.CHECKLIST_ITEM)
      .returning('*')

    return first(result)
  }

  public async getChecklistItem(id: Id, trx?: Transaction): Promise<ChecklistItemDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select('*')
      .from(Table.CHECKLIST_ITEM)
      .where('id', id)
      .first()
  }

  public async deleteChecklistItem(id: Id): Promise<number> {
    return await this.connection.getQueryBuilder()
      .from(Table.CHECKLIST_ITEM)
      .where('id', id)
      .del()
  }

  public async updateChecklistItem(id: Id, checklistItemData: Partial<ChecklistItemDbRow>, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .where('id', id)
      .update(checklistItemData)
      .table(Table.CHECKLIST_ITEM)
  }


  public async createChecklistItems(checklistItems: ChecklistItemDbRow[], trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .insert(checklistItems)
      .into(Table.CHECKLIST_ITEM)
      .returning('*')
  }

  public async getChecklistItemAssignees(checklistItemId: Id): Promise<Id[]> {
    const checklistAssignees = await this.connection.getQueryBuilder()
      .select('userId')
      .from(Table.USER_IN_CHECKLIST_ITEM)
      .where({ checklistItemId })

    return checklistAssignees.map(({ userId }) => userId)
  }

  public async addChecklistItemAssignee(checklistItemId: Id, userId: Id, trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)

    await query
      .insert({ checklistItemId, userId })
      .into(Table.USER_IN_CHECKLIST_ITEM)
  }

  public async removeChecklistItemAssignee(checklistItemId: Id, userId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)

    return await query
      .from(Table.USER_IN_CHECKLIST_ITEM)
      .where({ userId, checklistItemId })
      .delete()
  }

  public async getTaskChecklistItemsAssignees(taskId: Id): Promise<IdMap> {
    const data = await this.connection.getQueryBuilder()
      .select(`${Table.USER_IN_CHECKLIST_ITEM}.checklistItemId`, `${Table.USER_IN_CHECKLIST_ITEM}.userId`)
      .from(Table.CHECKLIST_ITEM)
      .join(Table.USER_IN_CHECKLIST_ITEM, `${Table.USER_IN_CHECKLIST_ITEM}.checklistItemId`, `${Table.CHECKLIST_ITEM}.id`)
      .where({ taskId })

    return data.reduce((res, { userId, checklistItemId }) => {
      if (res[checklistItemId]) {
        res[checklistItemId].push(userId)
      } else {
        res[checklistItemId] = [userId]
      }

      return res
    }, {} as IdMap)
  }

  public async getTasksChecklistItemsBasicData(taskIds: Id[]): Promise<ChecklistItemBasicData[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.CHECKLIST_ITEM)
      .select(`${Table.CHECKLIST_ITEM}.task_id`, `${Table.CHECKLIST_ITEM}.is_checked`, `${Table.CHECKLIST_ITEM}.id`)
      .whereIn('taskId', taskIds)
  }

}