/* eslint-disable no-case-declarations */
import { TaskGroupBy } from 'models/domain/TasksModel/types';

export function getAddTaskProps(groupBy: TaskGroupBy, groupId?: string) {
  if (!groupId) {
    return {};
  }

  switch (groupBy) {
    case 'none':
      return {};
    case 'assignees':
      return { assignees: [groupId] };
    case 'dueDate':
      const timestamp = Number(groupId);

      return Number.isFinite(timestamp) ? { dueDate: timestamp } : {};
    default:
      return { [groupBy]: groupId };
  }
}
