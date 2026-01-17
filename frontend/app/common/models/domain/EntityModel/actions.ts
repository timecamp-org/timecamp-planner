import * as constants from './constants'
import { action } from 'typesafe-actions'

export const onInitActivityFeed = () => action(constants.onInitActivityFeed)

export const onInitActivityFeedSuccess = () => action(constants.onInitActivityFeedSuccess)

export const onInitActivityFeedFailure = () => action(constants.onInitActivityFeedFailure)

export const onCloseActivityFeed = () => action(constants.onCloseActivityFeed)
