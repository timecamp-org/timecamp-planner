import { Id } from 'common/utils/identifier';
import { action } from 'typesafe-actions';
import * as C from './constants';
import {
  DurationEntryInterface,
  ElapsedTimeByTask,
  TaskTimerInterface,
  TimeEntryAction,
  TimeEntryInterface,
} from './types';

export const onFetchHasTimecampIntegration = () => action(C.onFetchHasTimecampIntegration);

export const onFetchHasTimecampIntegrationSuccess = (props: { [organizationId: string]: boolean }) => {
  return action(C.onFetchHasTimecampIntegrationSuccess, props);
};

export const onSaveToken = (token: string) => action(C.onSaveToken, { token });
export const onSaveTokenSuccess = (props: { [organizationId: string]: boolean }) => {
  return action(C.onFetchHasTimecampIntegrationSuccess, props);
};

export const onSetTimer = (props: { taskId: Id; timeEntryAction: TimeEntryAction }) => action(C.onSetTimer, props);
export const onSetTimerSuccess = (taskTimer: TaskTimerInterface) => action(C.onSetTimerSuccess, taskTimer);

export const onAddTimeEntry = (entry: TimeEntryInterface | DurationEntryInterface) => action(C.onAddTimeEntry, entry);

export const onAddTimeEntrySuccess = (taskElapsedTime: ElapsedTimeByTask) =>
  action(C.onAddTimeEntrySuccess, taskElapsedTime);

export const onCheckTimerStatus = (props: { taskId: Id }) => action(C.onCheckTimerStatus, props);
export const onCheckTimerStatusSuccess = (timer: TaskTimerInterface) => action(C.onCheckTimerStatusSuccess, timer);

export const onFetchTaskTimeEntry = (taskId: string) => action(C.onFetchTaskTimeEntries, taskId);
export const onFetchTaskTimeEntrySuccess = (timer: ElapsedTimeByTask) => action(C.onFetchTaskTimeEntriesSuccess, timer);
export const onAddTaskTime = (timer: ElapsedTimeByTask) => action(C.onAddTaskTime, timer);
