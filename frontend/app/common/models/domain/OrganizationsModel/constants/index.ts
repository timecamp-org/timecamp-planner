import { OrganizationPeopleRole } from "../types";

export const domain = 'OrganizationsModel'

export const onInit = `${domain}/onInit`

export const onRegisterOrganization = `${domain}/onRegisterOrganization`
export const onRegisterOrganizationSuccess = `${domain}/onRegisterOrganizationSuccess`
export const onRegisterOrganizationFailure = `${domain}/onRegisterOrganizationFailure`

export const onSwitchOrganization = `${domain}/onSwitchOrganization`

export const onSetCurrentOrganizationId = `${domain}/onSetCurrentOrganizationId`

export const onBatchOrganizationsData = `${domain}/onBatchOrganizationsData`
export const onCreateOrganizationData = `${domain}/onCreateOrganizationData`
export const onUpdateOrganizationData = `${domain}/onUpdateOrganizationData`

export const onBatchOrganizationsPeople = `${domain}/onBatchOrganizationsPeople`

export const onInviteUsersToOrganization = `${domain}/onInviteUsersToOrganization`

export const onResendInvitation = `${domain}/onResendInvitation`
export const onGenerateInvitationLink = `${domain}/onGenerateInvitationLink`
export const onSetUserInvitationLink = `${domain}/onSetUserInvitationLink`

export const onFetchOrganizationPeople = `${domain}/onFetchOrganizationPeople`
export const onFetchOrganizationPeopleSuccess = `${domain}/onFetchOrganizationPeopleSuccess`

export const onCreateUserInOrganizationData = `${domain}/onCreateUserInOrganizationData`
export const onUpdateUserInOrganizationData = `${domain}/onUpdateUserInOrganizationData`
export const onUpdateUserInOrganizationDataSuccess = `${domain}/onUpdateUserInOrganizationDataSuccess`
export const onDeleteUserInOrganizationData = `${domain}/onDeleteUserInOrganizationData`

export const onUpdateWorkspaceName = `${domain}/onUpdateWorkspaceName`

export const onUpdateWorkspace = `${domain}/onUpdateWorkspace`
export const onUpdateWorkspaceSuccess = `${domain}/onUpdateWorkspaceSuccess`
export const onUpdateWorkspaceFailure = `${domain}/onUpdateWorkspaceFailure`

export const onFetchUserOrganizations = `${domain}/onFetchUserOrganizations`

export const onDeactivateUserFromOrganization = `${domain}/onDeactivateUserFromOrganization`
export const onDeactivateUserFromOrganizationSuccess = `${domain}/onDeactivateUserFromOrganizationSuccess`
export const onDeactivateUserFromOrganizationFailure = `${domain}/onDeactivateUserFromOrganizationFailure`

export const onReactivateUserFromOrganization = `${domain}/onReactivateUserFromOrganization`
export const onReactivateUserFromOrganizationSuccess = `${domain}/onReactivateUserFromOrganizationSuccess`
export const onReactivateUserFromOrganizationFailure = `${domain}/onReactivateUserFromOrganizationFailure`

export const onSetOpenedReactivateUserModalId = `${domain}/onSetOpenedReactivateUserModalId`

export const onUpdateUserRole = `${domain}/onUpdateUserRole`
export const onSetUserRole = `${domain}/onSetUserRole`

export const onLogoUpload = `${domain}/onLogoUpload`

export const onInviteGuestsToOrganization = `${domain}/onInviteGuestsToOrganization`

export const onSetOrganizationStatus = `${domain}/onSetOrganizationStatus`

export const onFetchCurrentUserOrganizationRoles = `${domain}/onFetchCurrentUserOrganizationRoles`
export const onFetchCurrentUserOrganizationRolesSuccess = `${domain}/onFetchCurrentUserOrganizationRolesSuccess`

export const onSetCurrentUserInOrganizationId = `${domain}/onSetCurrentUserInOrganizationId`

export const adminRoles = [OrganizationPeopleRole.OWNER, OrganizationPeopleRole.ADMIN]

export const onPurgeUsersInOrganizationData = `${domain}/onPurgeUsersInOrganizationData`