import { User } from 'models/domain/UsersModel/models'
import { Id } from 'common/utils/identifier'
import { List } from 'immutable'
import { UsersDataInterface, UserSettings, UsersOnlineStatusInterface } from 'models/domain/UsersModel/types'
import { FileUploaded } from 'models/domain/FilesModel/types'

export interface UserPayload {
  user: User,
}

export interface OnCreateUserDataPayload {
  userData: User,
  isOnline: boolean,
}

export interface OnBatchUserOnlineStatusPayload {
  userOnlineStatus: UsersOnlineStatusInterface,
}

export interface OnUpdateUserDataPayload extends OnCreateUserDataPayload {
}

export interface OnBatchUsersDataPayload {
  usersData: UsersDataInterface
}

export interface OnUpdateUserPayload {
  userSettings: UserSettings,
  ignoreDebounce: boolean,
}

export interface UserIdPayload {
  userId: Id,
}

export interface OnFirstNameUpdatePayload extends UserIdPayload {
  firstName: string,
}

export interface OnLastNameUpdatePayload  extends UserIdPayload {
  lastName: string,
}

export interface OnNicknameUpdatePayload extends UserIdPayload {
  nickname: string,
}

export interface OnEmailUpdatePayload extends UserIdPayload {
  email: string,
}

export interface OnAvatarUploadPayload {
  file: FileUploaded,
}

export interface OnAvatarUpdatePayload extends UserIdPayload {
  avatarUrl: string,
}

export interface OnSetIsUserOnlinePayload extends UserIdPayload {
  isOnline: boolean,
}

export interface OnCreateUserOrganizationsPayload extends UserIdPayload {
  userOrganizations: List<Id>,
}
