import createImmutableEqualSelector from 'common/utils/createImmutableEqualSelector';
import generateSelectorName from 'common/utils/generateSelectorName';
import { Id } from 'common/utils/identifier';
import { Map } from 'immutable';
import createCachedSelector from 're-reselect';
import { domain } from '../constants';
import { TaskTimeEstimate } from '../models';
import { TASK_ESTIMATES_STATE_KEYS, TaskTimeEstimateState } from '../types';

const selectTaskTimeEstimatesDomain = (state) => state.get(domain) as TaskTimeEstimateState;

export const selectTimeEstimatesByTasks = createImmutableEqualSelector(
  selectTaskTimeEstimatesDomain,
  (domain) => domain.get(TASK_ESTIMATES_STATE_KEYS.ESTIMATES_BY_TASK_ID) as Map<Id, TaskTimeEstimate>
);

// args taskId
export const selectTaskTimeEstimate = createCachedSelector(
  selectTimeEstimatesByTasks,
  (_, args) => args.taskId,
  (estimates, taskId): TaskTimeEstimate | undefined => estimates.get(taskId)?.toJS()
)((_, args) => generateSelectorName(args, ['taskId']));

export const selectHasTaskTimeEstimate = createCachedSelector(
  selectTimeEstimatesByTasks,
  (_, args) => args.taskId,
  (estimates, taskId): boolean => !!estimates.get(taskId)
)((_, args) => generateSelectorName(args, ['taskId']));
