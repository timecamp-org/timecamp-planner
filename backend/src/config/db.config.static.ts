import { NamingConvention } from '../utils'

export const dbNamingConverter = new NamingConvention.ConventionConverter(
  new NamingConvention.CamelCaseConvention(),
  new NamingConvention.UnderScoreConvention()
)

const getDbEnv = () => ({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'heyspace',
  password: process.env.DB_PASSWORD || 'heyspace',
  database: process.env.DB_NAME || 'heyspace'
})

function snakeCaseConversion(
  value: string,
  origImpl: (value: string) => string,
  queryContext: unknown
): string {
  void queryContext
  const convertedValue = dbNamingConverter.convertIdentifier(value)
  const quotedValue = origImpl(convertedValue)
  return quotedValue
}

function camelCaseConversion(result: unknown, queryContext: unknown): unknown {
  void queryContext
  const converted = dbNamingConverter.reverse().convert(result)
  return converted
}

const BASE_OPTIONS = {
  wrapIdentifier: snakeCaseConversion,
  postProcessResponse: camelCaseConversion,
  notificationChannel: 'notify',
  asyncStackTraces: true,
  client: 'pg',
  searchPath: ['core', 'public']
}

export default {
  development: {
    ...BASE_OPTIONS,
    connection: getDbEnv(),
    useNullAsDefault: true
  },
  staging: {
    ...BASE_OPTIONS,
    connection: getDbEnv(),
    pool: {
      min: 2,
      max: 20,
      propagateCreateError: false
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    ...BASE_OPTIONS,
    connection: getDbEnv(),
    pool: {
      min: 2,
      max: 20,
      propagateCreateError: false
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
