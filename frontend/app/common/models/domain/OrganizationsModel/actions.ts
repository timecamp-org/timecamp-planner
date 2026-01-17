import { PayloadAction } from 'common/types';
import { getMapOfRecords } from 'common/utils/immutableUtils';
import { List, Map } from 'immutable';
import {
  OnBatchOrganizationsDataPayload,
  OnDeleteUserInOrganizationDataPayload,
  OnFetchOrganizationPeoplePayload,
  OnInviteGuestsPayload,
  OnPurgeUsersInOrganizationPayload,
  OnUpdateUserInOrganizationDataPayload,
} from 'models/domain/OrganizationsModel/payloads';
import { action } from 'typesafe-actions';
import { Id } from '../../../utils/identifier';
import { ActionResultInterface } from '../ActionResultModel';
import { EntityStatus } from '../EntityModel/types';
import { Organization } from '../OrganizationsModel/models';
import { User } from '../UsersModel/models';
import * as C from './constants';
import { OrganizationInterface, OrganizationPeopleRole, OrganizationRecordInterface, UserToInvite } from './types';

export const onInit = () => action(C.onInit);

export const onRegisterOrganization = (
  organizationName: string,
  switchToNewOrganization: boolean,
  onSuccess: () => {}
) =>
  action(C.onRegisterOrganization, {
    organizationName,
    switchToNewOrganization,
    onSuccess,
  });

export const onRegisterOrganizationSuccess = (actionResult: ActionResultInterface) =>
  action(C.onRegisterOrganizationSuccess, actionResult);

export const onRegisterOrganizationFailure = (actionResult: ActionResultInterface) =>
  action(C.onRegisterOrganizationFailure, actionResult);

export const onSwitchOrganization = (organizationId: Id, showLoader: boolean, clearModels: boolean) =>
  action(C.onSwitchOrganization, { organizationId, showLoader, clearModels });

export const onSetCurrentOrganizationId = (organizationId?: Id) =>
  action(C.onSetCurrentOrganizationId, { organizationId });

export const onBatchOrganizationsData = (
  organizationsData: OrganizationInterface[],
  userId: Id
): PayloadAction<OnBatchOrganizationsDataPayload> => {
  const organizations = getMapOfRecords<OrganizationInterface, OrganizationRecordInterface>(
    organizationsData,
    Organization
  );
  return action(C.onBatchOrganizationsData, { organizations, userId });
};

export const onCreateOrganizationData = (organizationData: OrganizationInterface) =>
  action(C.onCreateOrganizationData, {
    organizationData: Organization(organizationData),
  });

export const onUpdateOrganizationData = (organizationData: OrganizationInterface) =>
  action(C.onUpdateOrganizationData, {
    organizationData: Organization(organizationData),
  });

export const onBatchOrganizationsPeople = (organizationId: Id, organizationPeople: Id[]) =>
  action(C.onBatchOrganizationsPeople, {
    organizationId,
    organizationPeople: List(organizationPeople),
  });

export const onInviteUsersToOrganization = (
  users: UserToInvite[],
  isIOS: boolean = false,
  shouldRedirect: boolean = false
) => action(C.onInviteUsersToOrganization, { users, isIOS, shouldRedirect });

export const onResendInvitation = (userId: Id) => action(C.onResendInvitation, { userId });

export const onGenerateInvitationLink = (userId: Id) => action(C.onGenerateInvitationLink, { userId });

export const onFetchOrganizationPeople = (
  shouldPurgeState: boolean = false
): PayloadAction<OnFetchOrganizationPeoplePayload> => action(C.onFetchOrganizationPeople, { shouldPurgeState });

export const onFetchOrganizationPeopleSuccess = (actionResult: ActionResultInterface) =>
  action(C.onFetchOrganizationPeopleSuccess, actionResult);

export const onPurgeUsersInOrganizationData = (
  organizationId: Id,
  currentUserId: Id
): PayloadAction<OnPurgeUsersInOrganizationPayload> =>
  action(C.onPurgeUsersInOrganizationData, { organizationId, currentUserId });

export const onCreateUserInOrganizationData = ({
  userId,
  organizationId,
  organization,
  userInOrganization,
  user,
}: OnUpdateUserInOrganizationDataPayload) =>
  action(C.onCreateUserInOrganizationData, {
    userId,
    organizationId,
    organization: organization ? Organization(organization) : null,
    userInOrganization,
    user: user ? new User(user) : null,
  });

