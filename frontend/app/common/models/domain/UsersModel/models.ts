import { Record } from 'immutable';
import { Locale, RegistrationStatus, UserInterface } from 'models/domain/UsersModel/types';
import { EntityStatus } from 'models/domain/EntityModel/types';
import { Id } from 'common/utils/identifier';
import { DateFormat, TimeFormat } from 'models/domain/UsersModel/constants/timeSettings';

const defaultUser: UserInterface = {
  id: undefined,

  firstName: undefined,
  lastName: undefined,
  nickname: undefined,
  email: undefined,
  avatarUrl: undefined,
  isBot: false,

  // time and date stuff
  locale: 'en',
  dateFormat: DateFormat.YearMonthDay,
  timeFormat: TimeFormat.HoursMinutes,
  firstDayOfWeek: 1, // 0 = Sunday, 1 = Monday ...

  registrationStatus: null,
  status: null,
  createdAt: null,
};

export class User extends Record(defaultUser) implements UserInterface {
  public readonly id!: Id;
  public readonly firstName!: string;
  public readonly lastName!: string;
  public readonly nickname!: string;
  public readonly email!: string;
  public readonly avatarUrl!: string;
  public readonly isBot!: boolean;
  public readonly locale!: Locale;
  public readonly dateFormat!: DateFormat;
  public readonly timeFormat!: TimeFormat;
  public readonly firstDayOfWeek!: number;
  public readonly registrationStatus!: RegistrationStatus;
  public readonly status!: EntityStatus;
  public readonly createdAt!: number;

  public constructor(values?: Partial<UserInterface>) {
    values ? super(values) : super();
  }
}
