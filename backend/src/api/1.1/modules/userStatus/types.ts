import { UserStatusDbRow } from "../db/schema";

export enum SetUserStatusStatus {
  OK,
  USER_NOT_FOUND,
  ORGANIZATION_NOT_FOUND
}

export type SetUserStatusResult = {
  status: SetUserStatusStatus,
  userStatus?: UserStatusDbRow,
}

export enum DeleteUserStatusStatus {
  OK,
  USER_NOT_FOUND,
  ORGANIZATION_NOT_FOUND,
  STATUS_NOT_FOUND
}

export type DeleteUserStatusResult = {
  status: DeleteUserStatusStatus,
}

export enum GetOrganizationUserStatusesStatus {
  OK,
  USER_NOT_FOUND,
  ORGANIZATION_NOT_FOUND
}

export type GetOrganizationUserStatusesResult = {
  status: GetOrganizationUserStatusesStatus,
  userStatuses?: UserStatusDbRow[],
}

export type UserStatusJson = Partial<UserStatusDbRow>
