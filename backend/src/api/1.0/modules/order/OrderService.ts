

import { Id } from '../common/identifier';
import { OrderServiceInterface } from './OrderServiceInterface';
import { StringPropertiesOf } from '../common/types'
import Table from '../db/Table'
import { DbRow } from '../db/types'
import { ConnectionInterface } from '../db/ConnectionInterface';
export const defaultOrderInterval = 65536

export class OrderService<T extends DbRow> implements OrderServiceInterface {

  protected parentColumnName: StringPropertiesOf<T>
  protected tableName: Table
  protected orderColumnName: StringPropertiesOf<T>
  protected orderInterval: number
  protected connection: ConnectionInterface

  constructor(
    connection: ConnectionInterface,
    tableName: Table,
    parentColumnName: StringPropertiesOf<T>,
    orderColumnName?: StringPropertiesOf<T>,
    orderInterval: number = defaultOrderInterval,
  ) {
    this.tableName = tableName;
    this.parentColumnName = parentColumnName;
    this.orderColumnName = orderColumnName;
    this.orderInterval = orderInterval;
    this.connection = connection;
  }

  // if there already is item with this order
  // increments orders of this item and items with higher order by orderInterval
  // and returns number of updated rows
  async moveItemsToMakeRoomInTheList(
    trx: Transaction,
    id: Id,
    parentId: Id,
    order: number,
  ): Promise<number> {
    const conflictingEntry = await this.connection.getQueryWithTransaction(trx)
      .where({ [this.orderColumnName]: order })
      .where(this.parentColumnName as string, parentId)
      .whereNot({ id })
      .first()
      .from(this.tableName)

    if (!conflictingEntry) {
      return 0
    }

    return await this.connection.getQueryWithTransaction(trx)
      .where(this.parentColumnName as string, parentId)
      .andWhere(this.orderColumnName as string, '>=', order)
      .whereNot({ id })
      .increment(this.orderColumnName as string, this.orderInterval)
      .table(this.tableName)
  }

  async moveItemsToMakeRoomForMultipleEntries(
    trx: Transaction,
    numberOfItems: number,
    parentId: Id,
  ): Promise<void> {
    const interval = this.orderInterval * numberOfItems
    return await this.connection.getQueryWithTransaction(trx)
      .where(this.parentColumnName as string, parentId)
      .increment(this.orderColumnName as string, interval)
      .table(this.tableName)
  }

  getNextOrder(lastOrder: number): number {
    return lastOrder + this.orderInterval
  }

}
