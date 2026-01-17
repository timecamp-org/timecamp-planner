import { TaskPriorityTypes } from 'models/domain/TasksModel/types';
import { SortOrder } from '../../models/component/FiltersModel/types';

export function compareString(valueA: string, valueB: string, sortOrder: SortOrder): number {
  valueA = (valueA || '').toUpperCase();
  valueB = (valueB || '').toUpperCase();
  if (sortOrder === SortOrder.ASC) {
    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  } else {
    return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
  }
}

export function compareNumbers(valueA: number, valueB: number, sortOrder: SortOrder): number {
  if (sortOrder === SortOrder.ASC) {
    return valueA - valueB;
  } else {
    return valueB - valueA;
  }
}

const TASK_PRIORITY_RATE = {
  [TaskPriorityTypes.urgent]: 0,
  [TaskPriorityTypes.high]: 1,
  [TaskPriorityTypes.normal]: 2,
  [TaskPriorityTypes.low]: 3,
};

export function comparePriorities(
  priorityA: TaskPriorityTypes | undefined,
  priorityB: TaskPriorityTypes | undefined,
  sortOrder: SortOrder
) {
  const rateA = TASK_PRIORITY_RATE?.[priorityA] ?? 99;
  const rateB = TASK_PRIORITY_RATE?.[priorityB] ?? 99;
  return sortOrder === SortOrder.ASC ? rateA - rateB : rateB - rateA;
}
