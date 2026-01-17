import { UserStatusInterface, UserStatusRecordInterface } from './types';
import { makeTypedFactory } from 'typed-immutable-record';

const defaultUserStatus: UserStatusInterface = {
  id: undefined,
  title: '',
  emojiCode: undefined,
  organizationId: undefined,
  userId: undefined,
  resetAt: undefined,
}

export const UserStatus = makeTypedFactory<
  UserStatusInterface | UserStatusRecordInterface,
  UserStatusRecordInterface
>
  (defaultUserStatus)
