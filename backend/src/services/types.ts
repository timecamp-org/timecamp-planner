
import { UserRegistrationStatus } from '../api/1.0/modules/common/enum'

export interface UserJson
{
  firstName?: string,
  lastName?: string,
  password?: string,
  email?: string,
  avatarUrl?: string,
  registrationStatus?: UserRegistrationStatus,
  ipAddress?: string,
  referrer?: string
}

export type ConversationSettingsJson = {
  isVisible: boolean
}

export type QueryModifier = (q: QueryBuilder) => QueryBuilder;
