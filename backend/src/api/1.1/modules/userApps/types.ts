import { OAuthClientDbRow, UserInAppDbRow, UserDbRow, PublicUserDbRow } from "../db/schema";
import { Id } from "../common/identifier";
import { Dict } from "../common/types";

export interface UserAppJson {
  clientName: string,
  clientThumbnailUrl: string,
  clientRedirectUris: string,
}

export interface AppWithClientInterface {
  id: Id,
  oAuthClient: OAuthClientDbRow,
}

export enum CreateUserAppStatus {
  OK,
  APP_ALREADY_EXISTS,
}

export interface CreateUserAppResult {
  status: CreateUserAppStatus,
  app?: AppWithClientInterface,
}

export enum UpdateUserAppStatus {
  OK,
  APP_NOT_FOUND
}

export interface UpdateUserAppResult {
  status: UpdateUserAppStatus,
  app?: AppWithClientInterface,
}

export enum GetUserAppsStatus {
  OK
}

export interface GetUserAppsResult {
  status: GetUserAppsStatus,
  apps?: AppWithClientInterface[],
  usersInApps?: UsersInApps,
  users?: PublicUserDbRow[],
}

export enum DeleteUserAppStatus {
  OK,
  APP_NOT_FOUND,
  OAUTH_CLIENT_NOT_FOUND,
}

export interface DeleteUserAppResult {
  status: DeleteUserAppStatus,
}

export enum AddUserAppMemberStatus {
  OK,
  APP_NOT_FOUND,
  USER_NOT_FOUND
}

export interface AddUserAppMemberResult {
  status: AddUserAppMemberStatus,
}

export enum InviteUserAppMemberStatus {
  OK,
  APP_NOT_FOUND,
  USER_NOT_FOUND
}

export interface InviteUserAppMemberResult {
  status: InviteUserAppMemberStatus,
  user?: UserDbRow,
}

export enum RemoveUserAppMemberStatus {
  OK,
  APP_NOT_FOUND,
  USER_NOT_FOUND
}

export interface RemoveUserAppMemberResult {
  status: RemoveUserAppMemberStatus,
}

export type UsersInApps = Dict<Partial<UserInAppDbRow>[]>;
