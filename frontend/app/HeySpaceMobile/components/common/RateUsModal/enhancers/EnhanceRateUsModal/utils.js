import DeviceInfo from 'react-native-device-info'
import AsyncStorage from '../../../../../localStorage'
import differenceInDays from 'date-fns/difference_in_days'

import { timestampNow } from 'common/utils/epoch'

const LAST_REVIEW_TIMESTAMP = 'LAST_REVIEW_TIMESTAMP'
const APP_OPEN_COUNT = 'APP_OPEN_COUNT'
const LAST_DISMISS_TIMESTAMP = 'LAST_DISMISS_TIMESTAMP'

const MIN_TIME_AFTER_FIRST_INSTALL_IN_DAYS = 5
const MIN_TIME_AFTER_LAST_DISMISS_IN_DAYS = 20
const MIN_APP_OPEN_COUNT = 10
export const SHOW_MODAL_TIMEOUT = 5 * 1000 // 5 seconds

export const shouldShowRateUsModal = async () => {
  let result = false
  const currentTimestamp = timestampNow()
  const firstInstallTime = DeviceInfo.getFirstInstallTime()
  const lastReviewTimestamp = await getLastReviewTimestamp()
  const appOpenCount = await getAppOpenCount()
  const lastDismissTimestamp = await getLastDismissTimestamp()

  if (lastDismissTimestamp) {
    if (differenceInDays(currentTimestamp, lastDismissTimestamp) >= MIN_TIME_AFTER_LAST_DISMISS_IN_DAYS) {
      result = true
    }
  } else if (!lastReviewTimestamp
    && appOpenCount >= MIN_APP_OPEN_COUNT
    && differenceInDays(currentTimestamp, firstInstallTime) >= MIN_TIME_AFTER_FIRST_INSTALL_IN_DAYS
  ) {
    result = true
  }

  return result
}

export const getLastReviewTimestamp = async () => {
  const timestamp = await AsyncStorage.getItem(LAST_REVIEW_TIMESTAMP)
  return timestamp !== 'null' ? parseInt(timestamp) : null
}

export const setLastReviewTimestamp = async (timestamp) => {
  return await AsyncStorage.setItem(LAST_REVIEW_TIMESTAMP, `${timestamp}`)
}

export const getAppOpenCount = async () => {
  const appOpenCount = await AsyncStorage.getItem(APP_OPEN_COUNT) || 0
  return parseInt(appOpenCount)
}

export const incrementAppOpenCount = async () => {
  const appOpenCount = await getAppOpenCount()
  return await AsyncStorage.setItem(APP_OPEN_COUNT, `${appOpenCount + 1}`)
}

export const getLastDismissTimestamp = async () => {
  const timestamp = await AsyncStorage.getItem(LAST_DISMISS_TIMESTAMP)
  return timestamp !== 'null' ? parseInt(timestamp) : null
}

export const setLastDismissTimestamp = async (timestamp) => {
  return await AsyncStorage.setItem(LAST_DISMISS_TIMESTAMP, `${timestamp}`)
}