import { ProjectDbRow, UserDbRow, UserInOrganizationDbRow, OrganizationDbRow } from "../db/schema";

export enum JoinOrganizationAsGuestAndCreateSpaceStatus {
  OK,
  ORGANIZATION_NOT_FOUND,
  ORGANIZATION_ALREADY_EXISTS,
  USER_NOT_FOUND,
  PASSWORD_TOO_SHORT,
  EMAIL_TAKEN,
  PROJECT_ALREADY_EXISTS,
  INVALID_INVITER_ROLE,
  BOT_NOT_CREATED,
  SPACE_NOT_CREATED,
  CONVERSATION_NOT_CREATED,
  USER_ALREADY_IN_PROJECT,
  NOT_PERMITTED,
  CUSTOM_FIELD_DOES_NOT_EXIST,
  CUSTOM_FIELD_FULLY_QUALIFIED_NAME_MALFORMED,
  NAMESPACE_DOES_NOT_EXIST,
  UNKNOWN_TARGET_TYPE,
}

export type JoinOrganizationAsGuestAndCreateSpaceResult = {
  status: JoinOrganizationAsGuestAndCreateSpaceStatus,
  conversation?: ProjectDbRow,
  currentUser?: Partial<UserDbRow>,
  userOrganizations?: OrganizationDbRow[],
}

export enum GetBasicInvitationDataStatus {
  OK,
  NOT_PERMITTED,
  USER_NOT_FOUND,
  USER_IN_ORGANIZATION_NOT_FOUND,
  ORGANIZATION_NOT_FOUND,
}

export type GetBasicInvitationDataResult = {
  status: GetBasicInvitationDataStatus,
  user?: Partial<UserDbRow>,
  userInOrganization?: UserInOrganizationDbRow,
  organization?: OrganizationDbRow,
}

export enum GenerateTokenStatus {
  OK,
  USER_IN_ORGANIZATION_NOT_FOUND,
}

export type GenerateTokenResult = {
  status: GenerateTokenStatus,
  tokenString?: string,
}
