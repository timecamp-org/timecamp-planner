
import { Id } from '../../common/identifier';

export interface UserFollowingTaskProviderInterface {
  getUserIdsFollowingTask(taskId: Id, trx?: Transaction): PromiseLike<Id[]>
}