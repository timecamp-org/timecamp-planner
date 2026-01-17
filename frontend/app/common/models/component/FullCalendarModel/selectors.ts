import { domain, DEFAULT_OFFSET } from './constants'
import createCachedSelector from 're-reselect'
import { createSelector } from 'reselect';
import { FullCalendarState } from './types';
import generateSelectorName from '../../../utils/generateSelectorName';

export const selectDomain = (state) => state.get(domain) as FullCalendarState

export const selectDateRangesDomain = createSelector(
  selectDomain,
  domain => domain.get('dateRanges')
)

export const selectCurrentViews = createSelector(
  selectDomain,
  domain => domain.get('currentViews')
)

export const selectCurrentDates = createSelector(
  selectDomain,
  domain => domain.get('currentDates')
)

export const selectOffsets = createSelector(
  selectDomain,
  domain => domain.get('offsets')
)

// objectId
export const selectDateRange = createCachedSelector(
  selectDateRangesDomain,
  (_, args) => args.objectId,
  (dateRanges, objectId) => dateRanges.get(objectId),
)
(
  (_, args) => generateSelectorName(args, ['objectId']),
)

// objectId
export const selectCurrentView = createCachedSelector(
  selectCurrentViews,
  (_, args) => args.objectId,
  (currentViews, objectId) => currentViews.get(objectId),
)
(
  (_, args) => generateSelectorName(args, ['objectId']),
)


// objectId
export const selectCurrentDate = createCachedSelector(
  selectCurrentDates,
  (_, args) => args.objectId,
  (currentDates, objectId) => currentDates.get(objectId),
)
(
  (_, args) => generateSelectorName(args, ['objectId']),
)


// objectId
export const selectCurrentOffset = createCachedSelector(
  selectOffsets,
  (_, args) => args.objectId,
  (offsets, objectId) => offsets.get(objectId) || DEFAULT_OFFSET,
)
(
  (_, args) => generateSelectorName(args, ['objectId']),
)


