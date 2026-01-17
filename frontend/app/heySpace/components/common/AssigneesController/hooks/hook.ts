import { MouseEvent, MouseEventHandler, useCallback, useState } from 'react';

import { List } from 'immutable';

import useElementOpen from 'common/hooks/useElementOpen';
import { Id } from 'common/utils/identifier';

import { AssigneesControllerInterface } from '../AssignieControllerView';

import { DataPersisterHookInterface, DataProviderHookInterface } from './dataHooks';

const emptyList = List<Id>();

export interface AssigneesControllerHookInterface {
  isCurrentUserAssigned: boolean;
  isAddUserToProjectModalOpen: boolean;
  isAssigneesPickerOpen: boolean;
  assigneeIds: List<Id>;
  notAssignedUserIds: List<Id>;
  userIds: List<Id>;
  color: string;
  projectId: Id;

  onQuickAssignButtonClick: VoidFunction;
  onControllerClick: MouseEventHandler;
  onOpenAddUserToProjectModal: (userId: Id) => void;
  onAddAssignee: (userId: Id) => void;
  onRemoveAssignee: (userId: Id) => void;
  onCloseAddUserToProjectModal: VoidFunction;
  onAddUsersToProject: VoidFunction;
  onCloseAssigneesPicker: VoidFunction;
}

interface AssigneesControllerHookPropsInterface extends Omit<AssigneesControllerInterface, 'hook'> {
  dataProvider: DataProviderHookInterface;
  dataPersister: DataPersisterHookInterface;
  isAssigneesPickerOpen: boolean;
  onSetIsPickerOpen: (isPickerOpen: boolean) => void;
}

export function useComponent({
  shouldClosePopoveronSelfUnassign,
  onSetIsPopoverOpen,
  dataPersister,
  dataProvider,
  isAssigneesPickerOpen,
  onSetIsPickerOpen,
}: AssigneesControllerHookPropsInterface): AssigneesControllerHookInterface {
  const { assigneeIds, currentUserId, isProjectPrivate, projectPeopleIds, color, notAssignedUserIds, projectId } =
    dataProvider;

  const onOpenAssigneesPicker = () => onSetIsPickerOpen(true);
  const onCloseAssigneesPicker = () => onSetIsPickerOpen(false);
  const onToggleAssigneesPickerOpen = () => onSetIsPickerOpen(!isAssigneesPickerOpen);

  const { isOpen: isAddUserToProjectModalOpen, onSetIsOpen: onSetIsAddUserToProjectModalOpen } = useElementOpen();

  const [userIds, onSetUserIds] = useState(emptyList);

  const isCurrentUserAssigned = assigneeIds.includes(currentUserId);

  const onControllerClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      onToggleAssigneesPickerOpen();
    },
    [isAssigneesPickerOpen, onSetIsPopoverOpen, onToggleAssigneesPickerOpen]
  );

  const onAssignYourself = useCallback(() => {
    dataPersister.onAddAssignee(currentUserId);
  }, [currentUserId]);

  const onUnassignYourself = useCallback(() => {
    dataPersister.onRemoveAssignee(currentUserId);
  }, [currentUserId]);

  const onQuickAssignButtonClick = useCallback(() => {
    if (isCurrentUserAssigned) {
      onUnassignYourself();
    } else {
      onAssignYourself();
    }
  }, [isCurrentUserAssigned, onAssignYourself, onUnassignYourself]);

  const onOpenAddUserToProjectModal = useCallback(
    (userId) => {
      onSetIsAddUserToProjectModalOpen(true);
      onSetUserIds(emptyList.push(userId));
    },
    [onSetIsAddUserToProjectModalOpen]
  );

  const onCloseAddUserToProjectModal = useCallback(() => {
    onSetIsAddUserToProjectModalOpen(false);
    onSetUserIds(emptyList);
  }, [onSetIsAddUserToProjectModalOpen]);

  const onAddUsersToProject = useCallback(() => {
    const userId = userIds.first();
    dataPersister.onAddAssignee(userId);
    onCloseAddUserToProjectModal();
    onOpenAssigneesPicker();
    onSetIsPopoverOpen(true);
  }, [userIds, onCloseAddUserToProjectModal, onOpenAssigneesPicker, onSetIsPopoverOpen]);

  const onAddAssignee = useCallback(
    (userId) => {
      const isUserInProject = projectPeopleIds.includes(userId);
      if (isProjectPrivate && !isUserInProject) {
        onCloseAssigneesPicker();
        onSetIsPopoverOpen(false);
        onOpenAddUserToProjectModal(userId);
      } else {
        dataPersister.onAddAssignee(userId);
      }
    },
    [isProjectPrivate, projectPeopleIds, onCloseAssigneesPicker, onOpenAddUserToProjectModal, onSetIsPopoverOpen]
  );

  const onRemoveAssignee = useCallback(
    (userId) => {
      dataPersister.onRemoveAssignee(userId);
      if (shouldClosePopoveronSelfUnassign && userId === currentUserId) {
        onCloseAssigneesPicker();
        onSetIsPopoverOpen(false);
      }
    },
    [shouldClosePopoveronSelfUnassign, currentUserId, onCloseAssigneesPicker, onSetIsPopoverOpen]
  );

  return {
    isAddUserToProjectModalOpen,
    isAssigneesPickerOpen,
    isCurrentUserAssigned,
    assigneeIds,
    notAssignedUserIds,
    userIds,
    color,
    projectId,

    onQuickAssignButtonClick,
    onControllerClick,
    onOpenAddUserToProjectModal,
    onCloseAddUserToProjectModal,
    onAddUsersToProject,
    onAddAssignee,
    onRemoveAssignee,
    onCloseAssigneesPicker,
  };
}
