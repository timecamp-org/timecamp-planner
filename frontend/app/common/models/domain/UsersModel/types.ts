import { Id } from '../../../utils/identifier';
import { ImmutableMap } from 'common/types';
import { List, Map } from 'immutable';
import { User } from 'models/domain/UsersModel/models';
import { DateFormat, TimeFormat } from 'models/domain/UsersModel/constants/timeSettings';
import { EntityStatus } from 'models/domain/EntityModel/types';

export type UsersDataInterface = Map<Id, User>;

export type UsersOnlineStatusInterface = Map<Id, boolean>;

export type UserOrganizationIdsInterface = Map<Id, List<Id>>;

export interface UsersState extends ImmutableMap<string, any> {
  currentUserId: Id;
  isAuthenticating: boolean;
  usersData: UsersDataInterface;
  userOnlineStatus: UsersOnlineStatusInterface;
  userOrganizationIds: UserOrganizationIdsInterface;
}

export interface UserInterface {
  id: Id;

  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  avatarUrl: string;
  isBot: boolean;
  locale: Locale;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  firstDayOfWeek: number;
  registrationStatus: RegistrationStatus;
  status: EntityStatus;
  createdAt: number;
}

export enum RegistrationStatus {
  PENDING = 'pending',
  REGISTERED = 'registered',
  VERIFIED = 'verified',
  NOT_VERIFIED = 'not_verified',
}

export interface TimeSettingsOption {
  value: DateFormat;
  label: string;
}

export interface UserSettings {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  avatarUrl?: string;
  registrationStatus?: RegistrationStatus;
  nickname?: string;
}

export interface UserEntityInterface extends UserInterface {
  isOnline: boolean;
}

export type Locale = 'en' | 'pl' | 'es' | 'de' | 'pt' | 'it' | 'hu' | 'tr' | 'ar_EG' | 'fr' | 'ja' | 'ru';
