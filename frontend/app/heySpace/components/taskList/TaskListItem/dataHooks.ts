import { useCallback } from 'react';

import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { selectTaskChecklistItemsCount } from 'models/domain/ChecklistsModel/selectors/domain';
import { selectCustomFieldValue, selectIsExtensionEnabled } from 'models/domain/ExtensionsModel/selectors/domain';
import { ExtensionNamespace, FieldType, TargetType } from 'models/domain/ExtensionsModel/types';
import { selectUnreadNotificationsCount } from 'models/domain/NotificationsModel/selectors';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';
import { selectTagListCount } from 'models/domain/TagsModel/selectors';
import {
  selectIsCurrentUserTaskOrListOrSpaceFollower,
  selectProjectIdByTaskId,
  selectTaskColor,
  selectTaskDueDate,
  selectTaskProgressEstimate,
} from 'models/domain/TasksModel/selectors';
import { selectTaskAssigneeIds } from 'models/domain/TasksModel/selectors/domain';
import { selectTaskTimeEstimate } from 'models/domain/TaskTimeEstimateModel/selectors';

export type DataProviderHook = {
  notificationsCount: number;
  taskColor: string;
  taskAssignees: List<Id>;
  isEstimatesExtensionEnabled: boolean;
  hasAccessToEstimates: boolean;
  isUserFollowingTask: boolean;
  isTaskVotingExtensionEnabled: boolean;
  taskEstimatedEffort: number;
  taskEstimatedHours: number;
  tagCount: number;
  taskDueDate: number;
  taskProgress: number;
  taskChecklistItemCount: number;
};

export function useDataProvider(taskId: Id): DataProviderHook {
  const projectId = useSelector((state) => selectProjectIdByTaskId(state, { taskId }));
  const organizationId = useSelector((state) => selectCurrentOrganizationId(state));
  const taskChecklistItemCount = useSelector((state) => selectTaskChecklistItemsCount(state, { taskId }));

  return {
    taskColor: useSelector((state) => selectTaskColor(state, { taskId })),
    taskProgress: useSelector((state) => selectTaskProgressEstimate(state, { taskId })),
    taskAssignees: useSelector((state) => selectTaskAssigneeIds(state, { taskId })),
    taskEstimatedEffort: useSelector((state) =>
      selectCustomFieldValue(state, {
        extensionNamespace: ExtensionNamespace.AGILE,
        fieldType: FieldType.ESTIMATED_EFFORT,
        targetId: taskId,
        targetType: TargetType.TASK,
      })
    ),
    taskEstimatedHours: useSelector((state) => selectTaskTimeEstimate(state, { taskId }))?.minutes,
    isUserFollowingTask: useSelector((state) => selectIsCurrentUserTaskOrListOrSpaceFollower(state, { taskId })),
    isTaskVotingExtensionEnabled: useSelector((state) =>
      selectIsExtensionEnabled(state, { organizationId, projectId, extensionNamespace: ExtensionNamespace.TASK_VOTING })
    ),
    isEstimatesExtensionEnabled: useSelector((state) =>
      selectIsExtensionEnabled(state, { organizationId, projectId, extensionNamespace: ExtensionNamespace.AGILE })
    ),
    taskDueDate: useSelector((state) => selectTaskDueDate(state, { taskId })),
    hasAccessToEstimates: useSelector((state) =>
      selectHasAccessToExtension(state, { extensionNamespace: ExtensionNamespace.AGILE })
    ),
    tagCount: useSelector((state) => selectTagListCount(state, { objectId: taskId })),
    notificationsCount: useSelector((state) => selectUnreadNotificationsCount(state, { objectId: taskId })),
    taskChecklistItemCount,
  };
}

export type DataPersisterHook = {
  onOpenCardDetailsModal: VoidFunction;
};

export function useDataPersister(taskId: Id): DataPersisterHook {
  const dispatch = useDispatch();

  return {
    onOpenCardDetailsModal: useCallback(
      () => dispatch(AppModelActions.onSetOpenedCardDetailsModalId(taskId)),
      [dispatch, taskId]
    ),
  };
}
