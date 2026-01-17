import { inject, injectable } from 'inversify';

import { Id } from '../../common/identifier';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';
import Table from '../../db/Table';
import { UserFollowingTaskProviderInterface } from '../interfaces/UserFollowingTaskProviderInterface';

@injectable()
export class UserFollowingTaskProvider implements UserFollowingTaskProviderInterface {
  
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getUserIdsFollowingTask(taskId: Id, trx?: Transaction): Promise<Id[]> {
    return await this.connection.getQueryWithTransaction(trx)
      .from(Table.USER_FOLLOWS_TASK)
      .select('user_id')
      .where('taskId', taskId)
      .pluck('user_id')
  }

}