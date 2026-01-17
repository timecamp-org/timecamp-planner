import { Id } from 'common/utils/identifier';
import { Map } from 'immutable';
import { OrganizationInterface, UserInOrganizationInterface } from 'models/domain/OrganizationsModel/types';
import { UserInterface } from '../UsersModel/types';

export interface OnBatchOrganizationsDataPayload {
  organizations: Map<Id, OrganizationInterface>;
  userId: Id;
}

export interface OnDeleteUserInOrganizationDataPayload {
  userId: Id;
  organizationId: Id;
}
export interface OnFetchOrganizationPeoplePayload {
  shouldPurgeState?: boolean;
}

export interface OnPurgeUsersInOrganizationPayload {
  organizationId: Id;
  currentUserId: Id;
}

export interface OnUpdateUserInOrganizationDataPayload {
  userId: Id;
  organizationId: Id;
  organization?: OrganizationInterface;
  userInOrganization: Partial<UserInOrganizationInterface>;
  user?: UserInterface;
}

export interface OnInviteGuestsPayload {
  guestsEmails: string[];
  projectIds: Id[];
  shouldNavigateToGuestConversation: boolean;
}

export interface OnSetCurrentOrganizationIdPayload {
  organizationId: string;
}
