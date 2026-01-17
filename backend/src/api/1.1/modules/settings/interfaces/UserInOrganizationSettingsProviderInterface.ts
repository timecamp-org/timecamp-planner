import { UserInOrganizationSettingsDbRow, UserInOrganizationSettingsFullDbRow, UserInOrganizationSettingsType } from '../../db/schema';
import { Id } from '../../common/identifier';


export interface UserInOrganizationSettingsProviderInterface {

  getSettngsById(id: Id, trx?: Transaction): PromiseLike<UserInOrganizationSettingsFullDbRow>;

  getSettngsByUserInOrganization(userInOrganizationId: Id, trx?: Transaction): PromiseLike<UserInOrganizationSettingsFullDbRow[]>;

  getSettngsByTypeAndContainer<T>(
    settingsType: UserInOrganizationSettingsType,
    organizationId: Id,
    userId: Id
  ): PromiseLike<UserInOrganizationSettingsFullDbRow<T>>;

  createSettings(settingsJson: Partial<UserInOrganizationSettingsDbRow>, trx?: Transaction): PromiseLike<UserInOrganizationSettingsFullDbRow>;

  updateSettings(id: Id, settingsJson: Partial<UserInOrganizationSettingsDbRow>, trx?: Transaction): PromiseLike<UserInOrganizationSettingsFullDbRow>;
}
