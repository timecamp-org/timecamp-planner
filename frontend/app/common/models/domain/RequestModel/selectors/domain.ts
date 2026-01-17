import { createSelector } from 'reselect'
import * as RequestConstants from '../constants'
import { EntityType } from '../../EntityModel/types'
import { Id } from '../../../../utils/identifier'

export const selectRequestDomain = (state) => state.get(RequestConstants.domain)

export const selectRequestStatusDomain = createSelector(
  selectRequestDomain,
  (domain) => domain.get('status'),
)

export const selectRequestDataDomain = createSelector(
  selectRequestDomain,
  (domain) => domain.get('data'),
)

export const selectRequestErrorDomain = createSelector(
  selectRequestDomain,
  (domain) => domain.get('error'),
)

export const selectRequestCountDomain = createSelector(
  selectRequestDomain,
  (domain) => domain.get('count'),
)

export const selectRequestDirtyDomain = createSelector(
  selectRequestDomain,
  (domain) => domain.get('dirty'),
)

export const selectRequestTimestampDomain = createSelector(
  selectRequestDomain,
  (domain) => domain.get('timestamp'),
)

export const selectContainerAccessLossTimestampDomain = createSelector(
  selectRequestDomain,
  (domain) => domain.get('containerAccessLossTimestamp') as Map<EntityType, Map<Id, number>>,
)
