import { get, isNumber } from 'lodash';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { createSelector } from 'reselect';
import { selectCurrentTimer, selectElapsedTimeByTaskId, selectHasIntegrationByOrganizationId } from './domain';

export const selectHasTimecampIntegration = createSelector(
  selectHasIntegrationByOrganizationId,
  selectCurrentOrganizationId,
  (hasIntegrationByOrganizationId, organizationId) => get(hasIntegrationByOrganizationId, organizationId, false)
);

export const selectTaskTimer = createSelector(
  selectCurrentTimer,
  (_, args) => args.taskId,
  (timer, taskId) => (timer?.taskId === taskId ? timer : null)
);

export const selectIsTimerRunning = createSelector(selectCurrentTimer, (timer) => timer?.isRunning ?? false);

export const selectElapsedTaskTime = createSelector(
  selectElapsedTimeByTaskId,
  (_, args) => args.taskId,
  (elapsedTimeByTask, taskId) => get(elapsedTimeByTask, taskId)
);

export const selectHasTaskTimeEntry = createSelector(selectElapsedTaskTime, (elapsed) => isNumber(elapsed));

export const selectTotalTaskTime = createSelector(
  selectElapsedTimeByTaskId,
  (_, args) => args.taskId,
  (timeByTaskId, taskId) => get(timeByTaskId, taskId, 0)
);
