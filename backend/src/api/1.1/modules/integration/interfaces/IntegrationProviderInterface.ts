import { Id } from '../../common/identifier'
import { IntegrationStatus } from '../types';
import { IntegrationDbRow } from '../../db/schema';

export interface IntegrationProviderInterface {

  setIntegrationStatus(extensionId: Id, organizationId: Id, userId: Id, status: IntegrationStatus): Promise<void>

  getIntegrationStatus(extensionId: Id, organizationId: Id, userId: Id): Promise<IntegrationStatus>

  getUserIntegrations(organizationId: Id, userId: Id): Promise<IntegrationDbRow[]>

  confirmIntegrationsStatus(organizationId: Id, userId: Id, extensionIds: Id[]): Promise<void>

}
