import { QueryModifier } from '../../../../../services/types';
import { Id } from '../../common/identifier';
import { OrganizationDbRow } from '../../db/schema';

export interface OrganizationProviderInterface {
  getOrganization(organizationId: Id, trx?: Transaction): PromiseLike<OrganizationDbRow>;

  getOrganizationsForUser(
    userId: Id,
    trx?: Transaction,
    decorateQuery?: QueryModifier
  ): PromiseLike<OrganizationDbRow[]>;
  getOrganizationsIdsForUser(userId: Id, trx?: Transaction, decorateQuery?: QueryModifier): PromiseLike<Id[]>;

  getOrganizationsByIds(organizationIds: Id[]): PromiseLike<OrganizationDbRow[]>;
}
