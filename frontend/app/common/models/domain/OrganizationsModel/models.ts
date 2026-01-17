import { EntityStatus } from '../EntityModel/types';
import { OrganizationInterface, OrganizationRecordInterface } from './types';
import { makeTypedFactory } from 'typed-immutable-record';

const defaultOrganization: OrganizationInterface = {
  id: undefined,
  name: undefined,
  status: EntityStatus.EXISTS,
  createdAt: undefined,
  modifiedAt: undefined,
  logo: undefined,
}

export const Organization = makeTypedFactory<
  OrganizationInterface | OrganizationRecordInterface,
  OrganizationRecordInterface
>
  (defaultOrganization);
