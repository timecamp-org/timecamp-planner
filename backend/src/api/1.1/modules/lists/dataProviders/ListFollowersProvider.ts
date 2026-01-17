import { ListFollowersProviderInterface } from "../interfaces/ListFollowersProviderInterface";

import { Id, IdMap } from "../../common/identifier";
import Table from "../../db/Table";
import { injectable, inject } from "inversify";
import { ConnectionInterface } from "../../db/ConnectionInterface";
import { DbModule } from "../../db/DbModule";

@injectable()
export class ListFollowersProvider implements ListFollowersProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ){}

  async getListFollowerIds(listId: Id, trx?: Transaction): Promise<Id[]> {
    const query = this.connection.getQueryWithTransaction(trx) 
    return await query
      .from(Table.USER_FOLLOWS_TASK_LIST)
      .select('userId')
      .where('taskListId', listId)
      .pluck('user_id')
  }

  async deleteListFollowers(taskListId: Id, followerIds: Id[], trx?: Transaction): Promise<void> {
    const query = this.connection.getQueryWithTransaction(trx) 
    return await query
    .from(Table.USER_FOLLOWS_TASK_LIST)
    .whereIn('userId', followerIds)
    .andWhere('taskListId', taskListId)
    .del()
  }

  async deleteListFollower(taskListId: Id, userId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx) 
    return await query
    .from(Table.USER_FOLLOWS_TASK_LIST)
    .where('userId', userId)
    .andWhere('taskListId', taskListId)
    .del()
  }

  async deleteListsFollower(taskListIds: Id[], userId: Id, trx?: Transaction): Promise<number> {
    const query = this.connection.getQueryWithTransaction(trx) 
    return await query
    .from(Table.USER_FOLLOWS_TASK_LIST)
    .whereIn('taskListId', taskListIds)
    .andWhere('userId', userId)
    .del()
  }

  async getListsFollowerIdsByListIds(listIds: Id[], trx?: Transaction): Promise<IdMap> {
    const query = this.connection.getQueryWithTransaction(trx) 
    const result = {}
    const userIdsListsIds = await query
      .select('*')
      .from(Table.USER_FOLLOWS_TASK_LIST)
      .whereIn('taskListId', listIds)

    listIds.forEach(listId => {
      result[listId] = userIdsListsIds
        .filter(userIdListId => userIdListId.taskListId === listId)
        .map(userIdListId => userIdListId.userId)
    })

    return result
  }
}
