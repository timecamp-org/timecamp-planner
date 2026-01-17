import { injectable, inject } from 'inversify';
import { OrderServiceFactoryInterface } from './OrderServiceFactoryInterface';
import { OrderService } from './OrderService';
import Table from '../db/Table'
import { StringPropertiesOf } from '../common/types'
import { DbRow } from '../db/types'
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';

@injectable()
export class OrderServiceFactory implements OrderServiceFactoryInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  create<T extends DbRow>(
    tableName: Table,
    parentColumnName: StringPropertiesOf<T>,
    orderColumnName?: StringPropertiesOf<T>,
    orderInterval: number = 65536,
  ) {
    return new OrderService<T>(this.connection, tableName, parentColumnName, orderColumnName, orderInterval)
  }

}
