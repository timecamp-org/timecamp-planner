import config from '../../../../config/index'
import { knex } from 'knex'
import { ModuleLoaderType } from '../../../../ModuleLoaderType'
import { DbModule } from './DbModule'
import { dbNamingConverter } from '../../../../config/db.config'
import { DbConnection } from './DbConnection'
import { TableColumnConverter } from './TableColumnConverter'

export const connection = knex(config.db);

export const dbModule : ModuleLoaderType = kernel => {
  kernel.bind(DbModule.ConnectionInstance).toConstantValue(connection)
  kernel.bind(DbModule.ConnectionInterface).to(DbConnection);
  kernel.bind(DbModule.NamingConverter).toConstantValue(dbNamingConverter)

  kernel.bind<TableColumnConverter>(DbModule.TableColumnConverter).to(TableColumnConverter);
}
