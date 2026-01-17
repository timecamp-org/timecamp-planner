import { AnalyticsEngine } from './AnalyticsEngine'
import { Id } from '../common/identifier'
import { EventShipmentLogDbRow, UserShipmentLogDbRow } from '../db/schema'
import Table, { UniqueKey } from '../db/Table'
import { LoggerInterface } from '../../../../infrastructure/logger'
import { violatesUniqueKey } from '../../../../utils'
import { injectable, inject } from 'inversify';
import { InfrastructureModule } from '../../../../infrastructure/InfrastructureModule';
import { AnalyticsModule } from './AnalyticsModule'
import { AnalyticsConfigType } from './types'
import { DbModule } from '../db/DbModule'
import { ConnectionInterface } from '../db/ConnectionInterface'

@injectable()
export class ShipmentLog
{

  constructor(
    @inject(InfrastructureModule.LoggerInterface) 
    protected logger: LoggerInterface,
    @inject(AnalyticsModule.AnalyticsConfigType)
    private config: AnalyticsConfigType,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
  }

  public async storeActorShipment(engineCode: AnalyticsEngine, userId: Id, isSuccess: boolean)
  {
    if (!this.config.storeLogShipment) { 
      return
    }
    const entry : UserShipmentLogDbRow = {
      userId,
      engineCode,
      shipmentSuccessful: isSuccess,
      sentAt: new Date(),
      failCount: isSuccess ? 0 : 1,
    };

    try {
      await this.connection.getQueryBuilder()
        .insert(entry)
        .into(Table.ANALYTICS_USER_LOG)
    } catch (e) {
      if (violatesUniqueKey(e, UniqueKey.ANALYTICS_USER_SHIPMENT_PK)) {
        if (!isSuccess) {
          // Must increment fail count
          await this.connection.getQueryBuilder()
            .table(Table.ANALYTICS_USER_LOG)
            .increment('failCount')
            .where({
              userId,
              engineCode
            })
          ;
        } // else -- nothing to do.
      } else {
        this.logger.error(`[${engineCode}]`, e);
      }
    }
  }

  public async storeEventShipment(engineCode: AnalyticsEngine, eventId: Id, isSuccess: boolean)
  {
    if (!this.config.storeLogShipment) { 
      return
    }
    const entry : EventShipmentLogDbRow = {
      eventId,
      engineCode,
      shipmentSuccessful: isSuccess,
      sentAt: new Date(),
      failCount: isSuccess ? 0 : 1,
    };

    try {
      await this.connection.getQueryBuilder()
        .insert(entry)
        .into(Table.ANALYTICS_EVENT_LOG)
    } catch (e) {
      if (violatesUniqueKey(e, UniqueKey.ANALYTICS_EVENT_SHIPMENT_PK)) {
        if (!isSuccess) {
          // Must increment fail count
          await this.connection.getQueryBuilder()
            .table(Table.ANALYTICS_EVENT_LOG)
            .increment('failCount')
            .where({
              eventId,
              engineCode
            })
          ;
        } // else -- nothing to do.
      } else {
        this.logger.error(`[${engineCode}]`, e);
      }
    }
  }
}
