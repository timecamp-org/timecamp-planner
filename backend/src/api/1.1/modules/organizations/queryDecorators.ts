import Table from '../db/Table';
import { QueryModifier } from '../../../../services/types';
import { EntityStatus } from '../common/enum';
import { OrganizationRole } from '../db/schema';

export const userIsNotBotModifier: QueryModifier = q => q
  .andWhere(`${Table.USER}.isBot`, false)

export const userIsActiveInOrganizationModifier: QueryModifier = q => q
  .andWhere(`${Table.USER_IN_ORGANIZATION}.entity_status`, EntityStatus.EXISTS)

export const userIsActiveAndNotBotModifier: QueryModifier = q => q
  .andWhere(`${Table.USER}.isBot`, false)
  .andWhere(`${Table.USER_IN_ORGANIZATION}.entity_status`, EntityStatus.EXISTS)
  .andWhereNot(`${Table.USER_IN_ORGANIZATION}.role`, OrganizationRole.GUEST)

export const guestIsActiveAndNotBotModifier: QueryModifier = q => q
  .andWhere(`${Table.USER}.isBot`, false)
  .andWhere(`${Table.USER_IN_ORGANIZATION}.entity_status`, EntityStatus.EXISTS)
  .andWhere(`${Table.USER_IN_ORGANIZATION}.role`, OrganizationRole.GUEST)

export const userIsActiveMemberInOrganizationModifier: QueryModifier = q => q
  .andWhere(`${Table.USER}.isBot`, false)
  .andWhere(`${Table.USER_IN_ORGANIZATION}.entity_status`, EntityStatus.EXISTS)
  .andWhereNot(`${Table.USER_IN_ORGANIZATION}.role`, OrganizationRole.GUEST)

export const organizationExistsQueryModifier: QueryModifier
  = q => q.where(`${Table.ORGANIZATION}.status`, EntityStatus.EXISTS)

export const usersAreNotGuestsQueryModifier: QueryModifier = q => q
  .andWhereNot(`${Table.USER_IN_ORGANIZATION}.role`, OrganizationRole.GUEST)

export const onlyGuestUsersQueryModifier: QueryModifier = q => q
  .andWhere(`${Table.USER_IN_ORGANIZATION}.role`, OrganizationRole.GUEST)

export const onlyOwnerAndAdminsQueryModifier: QueryModifier = q => q
  .whereIn(`${Table.USER_IN_ORGANIZATION}.role`, [OrganizationRole.OWNER, OrganizationRole.ADMIN])

export const organizationOwnersQueryModifier: QueryModifier = q => q
  .andWhere({
    role: OrganizationRole.OWNER,
    entityStatus: EntityStatus.EXISTS,
  })