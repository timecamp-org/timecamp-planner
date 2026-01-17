import { Dispatch, SetStateAction, useState } from 'react';

import { List } from 'immutable';
import { difference } from 'lodash';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { selectIsCurrentUserOrganizationGuest } from 'models/domain/OrganizationsModel/selectors';
import { selectOrganizationsPeople } from 'models/domain/OrganizationsModel/selectors/domain';
import {
  selectAlphabeticallySortedProjectAvailableAssignees,
  selectProjectColor,
  selectProjectIsPrivate,
} from 'models/domain/ProjectsModel/selectors';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';

import { DataPersisterHookInterface, DataProviderHookInterface } from './dataHooks';

export const useProjectNewTaskData = ({
  initialAssignees,
  projectId,
}: {
  projectId: Id;
  initialAssignees?: List<Id>;
}) => {
  const [assignees, setAssignees] = useState(initialAssignees || List<Id>());

  return {
    dataProvider: useDataProvider(projectId, assignees),
    dataPersister: useDataPersister(setAssignees),
  };
};

export function useDataProvider(projectId: Id, assignees: List<Id>): DataProviderHookInterface {
  return {
    projectId,
    color: useSelector((state) => selectProjectColor(state, { checklistItemId: projectId })),
    assigneeIds: assignees,
    isProjectPrivate: useSelector((state) => selectProjectIsPrivate(state, { projectId })),
    projectPeopleIds: List(Object.values(useSelector(selectOrganizationsPeople).toJS()).values()),
    currentUserId: useSelector((state) => selectCurrentUserId(state)),
    notAssignedUserIds: List(
      difference(
        useSelector((state) =>
          selectAlphabeticallySortedProjectAvailableAssignees(state, {
            projectId,
          })
        )
          .toIndexedSeq()
          .toArray(),
        assignees.toArray() as string[]
      )
    ) as List<string>,
    isCurrentUserOrganizationGuest: useSelector((state) => selectIsCurrentUserOrganizationGuest(state)),
  };
}

export function useDataPersister(updateAssignees: Dispatch<SetStateAction<List<string>>>): DataPersisterHookInterface {
  const onAddAssignee = (userId: string) => updateAssignees((assignees) => List([...assignees.toArray(), userId]));

  const onRemoveAssignee = (userId: string) =>
    updateAssignees((assignees) => assignees.filter((id) => id !== userId) as List<string>);

  return {
    onAddAssignee,
    onRemoveAssignee,
  };
}
