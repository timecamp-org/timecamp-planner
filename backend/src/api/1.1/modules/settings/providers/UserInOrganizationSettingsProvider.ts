import { Id } from '../../common/identifier';
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider';
import Table from '../../db/Table';
import { UserInOrganizationSettingsDbRow, UserInOrganizationSettingsFullDbRow, UserInOrganizationSettingsType } from '../../db/schema';
import { first } from 'lodash'
import { injectable, inject } from 'inversify';

import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { SettingsModule } from '../SettingsModule';
import { DictProvider } from '../../dict/DictProvider';
import { UserInOrganizationSettingsProviderInterface } from '../interfaces/UserInOrganizationSettingsProviderInterface';

@injectable()
export class UserInOrganizationSettingsProvider extends AbstractPostgresProvider implements UserInOrganizationSettingsProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    protected connection: ConnectionInterface,
    @inject(SettingsModule.DictUserInOrganizationSettingsType)
    private settingsTypeDictProvider: DictProvider<UserInOrganizationSettingsType>,
  ) {
    super(connection)
  }

  private getBaseSelectQuery(trx?: Transaction): QueryBuilder {
    return this.connection.getQueryWithTransaction(trx)
      .select(`${Table.SETTINGS_USER_IN_ORGANIZATION_SETTINGS}.*`, `${Table.DICT_USER_IN_ORGANIZATION_SETTINGS_TYPE}.value as settingsType`)
      .from(Table.SETTINGS_USER_IN_ORGANIZATION_SETTINGS)
      .join(Table.DICT_USER_IN_ORGANIZATION_SETTINGS_TYPE, `${Table.SETTINGS_USER_IN_ORGANIZATION_SETTINGS}.typeId`, `${Table.DICT_USER_IN_ORGANIZATION_SETTINGS_TYPE}.id`)
  }

  private async getSettingsTypeFromDict(results: UserInOrganizationSettingsDbRow[], trx?: Transaction): Promise<UserInOrganizationSettingsFullDbRow> {
    const result = first(results)
    const dictRow = await this.settingsTypeDictProvider.getItemById(result.typeId, trx)
    return {
      ...result,
      settingsType: dictRow.value
    }
  }

  async getSettngsById(id: Id, trx?: Transaction): Promise<UserInOrganizationSettingsFullDbRow> {
    const baseSelectQuery = this.getBaseSelectQuery(trx)
    return await baseSelectQuery
      .where({ [`${Table.SETTINGS_USER_IN_ORGANIZATION_SETTINGS}.id`]: id })
      .first()
  }

  async getSettngsByUserInOrganization(userInOrganizationId: Id, trx?: Transaction): Promise<UserInOrganizationSettingsFullDbRow[]> {
    const baseSelectQuery = this.getBaseSelectQuery(trx)
    return await baseSelectQuery
      .where({ [`${Table.SETTINGS_USER_IN_ORGANIZATION_SETTINGS}.user_in_organization_id`]: userInOrganizationId })
  }

  async getSettngsByTypeAndContainer<T>(
    settingsType: UserInOrganizationSettingsType,
    organizationId: Id,
    userId: Id
  ): Promise<UserInOrganizationSettingsFullDbRow<T>> {
    const baseSelectQuery = this.getBaseSelectQuery()
    return await baseSelectQuery
      .join(Table.USER_IN_ORGANIZATION, `${Table.SETTINGS_USER_IN_ORGANIZATION_SETTINGS}.userInOrganizationId`, `${Table.USER_IN_ORGANIZATION}.id`)
      .where({ organizationId, userId, [`${Table.DICT_USER_IN_ORGANIZATION_SETTINGS_TYPE}.value`]: settingsType })
      .first()
  }

  async createSettings(settingsJson: Partial<UserInOrganizationSettingsDbRow>, trx?: Transaction): Promise<UserInOrganizationSettingsFullDbRow> {
    return await this.connection.getQueryWithTransaction(trx)
      .insert(settingsJson)
      .into(Table.SETTINGS_USER_IN_ORGANIZATION_SETTINGS)
      .returning('*')
      .then<UserInOrganizationSettingsFullDbRow>((results) => this.getSettingsTypeFromDict(results, trx))
  }

  async updateSettings(id: Id, settingsJson: Partial<UserInOrganizationSettingsDbRow>, trx?: Transaction): Promise<UserInOrganizationSettingsFullDbRow> {
    return await this.connection.getQueryBuilder()
      .update(settingsJson)
      .from(Table.SETTINGS_USER_IN_ORGANIZATION_SETTINGS)
      .where({ id })
      .returning('*')
      .then<UserInOrganizationSettingsFullDbRow>((results) => this.getSettingsTypeFromDict(results, trx))
  }

}
