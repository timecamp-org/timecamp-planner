import { TargetType } from "../db/schema";
import Table from "../db/Table";
import { ActivityContainer } from "./ActivityContainer";

export class ActivityTarget {

  static ERROR_TABLE_DOES_NOT_EXIST = `Table doesn't exist`

  protected static ACTIVITY_TARGET_TABLE = {
    [TargetType.PROJECT]: Table.ACTIVITY_TARGET_PROJECT,
    [TargetType.TASK]: Table.ACTIVITY_TARGET_TASK,
    [TargetType.USER]: Table.ACTIVITY_TARGET_USER,
    [TargetType.TASK_LIST]: Table.ACTIVITY_TARGET_TASK_LIST,
    [TargetType.FILE]: Table.ACTIVITY_TARGET_FILE,
  };

  static getTableName(targetType: string): string {
    const tableName: string = ActivityTarget.ACTIVITY_TARGET_TABLE[targetType]
    if (!tableName) {
      throw new Error(ActivityContainer.ERROR_TABLE_DOES_NOT_EXIST)
    }
    return tableName
  }

  static getPropertyName(targetType: string, camelCase = false): string {
    return camelCase
      ? `${targetType}Id`
      : `${targetType}_id`
  }
}
