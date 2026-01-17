#!/bin/bash
set -e

./app/common/node_modules/i18next-scanner/bin/cli.js --config i18next-scanner.config.js

RESOURCE_PATH='./app/common/i18n/resources/*'
ORG_RESOURCE_PATH='./app/common/i18n/resources/en'
BASE_DIR='./app/common/i18n/resources'

echo "Generating template.json ..."
cp "${ORG_RESOURCE_PATH}/resource.json" "${BASE_DIR}/template.json"
