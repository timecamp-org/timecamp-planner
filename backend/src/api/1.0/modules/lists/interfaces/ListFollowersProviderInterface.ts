import { Id, IdMap } from "../../common/identifier";


export interface ListFollowersProviderInterface {

  getListFollowerIds(listId: Id, trx?: Transaction): PromiseLike<Id[]>;

  deleteListFollowers(taskListId: Id, followerIds: Id[], trx?: Transaction): PromiseLike<void>;
  
  deleteListFollower(taskListId: Id, userId: Id, trx?: Transaction): PromiseLike<number>;

  deleteListsFollower(taskListIds: Id[], userId: Id, trx?: Transaction): PromiseLike<number>;

  getListsFollowerIdsByListIds(listIds: Id[], trx?: Transaction): PromiseLike<IdMap>;
 
}