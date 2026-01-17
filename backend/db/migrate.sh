#!/usr/bin/env bash

PASSWORD="${PGPASSWORD:-${DB_PASSWORD:-${POSTGRES_PASSWORD:-postgres}}}"
USER="${PGUSER:-${DB_USER:-postgres}}"
DB="${PGDATABASE:-${DB_NAME:-heyspace}}"
HOST="${PGHOST:-${DB_HOST:-localhost}}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ALTERS_DIR="${SCRIPT_DIR}/alters"
NOTIFY_TRIGGERS_FILE="${SCRIPT_DIR}/__notify_triggers.sql"

ENV_FILE="$(pwd)/.env"

set -e

if [ -r ${ENV_FILE} ]; then
    echo "Found local config, sourcing..."
    source "${ENV_FILE}"
else
    echo ""
    echo "No local config found."
    echo "Using default configuration."
    echo "To override config create local config file before deploying: ${ENV_FILE}"
    echo ""
fi 


# APPLY NOTIFY TRIGGERS
if [ -f "${NOTIFY_TRIGGERS_FILE}" ]; then
    echo "Applying notify triggers..."
    PGPASSWORD="${PASSWORD}" psql -U "${USER}" -h "${HOST}" -a "${DB}" < "${NOTIFY_TRIGGERS_FILE}" || true > /dev/null
fi

if [ -n "${POSTGRES_PASSWORD}" ]; then
    echo "Ensuring pg_trgm extension exists..."
    PGPASSWORD="${POSTGRES_PASSWORD}" psql -U "postgres" -h "${HOST}" -a "${DB}" -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;" || true > /dev/null
fi

# EXECUTE ALTERS

if [ -z "${@}" ]; then 
    FILES=$(ls -1 ${ALTERS_DIR}/*.sql | sort -V)
else
    FILES="${@}"
fi

echo "${FILES}"

for FILE in ${FILES}
do
    echo -ne "${FILE}...\t\t"
    if [ -e "${FILE}" ]; then
        PGPASSWORD="${PASSWORD}" psql -U "${USER}" -h "${HOST}" -a "${DB}" < "${FILE}" || true > /dev/null
        echo "applied"
    else
        echo "Script not found: ${FILE} !"
        exit 1
    fi
done


