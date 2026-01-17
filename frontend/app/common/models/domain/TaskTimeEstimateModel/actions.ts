import { Id } from 'common/utils/identifier';
import { action } from 'typesafe-actions';
import * as C from './constants/index';
import { TaskTimeEstimateInterface } from './types';

export const onFetchTaskTimeEstimate = (taskId: Id) => action(C.onFetchTaskTimeEstimate, { taskId });

export const onFetchTaskTimeEstimateSuccess = (result: TaskTimeEstimateInterface) =>
  action(C.onFetchTaskTimeEstimateSuccess, result);

export const onCreateTaskTimeEstimate = (estimate: TaskTimeEstimateInterface) =>
  action(C.onCreateTaskTimeEstimate, { estimate });

export const onCreateTaskTimeEstimateSuccess = (result: TaskTimeEstimateInterface) =>
  action(C.onCreateTaskTimeEstimateSuccess, result);

export const onUpdateTaskTimeEstimate = (estimate: TaskTimeEstimateInterface) =>
  action(C.onUpdateTaskTimeEstimate, { estimate });

export const onUpdateTaskTimeEstimateSuccess = (result: TaskTimeEstimateInterface) =>
  action(C.onUpdateTaskTimeEstimateSuccess, result);

export const onDeleteTaskTimeEstimate = (taskId: Id) => action(C.onDeleteTaskTimeEstimate, { taskId });

export const onDeleteTaskTimeEstimateSuccess = (taskId: Id) => action(C.onDeleteTaskTimeEstimateSuccess, { taskId });
