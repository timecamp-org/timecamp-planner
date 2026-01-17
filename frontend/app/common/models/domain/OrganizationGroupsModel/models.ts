import {
  OrganizationGroupInterface,
  OrganizationGroupRecordInterface,
} from './types';
import { makeTypedFactory } from 'typed-immutable-record';

const defaultGroup: OrganizationGroupInterface = {
  id: undefined,
  name: '',
  slug: '',
  organizationId: undefined,
};

export const OrganizationGroup = makeTypedFactory<
  OrganizationGroupInterface | OrganizationGroupRecordInterface,
  OrganizationGroupRecordInterface
>(defaultGroup);
