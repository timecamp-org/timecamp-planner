import { LinkedViewSettingsProviderInterface } from '../interfaces/LinkedViewSettingsProviderInterface';
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider';
import Table from '../../db/Table';


export class LinkedViewSettingsProvider
  extends AbstractPostgresProvider
  implements LinkedViewSettingsProviderInterface {

  async createViewSettingsLink(baseViewSettingsId: string, linkedViewSettingsId: string, trx?: Transaction): Promise<void> {
    return await this.connection.getQueryWithTransaction(trx)
      .insert({
        baseViewSettingsId,
        linkedViewSettingsId,
      })
      .into(Table.SETTINGS_LINKED_VIEW_SETTINGS)
  }

  async removeViewSettingsLink(baseViewSettingsId: string, linkedViewSettingsId: string): Promise<void> {
    return await this.connection.getQueryBuilder()
      .from(Table.SETTINGS_LINKED_VIEW_SETTINGS)
      .where({
        baseViewSettingsId,
        linkedViewSettingsId,
      })
      .del()
  }

  async getLinkedViewSettingsIdsByBaseId(baseViewSettingsId: string): Promise<string[]> {
    return await this.connection.getQueryBuilder()
      .select('linkedViewSettingsId')
      .from(Table.SETTINGS_LINKED_VIEW_SETTINGS)
      .where({ baseViewSettingsId })
      .pluck('linked_view_settings_id')
  }

}