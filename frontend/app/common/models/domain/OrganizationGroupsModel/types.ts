import { Id } from '../../../utils/identifier';
import { Map } from 'immutable';
import { ImmutableMap } from '../../../types';
import { TypedRecord } from 'typed-immutable-record';

export interface OrganizationGroupInterface {
  id: Id;
  name: string;
  slug: string;
  organizationId: Id;
}

export interface OrganizationGroupRecordInterface
  extends TypedRecord<OrganizationGroupRecordInterface>,
    OrganizationGroupInterface {}

export type OrganizationGroupsData = Map<Id, OrganizationGroupRecordInterface>;

export interface GroupsState extends ImmutableMap<string, any> {
  groupsData: OrganizationGroupsData;
}
