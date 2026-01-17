import {
  GetUserInOrganizationSettingsResult,
  SaveUserInOrganizatioSettingsResult,
} from '../types';
import { UserInOrganizationSettingsType } from '../../db/schema';
import { Id } from '../../common/identifier';
import { AnyDict } from '../../common/types';


export interface UserInOrganizationSettingsServiceInterface {
  getSettings(
    userId: Id,
    organizationId: Id,
    settingsType: UserInOrganizationSettingsType,
    settingsId?: Id,
  ): PromiseLike<GetUserInOrganizationSettingsResult>;

  saveSettings(
    userId: Id,
    organizationId: Id,
    settingsType: UserInOrganizationSettingsType,
    settingsJson: AnyDict,
    settingsId?: Id,
  ): PromiseLike<SaveUserInOrganizatioSettingsResult>;
}
