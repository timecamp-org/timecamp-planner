import { createSelector } from 'reselect';
import { domain } from '../constants/index';
import { ScheduleState } from '../types';

const selectScheduleDomain = (state) => state.get(domain) as ScheduleState;

export const selectScheduleData = createSelector(selectScheduleDomain, (domain) => domain.scheduleData);
