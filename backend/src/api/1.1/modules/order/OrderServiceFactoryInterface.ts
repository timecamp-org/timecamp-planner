import Table from '../db/Table'
import { StringPropertiesOf } from '../common/types'

export interface OrderServiceFactoryInterface {

  create<T>(
    tableName: Table,
    parentColumnName: StringPropertiesOf<T>,
    orderColumnName?: keyof T,
    orderInterval?: number,
  )

}
