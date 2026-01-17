import { createSelector } from 'reselect';
import { domain } from '../constants';
import { TIMECAMP_STATE_KEYS, TimecampTimerState } from '../types';

const selectTimecampDomain = (state) => state.get(domain) as TimecampTimerState;

export const selectHasIntegrationByOrganizationId = createSelector(
  selectTimecampDomain,
  (domain) => domain.hasIntegrationByOrganizationId
);

export const selectCurrentTimer = createSelector(selectTimecampDomain, (domain) => domain.currentTimer);

export const selectElapsedTimeByTaskId = createSelector(
  selectTimecampDomain,
  (domain) => domain[TIMECAMP_STATE_KEYS.ELAPSED_TIME_BY_TASK_ID]
);
