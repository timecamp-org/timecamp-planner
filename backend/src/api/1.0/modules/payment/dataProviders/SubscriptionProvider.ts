
import { injectable, inject } from 'inversify';
import { SubscriptionProviderInterface } from '../interfaces/SubscriptionProviderInterface';
import Table from '../../db/Table';
import { Id } from '../../common/identifier';
import { SubscriptionInOrganizationDbRow } from '../../db/schema';
import { SubscriptionJson, SubscriptionStatus } from '../types';

import { first } from 'lodash'
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';

@injectable()
export class SubscriptionProvider implements SubscriptionProviderInterface {
  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface,
  ) { }

  async getSubscriptionForOrganizationId(organizationId: Id, trx?: Transaction): Promise<SubscriptionInOrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION)
      .where({
        organizationId
      })
      .first()
  }

  async getSubscriptionsForOrganizationIds(organizationIds: Id[], trx?: Transaction): Promise<SubscriptionInOrganizationDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION)
      .whereIn('organizationId', organizationIds)
  }

  async getSubscriptionByAgentSubscriptionId(agentSubscriptionId: Id, trx?: Transaction): Promise<SubscriptionInOrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    return await query
      .select()
      .from(Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION)
      .where({
        agentSubscriptionId
      })
      .first()
  }

  async createSubscription(subscription: SubscriptionJson, trx?: Transaction): Promise<SubscriptionInOrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .insert(subscription)
      .into(Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION)
      .returning('*')
    return first(result)
  }

  async updateSubscription(subscriptionId: Id, subscription: SubscriptionJson, trx?: Transaction): Promise<SubscriptionInOrganizationDbRow> {
    const query = this.connection.getQueryWithTransaction(trx)
    const result = await query
      .from(Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION)
      .update(subscription)
      .where({ id: subscriptionId })
      .returning('*')
    return first(result)
  }

  async getExpiredInternalTrialSubscriptions(expiresAt: Date): Promise<SubscriptionInOrganizationDbRow[]> {
    const q = this.connection.getConnection()
      .select('*')
      .from(Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION)
      .where({
        status: SubscriptionStatus.STATUS_IN_TRIAL,
        agentSubscriptionId: null,
      })
      .andWhereRaw('expires_at <= ?', [expiresAt])
    return await q
  }

  async terminateExpiredInternalTrialSubscriptions(expiresAt: Date): Promise<void> {
    const q = this.connection.getConnection()
      .from(Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION)
      .update({
        status: SubscriptionStatus.STATUS_CANCELLED,
      })
      .where({
        status: SubscriptionStatus.STATUS_IN_TRIAL,
        agentSubscriptionId: null,
      })
      .andWhereRaw('expires_at <= ?', [expiresAt])
    await q
  }

  async getInternalTrialSubscriptionsWithExpirationUntilDays(days: number): Promise<SubscriptionInOrganizationDbRow[]> {
    const q = this.connection.getConnection()
      .select('*')
      .from(Table.PAYMENTS_SUBSCRIPTION_IN_ORGANIZATION)
      .where({
        status: SubscriptionStatus.STATUS_IN_TRIAL,
        agentSubscriptionId: null,
      })
      .andWhereRaw(`expires_at - interval '${days} days' < current_timestamp`)
    return await q
  }

}
