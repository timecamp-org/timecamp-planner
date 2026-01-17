#!/bin/bash
. ../

KEYSTORE_NAME=heyspace-release.keystore

KEYSTORE_PATH=./android/app/${KEYSTORE_NAME}
GRADLEW_PATH=./android

echo "Searching ${KEYSTORE_NAME} in ${KEYSTORE_PATH}"

if [ -f $KEYSTORE_PATH ]; then
  echo "Keystore found. Building release bundle"
  npx jetify
  cd ${GRADLEW_PATH}
  ./gradlew bundleRelease --info
else
  echo "Keystore not found. Generate one with keytool and place in android/app directory. DO NOT STAGE IT IN GITHUB!"
fi
