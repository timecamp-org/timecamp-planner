
import { Id } from '../common/identifier';

export interface OrderServiceInterface {

  moveItemsToMakeRoomInTheList(
    trx: Transaction,
    id: Id,
    parentId: Id,
    order: number,
  ): PromiseLike<number>

  getNextOrder(lastOrder: number): number

  moveItemsToMakeRoomForMultipleEntries(
    trx: Transaction,
    numberOfItems: number,
    parentId: Id,
  ): PromiseLike<void>

}
