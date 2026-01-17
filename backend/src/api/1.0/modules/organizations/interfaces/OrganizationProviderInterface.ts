
import { OrganizationDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';
import { QueryModifier } from '../../../../../services/types';

export interface OrganizationProviderInterface {
  getOrganization(organizationId: Id, trx?: Transaction): PromiseLike<OrganizationDbRow>

  getOrganizationsForUser(userId: Id, trx?: Transaction, decorateQuery?: QueryModifier): PromiseLike<OrganizationDbRow[]>;

  getOrganizationsByIds(organizationIds: Id[]): PromiseLike<OrganizationDbRow[]>
}
