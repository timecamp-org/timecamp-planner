import { Id } from 'common/utils/identifier';
import { action } from 'typesafe-actions';
import * as C from './constants/index';
import { TaskScheduleInterface } from './types';

export const onFetchScheduleData = (organizationId: Id) => action(C.onFetchScheduleData, { organizationId });

export const onFetchScheduleDataSuccess = (result: TaskScheduleInterface[]) =>
  action(C.onFetchScheduleDataSuccess, result);
