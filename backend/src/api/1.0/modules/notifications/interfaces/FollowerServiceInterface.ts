import { Id } from '../../common/identifier'

export interface FollowerServiceInterface {

  getFollowersForTask(taskId: Id): Promise<Array<Id>>

  getFollowersForList(listId: Id): Promise<Array<Id>>
}
