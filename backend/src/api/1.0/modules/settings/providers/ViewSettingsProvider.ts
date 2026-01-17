import { Id } from '../../common/identifier';
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider';
import Table from '../../db/Table';
import { ViewSettingsProviderInterface } from '../interfaces/ViewSettingsProviderInterface';
import { ViewContainerType, ViewSettingsDbRow, ViewSettingsFullDbRow, ViewSettingsType } from '../../db/schema';
import { first } from 'lodash'
import { injectable, inject } from 'inversify';
;
import { DbModule } from '../../db/DbModule';
import { ConnectionInterface } from '../../db/ConnectionInterface';
import { SettingsModule } from '../SettingsModule';
import { DictProvider } from '../../dict/DictProvider';

@injectable()
export class ViewSettingsProvider extends AbstractPostgresProvider implements ViewSettingsProviderInterface {

  constructor(
    @inject(DbModule.ConnectionInterface)
    protected connection: ConnectionInterface,
    @inject(SettingsModule.DictViewType)
    private viewTypeDictProvider: DictProvider<ViewSettingsType>,
  ) {
    super(connection)
  }

  private getBaseSelectQuery(trx?: Transaction): QueryBuilder {
    return this.connection.getQueryWithTransaction(trx)
      .select(`${Table.SETTINGS_VIEW_SETTINGS}.*`, `${Table.DICT_VIEW_TYPE}.value as viewType`)
      .from(Table.SETTINGS_VIEW_SETTINGS)
      .join(Table.DICT_VIEW_TYPE, `${Table.SETTINGS_VIEW_SETTINGS}.viewTypeId`, `${Table.DICT_VIEW_TYPE}.id`)
  }

  private async getViewTypeFromDict(results: ViewSettingsDbRow[], trx?: Transaction): Promise<ViewSettingsFullDbRow> {
    const result = first(results)
    const dictRow = await this.viewTypeDictProvider.getItemById(result.viewTypeId, trx)
    return {
      ...result,
      viewType: dictRow.value
    }
  }

  async getSettngsById(id: Id, trx?: Transaction): Promise<ViewSettingsFullDbRow> {
    const baseSelectQuery = this.getBaseSelectQuery(trx)
    return await baseSelectQuery
      .where({ [`${Table.SETTINGS_VIEW_SETTINGS}.id`]: id })
      .first()
  }

  async getSettngsByIds(ids: Id[]): Promise<ViewSettingsFullDbRow[]> {
    const baseSelectQuery = this.getBaseSelectQuery()
    return await baseSelectQuery
      .whereIn(`${Table.SETTINGS_VIEW_SETTINGS}.id`, ids)
  }

  async getSettngsByTypeAndContainer(
    viewTypeId: Id,
    containerId: Id,
    containerType: ViewContainerType,
    userId: Id
  ): Promise<ViewSettingsFullDbRow> {
    const baseSelectQuery = this.getBaseSelectQuery()
    return await baseSelectQuery
      .where({ viewTypeId, containerId, containerType, userId })
      .first()
  }

  async createSettings(viewSettingsJson: Partial<ViewSettingsDbRow>, trx?: Transaction): Promise<ViewSettingsFullDbRow> {
    return await this.connection.getQueryWithTransaction(trx)
      .insert(viewSettingsJson)
      .into(Table.SETTINGS_VIEW_SETTINGS)
      .returning('*')
      .then<ViewSettingsFullDbRow>((results) => this.getViewTypeFromDict(results, trx))
  }

  async updateSettings(id: Id, viewSettingsJson: Partial<ViewSettingsDbRow>, trx?: Transaction): Promise<ViewSettingsFullDbRow> {
    return await this.connection.getQueryBuilder()
      .update(viewSettingsJson)
      .from(Table.SETTINGS_VIEW_SETTINGS)
      .where({ id })
      .returning('*')
      .then<ViewSettingsFullDbRow>((results) => this.getViewTypeFromDict(results, trx))
  }

  async deleteSettings(id: Id): Promise<void> {
    return await this.connection.getQueryBuilder()
      .from(Table.SETTINGS_VIEW_SETTINGS)
      .where({ id })
      .del()
  }

}
