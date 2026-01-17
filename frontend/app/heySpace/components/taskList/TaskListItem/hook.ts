import { MouseEventHandler, useCallback } from 'react';

import { List } from 'immutable';
import { useSelector } from 'react-redux';

import useElementOpen from 'common/hooks/useElementOpen';
import { AppEventEmitter } from 'common/services';
import { AppEventType } from 'common/types';
import { Id } from 'common/utils/identifier';
import useOnHover from 'hooks/useOnHover';
import { selectTaskPriorityType } from 'models/domain/TasksModel/selectors';

import { useDataPersister, useDataProvider } from './dataHooks';

export type TaskListItemHookInterface = {
  notificationsCount: number;
  taskColor: string;
  isHovering: boolean;
  isHoveringEfforts: boolean;
  isAssigneePickerOpen: boolean;
  isMorePopoverOpen: boolean;
  isTaskProgressPopoverOpen: boolean;
  shouldRenderExtensions: boolean;
  isEstimatesExtensionEnabled: boolean;
  hasAccessToEstimates: boolean;
  isTaskVotingExtensionEnabled: boolean;
  taskEstimatedEffort: number;
  taskEstimatedHours: number;
  tagCount: number;
  taskDueDate: number;
  taskProgress: number;
  taskAssignees: List<Id>;
  taskChecklistItemCount: number;
  hasEstimatedEffort: boolean;
  hasAssignees: boolean;
  hasTags: boolean;
  hasChecklistProgress: boolean;
  hasEstimatePoints: boolean;
  hasEstimateHours: boolean;
  hasEstimate: boolean;
  hasDetails: boolean;
  hasPriority: boolean;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave: MouseEventHandler<HTMLDivElement>;
  onEstimatedEffortsEnter: MouseEventHandler<HTMLDivElement>;
  onEstimatedEffortsLeave: MouseEventHandler<HTMLDivElement>;
  onSetIsMorePopoverOpen: (isOpen: boolean) => void;
  onSetIsTaskProgressPopoverOpen: (isOpen: boolean) => void;
  onSetIsAssigneePickerOpen: (isOpen: boolean) => void;
  onClick: VoidFunction;
  onResize: VoidFunction;
};

export default function useComponent(taskId: Id): TaskListItemHookInterface {
  const dataProvider = useDataProvider(taskId);
  const dataPersister = useDataPersister(taskId);
  const { isHovering, onMouseEnter, onMouseLeave } = useOnHover();
  const {
    isHovering: isHoveringEfforts,
    onMouseEnter: onEstimatedEffortsEnter,
    onMouseLeave: onEstimatedEffortsLeave,
  } = useOnHover();
  const { isOpen: isMorePopoverOpen, onSetIsOpen: onSetIsMorePopoverOpen } = useElementOpen();
  const { isOpen: isTaskProgressPopoverOpen, onSetIsOpen: onSetIsTaskProgressPopoverOpen } = useElementOpen();
  const { isOpen: isAssigneePickerOpen, onSetIsOpen: onSetIsAssigneePickerOpen } = useElementOpen();

  const { taskAssignees, isTaskVotingExtensionEnabled, taskChecklistItemCount } = dataProvider;

  const shouldRenderExtensions = Boolean(isTaskVotingExtensionEnabled);

  const onResize = useCallback(() => {
    AppEventEmitter.emit(AppEventType.CARD_RESIZED, { taskId });
  }, [taskId]);

  const hasEstimatedEffort = dataProvider.taskEstimatedEffort > 0;
  const hasAssignees = !taskAssignees.isEmpty();
  const hasTags = !!dataProvider.tagCount;
  const hasChecklistProgress = taskChecklistItemCount > 0;
  const hasEstimatePoints = !!dataProvider.taskEstimatedEffort;
  const hasEstimateHours = !!dataProvider.taskEstimatedHours;
  const hasEstimate = hasEstimatePoints || hasEstimateHours;
  const hasDetails = !!(hasEstimatedEffort || hasAssignees || hasTags || hasChecklistProgress || hasEstimate);
  const hasPriority = !!useSelector((state) => selectTaskPriorityType(state, { taskId }));

  return {
    notificationsCount: dataProvider.notificationsCount,
    taskColor: dataProvider.taskColor,
    isHovering,
    isHoveringEfforts,
    isAssigneePickerOpen,
    isMorePopoverOpen,
    isTaskProgressPopoverOpen,
    shouldRenderExtensions,
    isEstimatesExtensionEnabled: dataProvider.isEstimatesExtensionEnabled,
    hasAccessToEstimates: dataProvider.hasAccessToEstimates,
    isTaskVotingExtensionEnabled: dataProvider.isTaskVotingExtensionEnabled,
    tagCount: dataProvider.tagCount,
    taskDueDate: dataProvider.taskDueDate,
    taskEstimatedEffort: dataProvider.taskEstimatedEffort,
    taskEstimatedHours: dataProvider.taskEstimatedHours,
    taskProgress: dataProvider.taskProgress,
    taskAssignees,
    taskChecklistItemCount,
    hasEstimatedEffort,
    hasAssignees,
    hasTags,
    hasChecklistProgress,
    hasEstimate,
    hasDetails,
    hasPriority,
    hasEstimateHours,
    hasEstimatePoints,

    onMouseEnter,
    onMouseLeave,
    onEstimatedEffortsEnter,
    onEstimatedEffortsLeave,
    onSetIsAssigneePickerOpen,
    onSetIsMorePopoverOpen,
    onSetIsTaskProgressPopoverOpen,
    onClick: dataPersister.onOpenCardDetailsModal,
    onResize,
  };
}
