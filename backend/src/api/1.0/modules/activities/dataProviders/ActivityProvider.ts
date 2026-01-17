import { ActivityProviderInterface } from "../interfaces/ActivityProviderInterface";
import {
  ActivityDbRow,
  ActivityChangedPropDbRow,
  ContainerType,
  TargetType,
  AbstractActivityContainerDbRow, AbstractActivityTargetDbRow
} from "../../db/schema";
import Table from "../../db/Table";
import { Id, IdMap } from '../../common/identifier'

import { injectable, inject } from "inversify";
import { ActivityTarget } from "../ActivityTarget";
import { ActivityContainer } from "../ActivityContainer";
import { DbModule } from "../../db/DbModule";
import { ConnectionInterface } from "../../db/ConnectionInterface";

@injectable()
export class ActivityProvider implements ActivityProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getActivity(id: Id, trx?: Transaction): Promise<ActivityDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.ACTIVITY)
      .select()
      .where('id', id)
      .first()
  }

  async getActivityChangedProps(id: Id, trx?: Transaction): Promise<ActivityChangedPropDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .from(Table.ACTIVITY_CHANGED_PROP)
      .select()
      .where('activityId', id)
      .returning('*')
  }

  async getActivityTarget<T extends AbstractActivityTargetDbRow>(id: Id, targetType: TargetType, trx?: Transaction): Promise<T> {
    const query = this.connection.getQueryWithTransaction(trx)
    const tableName = ActivityTarget.getTableName(targetType)

    return await query
      .from(tableName)
      .select()
      .first()
      .where('activityId', id)
  }

  async getActivityIdTargetIdMap(activities: ActivityDbRow[]): Promise<IdMap> {
    const activityIdTargetIdMap: IdMap = {}
    const insertValuesToTargetIdByActivityIdMapPromises = activities.map(async (activity: ActivityDbRow) => {
      const activityTargetDbRow = await this.getActivityTarget(activity.id, activity.targetType)
      const targetIdPropertyName = ActivityTarget.getPropertyName(activity.targetType, true)

      activityIdTargetIdMap[activity.id] = activityTargetDbRow[targetIdPropertyName]
    })

    await Promise.all(insertValuesToTargetIdByActivityIdMapPromises)
    return activityIdTargetIdMap
  }

  async getActivityContainer<T extends AbstractActivityContainerDbRow>(id: Id, containerType: ContainerType, trx?: Transaction): Promise<T> {
    const query = this.connection.getQueryWithTransaction(trx)
    const tableName = ActivityContainer.getTableName(containerType)

    return await query
      .from(tableName)
      .select()
      .first()
      .where('activityId', id)
  }
}
