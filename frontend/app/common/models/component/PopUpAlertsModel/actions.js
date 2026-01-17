import * as PopUpAlertsModelConstants from './constants'

export const onRemoveAlert = (id) => ({
  type: PopUpAlertsModelConstants.onRemoveAlert,
  id,
})

export const onAddAlert = (actionResult, id, isSelfDisposable = true, actions) => ({
  type: PopUpAlertsModelConstants.onAddAlert,
  actionResult,
  id,
  isSelfDisposable,
  actions,
})
