import { GroupDbRow } from '../db/schema';

export enum CreateGroupStatus {
  OK,
}

export interface CreateGroupResult {
  status: CreateGroupStatus;
  group?: GroupDbRow;
}

export enum DeleteGroupStatus {
  OK,
}
export interface DeleteGroupResult {
  status: DeleteGroupStatus;
}

export enum UpdateGroupStatus {
  OK,
}

export interface UpdateGroupResult {
  status: UpdateGroupStatus;
  group?: GroupDbRow;
}

export enum AddUserToGroupStatus {
  OK,
}
export interface AddUserToGroupResult {
  status: AddUserToGroupStatus;
}

export enum RemoveUserFromGroupStatus {
  OK,
}

export interface RemoveUserFromGroupResult {
  status: RemoveUserFromGroupStatus;
}
