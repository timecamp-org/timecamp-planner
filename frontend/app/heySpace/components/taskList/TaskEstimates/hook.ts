/* eslint-disable no-shadow */
import { useEffect, useState } from 'react';

import { isEmpty, isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { UserTracker } from 'common/services';
import { Id } from 'common/utils/identifier';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import {
  onCreateTaskTimeEstimate,
  onDeleteTaskTimeEstimate,
  onUpdateTaskTimeEstimate,
} from 'models/domain/TaskTimeEstimateModel/actions';
import { selectTaskTimeEstimate } from 'models/domain/TaskTimeEstimateModel/selectors';
import { SumPeriod, TaskTimeEstimateInterface } from 'models/domain/TaskTimeEstimateModel/types';

const getDefaultEstimate = (taskId: Id, estimate?: TaskTimeEstimateInterface): TaskTimeEstimateInterface =>
  isEmpty(estimate) ? { skipWeekends: true, sumPeriod: SumPeriod.DAILY, taskId } : estimate;

export const useTaskTimeEstimate = (taskId: Id) => {
  const dispatch = useDispatch();
  const initialEstimate = useSelector((state) => selectTaskTimeEstimate(state, { taskId }));

  const [estimate, setEstimate] = useState<TaskTimeEstimateInterface>(getDefaultEstimate(taskId, initialEstimate));

  useEffect(() => {
    setEstimate(getDefaultEstimate(taskId, initialEstimate));
  }, [initialEstimate, taskId]);

  const onChange = (partial: Partial<TaskTimeEstimateInterface>) => {
    setEstimate((estimate) => ({ ...estimate, ...partial }));
  };

  const onSave = (estimate: TaskTimeEstimateInterface) => {
    onChange(estimate);
    UserTracker.track(UserTrackerEvent.featureUsed, {
      name: 'Time Task Estimate Save',
      value: estimate.minutes,
    });

    if (isEqual(initialEstimate, estimate)) {
      return;
    }

    dispatch(isEmpty(initialEstimate) ? onCreateTaskTimeEstimate(estimate) : onUpdateTaskTimeEstimate(estimate));
  };

  const onResetState = () => onChange(getDefaultEstimate(taskId, initialEstimate));

  const onClear = () => {
    const estimate: TaskTimeEstimateInterface = {
      ...getDefaultEstimate(taskId),
      minutes: null,
    };
    setEstimate(estimate);
    dispatch(onDeleteTaskTimeEstimate(taskId));
  };

  return {
    estimate,
    initialEstimate,
    onChange,
    onSave,
    onResetState,
    onClear,
  };
};