export const onUpdateUserInOrganizationData = ({
  userId,
  organizationId,
  organization,
  userInOrganization,
  user,
}: OnUpdateUserInOrganizationDataPayload) =>
  action(C.onUpdateUserInOrganizationData, {
    userId,
    organizationId,
    organization: organization ? Organization(organization) : null,
    userInOrganization,
    user: user ? new User(user) : null,
  });

export const onUpdateUserInOrganizationDataSuccess = ({
  userId,
  organizationId,
  organization,
  userInOrganization,
  user,
}: OnUpdateUserInOrganizationDataPayload) =>
  action(C.onUpdateUserInOrganizationDataSuccess, {
    userId,
    organizationId,
    organization,
    userInOrganization,
    user,
  });

export const onDeleteUserInOrganizationData = ({
  userId,
  organizationId,
}): PayloadAction<OnDeleteUserInOrganizationDataPayload> =>
  action(C.onDeleteUserInOrganizationData, {
    userId,
    organizationId,
  });

export const onUpdateWorkspaceName = (organizationId: Id, name: string) =>
  action(C.onUpdateWorkspaceName, {
    organizationId,
    name,
  });

export const onUpdateWorkspace = (
  organizationId: Id,
  fields: Partial<OrganizationInterface>,
  ignoreDebounce?: boolean
) =>
  action(C.onUpdateWorkspace, {
    organizationId,
    fields,
    ignoreDebounce,
  });

export const onUpdateWorkspaceSuccess = (actionResult: ActionResultInterface) =>
  action(C.onUpdateWorkspaceSuccess, actionResult);

export const onUpdateWorkspaceFailure = (actionResult: ActionResultInterface) =>
  action(C.onUpdateWorkspaceFailure, actionResult);

export const onFetchUserOrganizations = (userId: Id) => action(C.onFetchUserOrganizations, { userId });

export const onDeactivateUserFromOrganization = (userId: Id, organizationId: Id) =>
  action(C.onDeactivateUserFromOrganization, { userId, organizationId });

export const onDeactivateUserFromOrganizationSuccess = (userId: Id, organizationId: Id) =>
  action(C.onDeactivateUserFromOrganizationSuccess, { userId, organizationId });

export const onDeactivateUserFromOrganizationFailure = (userId: Id, organizationId: Id) =>
  action(C.onDeactivateUserFromOrganizationFailure, { userId, organizationId });

export const onReactivateUserFromOrganization = (userId: Id) => action(C.onReactivateUserFromOrganization, { userId });

export const onReactivateUserFromOrganizationSuccess = (userId: Id, organizationId: Id) =>
  action(C.onReactivateUserFromOrganizationSuccess, { userId, organizationId });

export const onReactivateUserFromOrganizationFailure = (userId: Id, organizationId: Id) =>
  action(C.onReactivateUserFromOrganizationFailure, { userId, organizationId });

export const onSetOpenedReactivateUserModalId = (openedReactivateUserModalId: Id) =>
  action(C.onSetOpenedReactivateUserModalId, { openedReactivateUserModalId });

export const onSetUserInvitationLink = (userId: Id, link: string) =>
  action(C.onSetUserInvitationLink, { userId, link });

export const onUpdateUserRole = (userId: Id, organizationId: Id, role: OrganizationPeopleRole) =>
  action(C.onUpdateUserRole, { userId, organizationId, role });

export const onSetUserRole = (userId: Id, organizationId: Id, role: OrganizationPeopleRole) =>
  action(C.onSetUserRole, { userId, organizationId, role });

// TODO: FilesModel to TS
export const onLogoUpload = (file) => action(C.onLogoUpload, { file });

export const onInviteGuestsToOrganization = (
  guestsEmails: string[],
  projectIds: Id[],
  shouldNavigateToGuestConversation: boolean = true
): PayloadAction<OnInviteGuestsPayload> =>
  action(C.onInviteGuestsToOrganization, {
    guestsEmails,
    projectIds,
    shouldNavigateToGuestConversation,
  });

export const onSetOrganizationStatus = (organizationId: Id, status: EntityStatus) =>
  action(C.onSetOrganizationStatus, { organizationId, status });

export const onFetchCurrentUserOrganizationRoles = () => action(C.onFetchCurrentUserOrganizationRoles);

export const onFetchCurrentUserOrganizationRolesSuccess = (
  organizationsPeopleRole: Map<Id, Map<Id, OrganizationPeopleRole>>
) =>
  action(C.onFetchCurrentUserOrganizationRolesSuccess, {
    organizationsPeopleRole,
  });

export const onSetCurrentUserInOrganizationId = (organizationId: Id, userId: Id, userInOrganizationId: Id) =>
  action(C.onSetCurrentUserInOrganizationId, {
    organizationId,
    userId,
    userInOrganizationId,
  });
