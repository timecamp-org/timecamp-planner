import { ListProviderInterface } from '../interfaces/ListProviderInterface';

import { ListDbRow, TaskDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';
import Table from '../../db/Table';
import { injectable, inject } from 'inversify';
import { UpdateListJson, CreateListJson } from '../types';
import { first } from 'lodash'
import { QueryModifier } from '../../../../../services/types';
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';

@injectable()
export class ListProvider implements ListProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ){}

  async getList(id: Id, trx?: Transaction): Promise<ListDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select('*')
      .from(Table.TASK_LIST)
      .where('id', id)
      .first()
  }

  async getLists(listIds: Id[]): Promise<ListDbRow[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.TASK_LIST)
      .whereIn('id', listIds)
  }

  async createList(listJson: CreateListJson, trx?: Transaction): Promise<ListDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .insert(listJson)
      .into(Table.TASK_LIST)
      .returning('*')
    return first(result)
  }

  async createLists(lists: ListDbRow[], trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx)
    await query
      .insert(lists)
      .into(Table.TASK_LIST)
      .returning('*')
  }

  async updateList(id: Id, listJson: UpdateListJson, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from((Table.TASK_LIST))
      .update(listJson)
      .where('id', id)
  }

  async getListTasks(listId: Id, trx?: Transaction, decorate?: QueryModifier): Promise<TaskDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    const getListTasksQuery = query
      .select(`${Table.TASK}.*`)
      .from(Table.TASK)
      .join(Table.TASK_LIST, `${Table.TASK_LIST}.id`, `${Table.TASK}.task_list_id`)
      .where(`${Table.TASK}.task_list_id`, listId)

    if (decorate) {
      decorate(getListTasksQuery)
    }

    return await getListTasksQuery
  }

  async getListsTaskIds(listIds: Id[], trx?: Transaction): Promise<Id[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select(`${Table.TASK}.id`)
      .from(Table.TASK)
      .whereIn('taskListId', listIds)
      .pluck('id')
  }

  async getProjectLists(projectId: Id, trx?: Transaction, decorate?: QueryModifier): Promise<ListDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    const getProjectListsQuery = query
      .select(`${Table.TASK_LIST}.*`)
      .from(Table.TASK_LIST)
      .where(`${Table.TASK_LIST}.projectId`, projectId)

    if (decorate) {
      decorate(getProjectListsQuery)
    }

    return await getProjectListsQuery
  }

  async getListsByIds(listIds: Id[]): Promise<ListDbRow[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.TASK_LIST)
      .whereIn('id', listIds)
  }

  async getFirstVisibleTaskListId(projectId: Id): Promise<Id> {
    return await this.connection.getQueryBuilder()
      .select(`${Table.TASK_LIST}.id`)
      .from(Table.TASK_LIST)
      .where({ 
        projectId,
        isArchived: false,
      })
      .first()
      .orderBy('order')
      .then((result: ListDbRow) => result ? result.id : null)
  }

}
