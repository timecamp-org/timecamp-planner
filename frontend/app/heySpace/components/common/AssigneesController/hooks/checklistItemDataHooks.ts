import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import {
  onAddChecklistItemAssignee,
  onRemoveChecklistItemAssignee,
} from 'models/domain/ChecklistsModel/actions';
import {
  selectAlphabeticallySortedAvailableChecklistItemAssigneeIds,
  selectAlphabeticallySortedChecklistItemAssigneeIds,
  selectChecklistItemColor,
  selectProjectIdByChecklistItemId,
} from 'models/domain/ChecklistsModel/selectors';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';
import { selectProjectIsPrivate } from 'models/domain/ProjectsModel/selectors';
import { selectProjectPeople } from 'models/domain/ProjectsModel/selectors/domain';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import {
  DataPersisterHookInterface,
  DataProviderHookInterface,
} from './dataHooks';

export function useDataProvider(objectId: Id): DataProviderHookInterface {
  const projectId = useSelector((state) =>
    selectProjectIdByChecklistItemId(state, { checklistItemId: objectId })
  );

  return {
    projectId,
    color: useSelector((state) =>
      selectChecklistItemColor(state, { checklistItemId: objectId })
    ),
    assigneeIds: useSelector((state) =>
      selectAlphabeticallySortedChecklistItemAssigneeIds(state, {
        checklistItemId: objectId,
      })
    ),
    isProjectPrivate: useSelector((state) =>
      selectProjectIsPrivate(state, { projectId })
    ),
    projectPeopleIds: useSelector((state) =>
      selectProjectPeople(state, { projectId })
    ),
    currentUserId: useSelector((state) => selectCurrentUserId(state)),
    notAssignedUserIds: useSelector((state) =>
      selectAlphabeticallySortedAvailableChecklistItemAssigneeIds(state, {
        projectId,
        checklistItemId: objectId,
      })
    ),
    isCurrentUserOrganizationGuest: useSelector((state) =>
      selectIsCurrentUserOrganizationGuest(state)
    ),
  };
}

export function useDataPersister(objectId: Id): DataPersisterHookInterface {
  const dispatch = useDispatch();

  return {
    onAddAssignee: useCallback(
      (userId) => dispatch(onAddChecklistItemAssignee(objectId, userId)),
      [dispatch, objectId]
    ),
    onRemoveAssignee: useCallback(
      (userId) => dispatch(onRemoveChecklistItemAssignee(objectId, userId)),
      [dispatch, objectId]
    ),
  };
}
