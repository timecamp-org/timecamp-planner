import { Id } from '../../common/identifier';
import { GroupDbRow } from '../../db/schema';

export interface OrganizationGroupsProviderInterface {
  createGroup(
    organizationId: Id,
    name: string,
    slug: string,
    trx?: Transaction
  ): PromiseLike<GroupDbRow>;

  updateGroup(
    id: Id,
    name: string,
    slug: string,
    trx?: Transaction
  ): PromiseLike<GroupDbRow>;

  deleteGroup(id: Id, trx?: Transaction): PromiseLike<void>;

  getGroups(organizationId: Id): PromiseLike<GroupDbRow[]>;

  getGroup(groupId: Id, trx?: Transaction): PromiseLike<GroupDbRow>;
}
