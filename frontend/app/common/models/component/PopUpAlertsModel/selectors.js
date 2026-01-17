import { createSelector } from 'reselect'
import { domain as PopUpAlertsDomain } from './constants'
import createCachedSelector from 're-reselect'
import generateSelectorName from '../../../utils/generateSelectorName'

export const popUpAlertsDomain = (state) => state.get(PopUpAlertsDomain)

export const selectAlertIds = createSelector(
  popUpAlertsDomain,
  (domain) => domain.keySeq().toList(),
)

// alertId
export const selectAlert = createCachedSelector(
  popUpAlertsDomain,
  (_, args) => args.alertId,
  (domain, alertId) => domain.get(alertId),
)
(
  (_, args) => generateSelectorName(args, ['alertId']),
)
