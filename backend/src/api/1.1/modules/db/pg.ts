import config from '../../../../config/index'
import * as pg from 'pg';

export const pgPool = new pg.Pool({
  host:     config.db.connection.host,
  database: config.db.connection.database,
  user:     config.db.connection.user,
  password: config.db.connection.password,
})
