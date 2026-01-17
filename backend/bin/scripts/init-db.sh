#!/bin/bash
set -e

APP_DB_USER="${DB_USER:-heyspace}"
APP_DB_PASSWORD="${DB_PASSWORD:-heyspace}"
APP_DB_NAME="${DB_NAME:-heyspace}"

echo "Creating ${APP_DB_USER} user and ${APP_DB_NAME} database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${APP_DB_USER}') THEN
            CREATE ROLE ${APP_DB_USER} WITH LOGIN PASSWORD '${APP_DB_PASSWORD}' CREATEDB CREATEROLE;
        ELSE
            ALTER ROLE ${APP_DB_USER} WITH LOGIN PASSWORD '${APP_DB_PASSWORD}' CREATEDB CREATEROLE;
        END IF;
    END
    \$\$;
EOSQL

if ! psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -tAc \
  "SELECT 1 FROM pg_database WHERE datname='${APP_DB_NAME}'" | grep -q 1; then
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
    -c "CREATE DATABASE ${APP_DB_NAME} OWNER ${APP_DB_USER};"
fi

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -c "GRANT ALL PRIVILEGES ON DATABASE ${APP_DB_NAME} TO ${APP_DB_USER};"

echo "Running schema initialization script..."
if [ -f /docker-entrypoint-initdb.d/__init__.sql ]; then
  PGPASSWORD="${POSTGRES_PASSWORD}" psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$APP_DB_NAME" \
    -v APP_DB_USER="$APP_DB_USER" -f /docker-entrypoint-initdb.d/__init__.sql
fi

echo "Database user and database created successfully!"
