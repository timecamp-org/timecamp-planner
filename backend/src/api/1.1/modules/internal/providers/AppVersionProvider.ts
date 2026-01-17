import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider'
import { AppVersionProviderInterface } from '../interfaces/AppVersionProviderInterface'
import Table from '../../db/Table'
import { AppVersionDbRow } from '../../db/schema'
import { Id } from '../../common/identifier'

export class AppVersionProvider extends AbstractPostgresProvider implements AppVersionProviderInterface {
  async getCurrentAppVersion(appPlatformId: Id): Promise<AppVersionDbRow> {
    const query = this.connection.getQueryBuilder()

    return await query
      .select(`${Table.APP_VERSION}.*`)
      .from(Table.APP_VERSION)
      .where({ appPlatformId })
      .orderBy('deployedAt', 'desc')
      .first()
  }
}