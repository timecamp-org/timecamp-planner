import { FC } from 'react';

import { AddTaskButton } from 'components/tasks/AddTaskButton';
import { GroupedTasksTable } from 'components/tasks/TaskGroupTable';
import { TaskGroupBy, useTaskGroups } from 'components/tasks/TaskGroupTable/useTaskGroups';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

import { getAddTaskProps } from './helpers';
import { useFilterId } from './hooks';

interface GroupTablesInterface {
  projectId: string;
  groupBy: TaskGroupBy;
}

export const GroupTables: FC<GroupTablesInterface> = ({ projectId, groupBy }) => {
  const filterId = useFilterId(projectId);
  const groups = useTaskGroups({ projectId, groupBy, filterId });

  return (
    <>
      {groups?.map(({ groupId, taskIds }) => (
        <GroupedTasksTable groupBy={groupBy} groupId={groupId} taskIds={taskIds} key={groupId} filterId={filterId}>
          <AddTaskButton
            projectId={projectId}
            taskCreateSource={TaskCreateSource.SPACE_TASK_LIST}
            {...getAddTaskProps(groupBy, groupId)}
          />
        </GroupedTasksTable>
      ))}
    </>
  );
};
