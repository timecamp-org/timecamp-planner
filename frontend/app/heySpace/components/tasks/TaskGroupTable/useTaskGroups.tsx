import { useSelector } from 'react-redux';

import { selectFilteredTasksByList } from 'models/domain/ListsModel/selectors';
import { selectGroupedFilteredOrderedTasksIds } from 'models/domain/TasksModel/selectors';

import { TaskListData } from '../../../../common/models/domain/TasksModel/types';

export type TaskGroupBy =
  | 'none'
  | keyof Pick<TaskListData, 'dueDate' | 'taskPriorityType' | 'assignees' | 'list' | 'taskPriorityType'>;

export type GroupedTasksType = { groupId: string; taskIds: string[] }[];

export const useTaskGroups = ({
  groupBy,
  projectId,
  filterId,
}: {
  projectId: string;
  filterId?: string;
  groupBy: TaskGroupBy;
}) => {
  const sortedTasks = useSelector((state) =>
    selectGroupedFilteredOrderedTasksIds(state, { projectId, filterId, groupByKey: groupBy })
  );

  const tasksByList = useSelector((state) => selectFilteredTasksByList(state, { projectId, filterId }));

  const groups =
    groupBy === 'list' ? tasksByList.map(({ listId, taskIds }) => ({ groupId: listId, taskIds })) : sortedTasks;

  return groups;
};
