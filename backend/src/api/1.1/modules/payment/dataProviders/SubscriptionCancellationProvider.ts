import { SubscriptionCancellationProviderInterface } from "../interfaces/SubscriptionCancellationProviderInterface";

import { OrganizationSubscriptionCancellationStatus } from "../types";
import Table from "../../db/Table";
import { injectable, inject } from "inversify";
import { Id } from "../../common/identifier";
import { Maybe } from "../../common/types";
import { ConnectionInterface } from "../../db/ConnectionInterface";
import { DbModule } from "../../db/DbModule";

@injectable()
export class SubscriptionCancellationProvider implements SubscriptionCancellationProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async getSubscriptionCancellationRequestStatus(organizationId: Id, trx?: Transaction): Promise<Maybe<OrganizationSubscriptionCancellationStatus>> {
    let query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .select('status')
      .from(Table.PAYMENTS_SUBSCRIPTION_CANCELLATION_IN_ORGANIZATION)
      .where('organizationId', organizationId)
      .first()
    return result ? result.status : null
  }

  async setSubscriptionCancellationRequestStatus(organizationId: Id, subscriptionId: Id, status: OrganizationSubscriptionCancellationStatus, trx?: Transaction): Promise<void> {
    const connection = trx || this.connection.getConnection()
    const queryParams = {
      subscriptionId: connection.raw('?', subscriptionId),
      organizationId: connection.raw('?', organizationId),
      status: connection.raw('?', status),
    }

    const rawQuery = `INSERT INTO ${Table.PAYMENTS_SUBSCRIPTION_CANCELLATION_IN_ORGANIZATION} `
      + `(subscription_id, organization_id, status) VALUES `
      + `(:subscriptionId:, :organizationId:, :status:) `
      + `ON CONFLICT(subscription_id, organization_id) DO UPDATE SET `
      + `status = :status:`

    await connection.raw(rawQuery, queryParams)
  }


}
