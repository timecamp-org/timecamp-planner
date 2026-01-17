#!/bin/bash
PASSWORD="postgres"
USER="postgres"
DB="heyspace"
HOST="localhost"
DB_ALLOW_DROP=
DB_FILES="__notify_triggers.sql sample_space/__sample_space.sql sample_space/__sample_space_pl.sql"

ENV_FILE="$(pwd)/.env"


if [ -r "${ENV_FILE}" ]; then
    echo "Found local config (${ENV_FILE}), sourcing..."
    source "${ENV_FILE}"
else
    echo ""
    echo "No local config found."
    echo "Using default configuration."
    echo "To override config create local config file before deploying: ${ENV_FILE}"
    echo ""
fi

if [ -z "${DB_ALLOW_DROP}" ]; then
    echo "DROP DATABASE FORBIDDEN by env settings"
    exit 1
fi

pushd "$(dirname "$0")"

set -e
echo "dropping heyspace db"
PGPASSWORD="${PASSWORD}" dropdb -U "${USER}" -h "${HOST}" "${DB}" || echo "Database does not exist"
echo "recreating heyspace db"
PGPASSWORD="${PASSWORD}" psql -U "${USER}" -h "${HOST}" postgres -c "DROP ROLE IF EXISTS heyspace; CREATE USER heyspace WITH PASSWORD 'heyspace' CREATEDB CREATEROLE;" 
PGPASSWORD="${PASSWORD}" createdb -U "${USER}" -h "${HOST}" "${DB}" 
PGPASSWORD="${PASSWORD}" psql -U "${USER}" -h "${HOST}" -a < "__init__.sql" > /dev/null


for FILE in ${DB_FILES}
do
    if [ -e "./${FILE}" ]; then
        echo "Loading ${FILE}..."
        PGPASSWORD="${PASSWORD}" psql -U "${USER}" -h "${HOST}" -a < "${FILE}" > /dev/null
    fi
done

echo "All done".

popd
# EXECUTE ALTERS
$(realpath $(dirname $0))/migrate.sh
