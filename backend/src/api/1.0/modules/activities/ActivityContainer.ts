import { ContainerType } from '../db/schema'
import Table from '../db/Table'

export class ActivityContainer {

  static ERROR_TABLE_DOES_NOT_EXIST = `Table doesn't exist`

  protected static ACTIVITY_CONTAINER_TABLE = {
    [ContainerType.PROJECT]: Table.ACTIVITY_CONTAINER_PROJECT,
    [ContainerType.TASK]: Table.ACTIVITY_CONTAINER_TASK,
    [ContainerType.TASK_LIST]: Table.ACTIVITY_CONTAINER_TASK_LIST,
    [ContainerType.CHECKLIST_ITEM]: Table.ACTIVITY_CONTAINER_CHECKLIST_ITEM,
  }

  static getTableName(containerType: string): string {
    const tableName: string = ActivityContainer.ACTIVITY_CONTAINER_TABLE[containerType]
    if (!tableName) {
      throw new Error(ActivityContainer.ERROR_TABLE_DOES_NOT_EXIST)
    }
    return tableName
  }

  static getPropertyName(containerType: string): string {
    return `${containerType}_id`
  }
}
