import { ConnectionInterface } from '../db/ConnectionInterface'
import { inject, injectable } from 'inversify'
import { DbModule } from '../db/DbModule'

@injectable()
export abstract class AbstractPostgresProvider
{
  constructor(
    @inject(DbModule.ConnectionInterface)
    protected connection: ConnectionInterface
  ) {}
}
