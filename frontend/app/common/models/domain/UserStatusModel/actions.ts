import * as C from './constants'
import { UserStatusInterface, UserStatusRecordInterface } from './types';
import { EntityInterface } from '../EntityModel/types';
import { action } from 'typesafe-actions'
import { UserStatus } from './models';
import { getMapOfRecords } from 'common/utils/immutableUtils';


export const onInit = () =>
  action(C.onInit)

export const onBatchUserStatusData = (userStatuses: Partial<UserStatusInterface[]>) => {
  const userStatusData = getMapOfRecords<UserStatusInterface, UserStatusRecordInterface>(userStatuses, UserStatus)
  return action(C.onBatchUserStatusData, userStatusData)
}

export const onCreateUserStatusData = (userStatusData: EntityInterface) =>
  action(C.onCreateUserStatusData, UserStatus(userStatusData.body))
export const onUpdateUserStatusData = (userStatusData: EntityInterface) =>
  action(C.onUpdateUserStatusData, UserStatus(userStatusData.body))
export const onDeleteUserStatusData = (userStatusData: EntityInterface) =>
  action(C.onDeleteUserStatusData, { id: userStatusData.body.id })

export const onSetUserStatus = (userStatus: Partial<UserStatusInterface>) =>
  action(C.onSetUserStatus, userStatus)

export const onSetUserStatusSuccess = (userStatus: UserStatusInterface) =>
  action(C.onSetUserStatusSuccess, userStatus)

export const onRemoveUserStatus = () =>
  action(C.onRemoveUserStatus)
