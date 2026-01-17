import { inject, injectable } from 'inversify';

import { Id } from '../../common/identifier';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { DbModule } from '../../db/DbModule';
import Table from '../../db/Table';
import { UserInTaskProviderInterface } from '../interfaces/UserInTaskProviderInterface'

@injectable()
export class UserInTaskProvider implements UserInTaskProviderInterface {
  
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getUserIdsInTask(taskId: Id, trx?: Transaction): Promise<Id[]> {
    return await this.connection.getQueryWithTransaction(trx)
      .from(Table.USER_IN_TASK)
      .select('user_id')
      .where('taskId', taskId)
      .pluck('user_id')
  }

}