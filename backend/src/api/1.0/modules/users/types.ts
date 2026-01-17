import { UserDbRow, UserInOrganizationDbRow, PublicUserDbRow } from '../db/schema';
import { Id } from '../common/identifier';

export enum CreateUserResultStatus
{
  OK, EMAIL_TAKEN, PASSWORD_TOO_SHORT
}

export enum UpdateUserResultStatus
{
  OK, RESOURCE_NOT_FOUND
}

export enum SendResetPasswordLinkResultStatus
{
  OK, RESOURCE_NOT_FOUND
}

export enum UpdateUserPasswordResultStatus
{
  OK, RESOURCE_NOT_FOUND, PASSWORD_TOO_SHORT, PASSWORD_DOESNT_MATCH
}

export enum GetUserIsOnlineStatus
{
  OK, USER_NOT_FOUND,
}

export enum DeleteUserAvatarStatus
{
  OK, USER_NOT_FOUND, AVATAR_NOT_FOUND,
}

export interface CreateUserResult
{
  status: CreateUserResultStatus;
  user?: Partial<UserDbRow>
}

export interface UpdateUserResult
{
  status: UpdateUserResultStatus;
}

export interface UpdateUserPasswordResult
{
  status: UpdateUserPasswordResultStatus;
  userEmail?: string;
}

export interface GetUserIsOnlineResult
{
  status: GetUserIsOnlineStatus,
  userId: Id,
  isOnline: boolean,
}

export interface SendResetPasswordLinkResult
{
  status: SendResetPasswordLinkResultStatus;
}


export interface DeleteUserAvatarResult
{
  status: DeleteUserAvatarStatus;
}

export enum GeneratePasswordResetLinkStatus {
  OK,
  USER_NOT_FOUND,
}

export interface GeneratePasswordResetLinkResult
{
  status: GeneratePasswordResetLinkStatus;
  url?: string,
}


export interface UserEntityBody {
  userId: Id,
  organizationId: Id,
  userInOrganization: UserInOrganizationDbRow,
  user: PublicUserDbRow,
}