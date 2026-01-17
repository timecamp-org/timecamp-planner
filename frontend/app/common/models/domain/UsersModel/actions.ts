import * as C from './constants';
import { User } from './models';
import { Map, List } from 'immutable';
import { ActionResultInterface, ActionResultPayload } from 'models/domain/ActionResultModel';
import { PayloadAction } from 'common/types';
import {
  UserEntityInterface,
  UserInterface,
  UsersDataInterface,
  UserSettings,
  UsersOnlineStatusInterface,
} from 'models/domain/UsersModel/types';
import { Id } from 'common/utils/identifier';
import {
  OnAvatarUpdatePayload,
  OnAvatarUploadPayload,
  OnBatchUserOnlineStatusPayload,
  OnBatchUsersDataPayload,
  OnCreateUserDataPayload,
  OnCreateUserOrganizationsPayload,
  OnEmailUpdatePayload,
  OnFirstNameUpdatePayload,
  OnLastNameUpdatePayload,
  OnNicknameUpdatePayload,
  OnSetIsUserOnlinePayload,
  OnUpdateUserDataPayload,
  OnUpdateUserPayload,
  UserIdPayload,
  UserPayload,
} from 'models/domain/UsersModel/payloads';
import { action } from 'typesafe-actions';
import { Action } from 'redux';
import { EntityInterface } from 'models/domain/EntityModel/types';
import { FileUploaded } from 'models/domain/FilesModel/types';

const emptyMap = Map();

export const onInit = () => action(C.onInit);

export const onInitSuccess = (actionResult: ActionResultInterface): PayloadAction<ActionResultPayload> =>
  action(C.onInitSuccess, { actionResult });

export const onInitFailure = (actionResult: ActionResultInterface): PayloadAction<ActionResultPayload> =>
  action(C.onInitFailure, { actionResult });

export const onCreateUser = (user: User): PayloadAction<UserPayload> => action(C.onCreateUser, { user });

export const setCurrentUserId = (userId?: Id): PayloadAction<UserIdPayload> => action(C.currentUserId, { userId });

export const onUpdateUser = (
  userSettings?: UserSettings,
  ignoreDebounce: boolean = false
): PayloadAction<OnUpdateUserPayload> => {
  return action(C.onUpdateUser, {
    userSettings,
    ignoreDebounce,
  });
};

export const onUpdateUserSuccess = (
  actionResult: ActionResultInterface<UserInterface>
): PayloadAction<ActionResultPayload> => action(C.onUpdateUserSuccess, { actionResult });

export const onUpdateUserFailure = (
  actionResult: ActionResultInterface<UserInterface>
): PayloadAction<ActionResultPayload> => action(C.onUpdateUserFailure, { actionResult });

export const onDeleteUser = (userId: Id): PayloadAction<UserIdPayload> => action(C.onDeleteUser, { userId });

export const onBatchUsersData = (
  usersEntities: List<UserEntityInterface> | UserEntityInterface[]
): PayloadAction<OnBatchUsersDataPayload> => {
  let usersData = emptyMap as UsersDataInterface;
  usersEntities.forEach((entity) => {
    const userRecord = new User(entity);
    usersData = usersData.set(userRecord.id, userRecord);
  });
  return action(C.onBatchUsersData, { usersData });
};

export const onBatchUserOnlineStatus = (
  usersEntities: List<UserEntityInterface> | UserEntityInterface[],
  currentUserId: Id
): PayloadAction<OnBatchUserOnlineStatusPayload> => {
  let userOnlineStatus = emptyMap as UsersOnlineStatusInterface;
  usersEntities.forEach((entity) => {
    if (entity.id === currentUserId) {
      return;
    }
    userOnlineStatus = userOnlineStatus.set(entity.id, Boolean(entity.isOnline));
  });
  return action(C.onBatchUserOnlineStatus, { userOnlineStatus });
};

export const onCreateUserData = (
  entity: EntityInterface<UserEntityInterface>
): PayloadAction<OnCreateUserDataPayload> =>
  action(C.onCreateUserData, {
    userData: new User(entity.body),
    isOnline: entity.body.isOnline,
  });

export const onUpdateUserData = (
  entity: EntityInterface<UserEntityInterface>
): PayloadAction<OnUpdateUserDataPayload> => {
  const user = entity.body;
  return action(C.onUpdateUserData, {
    userData: new User(user),
    isOnline: user ? user.isOnline : false,
  });
};

export const onFirstNameUpdate = (userId: Id, firstName: string): PayloadAction<OnFirstNameUpdatePayload> =>
  action(C.onFirstNameUpdate, {
    userId,
    firstName,
  });

export const onLastNameUpdate = (userId: Id, lastName: string): PayloadAction<OnLastNameUpdatePayload> =>
  action(C.onLastNameUpdate, {
    userId,
    lastName,
  });

export const onNicknameUpdate = (userId: Id, nickname: string): PayloadAction<OnNicknameUpdatePayload> =>
  action(C.onNicknameUpdate, {
    userId,
    nickname,
  });

export const onEmailUpdate = (userId: Id, email: string): PayloadAction<OnEmailUpdatePayload> =>
  action(C.onEmailUpdate, {
    userId,
    email,
  });

export const onAvatarUpdate = (userId: Id, avatarUrl: string): PayloadAction<OnAvatarUpdatePayload> =>
  action(C.onAvatarUpdate, {
    userId,
    avatarUrl,
  });

export const onAvatarUpload = (file: FileUploaded): PayloadAction<OnAvatarUploadPayload> =>
  action(C.onAvatarUpload, { file });

export const onGravatarSet = (): Action => action(C.onGravatarSet);

export const onSetIsUserOnline = (userId: Id, isOnline: boolean): PayloadAction<OnSetIsUserOnlinePayload> =>
  action(C.onSetIsUserOnline, {
    userId,
    isOnline,
  });

export const onCreateUserOrganizations = (
  userId: string,
  organizations: Id[] | List<Id>
): PayloadAction<OnCreateUserOrganizationsPayload> => {
  const userOrganizations = List(organizations) as List<Id>;
  return action(C.onCreateUserOrganizations, {
    userId,
    userOrganizations,
  });
};
