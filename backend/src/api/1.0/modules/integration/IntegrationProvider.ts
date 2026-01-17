import { IntegrationProviderInterface } from './interfaces/IntegrationProviderInterface'
import { Id } from '../common/identifier'
import { injectable, inject } from 'inversify'
import { IntegrationStatus } from './types';
import Table from '../db/Table';
import { IntegrationDbRow } from '../db/schema';
import { DbModule } from '../db/DbModule';
import { ConnectionInterface } from '../db/ConnectionInterface';

@injectable()
export class IntegrationProvider implements IntegrationProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async setIntegrationStatus(extensionId: Id, organizationId: Id, userId: Id, status: IntegrationStatus): Promise<void> {
    const progress = await this.getIntegrationStatus(extensionId, organizationId, userId)
    if (!progress) {
      return await this.createIntegration(extensionId, organizationId, userId, status)
    }

    return await this.updateIntegration(extensionId, organizationId, userId, status)
  }

  async getIntegrationStatus(extensionId: Id, organizationId: Id, userId: Id): Promise<IntegrationStatus> {
    const integrationDbRow: IntegrationDbRow = await this.connection.getQueryBuilder()
      .from(Table.INTEGRATION)
      .where({
        extensionId,
        organizationId,
        userId,
      })
      .first()

    return integrationDbRow ? integrationDbRow.status : null
  }

  async createIntegration(extensionId: Id, organizationId: Id, userId: Id, status: IntegrationStatus): Promise<void> {
    await this.connection.getQueryBuilder()
      .table(Table.INTEGRATION)
      .insert({
        extensionId,
        organizationId,
        userId,
        status,
        userConfirmedStatus: false,
      })
  }

  async updateIntegration(extensionId: Id, organizationId: Id, userId: Id, status: IntegrationStatus): Promise<void> {
    await this.connection.getQueryBuilder()
      .table(Table.INTEGRATION)
      .update({
        status,
        userConfirmedStatus: false,
      })
      .where({
        extensionId,
        organizationId,
        userId,
      })
  }

  async getUserIntegrations(organizationId: Id, userId: Id): Promise<IntegrationDbRow[]> {
    return await this.connection.getQueryBuilder()
      .from(Table.INTEGRATION)
      .where({
        organizationId,
        userId,
      })
  }

  async confirmIntegrationsStatus(organizationId: Id, userId: Id, extensionIds: Id[]): Promise<void> {
    await this.connection.getQueryBuilder()
      .table(Table.INTEGRATION)
      .update({
        userConfirmedStatus: true,
      })
      .where({
        organizationId,
        userId,
      })
      .whereIn('extensionId', extensionIds)
  }

}
