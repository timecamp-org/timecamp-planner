
import { Id } from '../../common/identifier';

export interface UserInTaskProviderInterface {
  getUserIdsInTask(taskId: Id, trx?: Transaction): PromiseLike<Id[]>
}