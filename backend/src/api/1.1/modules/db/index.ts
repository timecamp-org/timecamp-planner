import { knex } from 'knex';
import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { dbNamingConverter } from '../../../../config/db.config';
import config from '../../../../config/index';
import { DbConnection } from './DbConnection';
import { DbModule } from './DbModule';
import { TableColumnConverter } from './TableColumnConverter';

export const connection = knex(config.db);

export const dbModule: ModuleLoaderType = (kernel) => {
  kernel.bind(DbModule.ConnectionInstance).toConstantValue(connection);
  kernel.bind(DbModule.ConnectionInterface).to(DbConnection);
  kernel.bind(DbModule.NamingConverter).toConstantValue(dbNamingConverter);

  kernel.bind<TableColumnConverter>(DbModule.TableColumnConverter).to(TableColumnConverter);
};
