import { i18mark } from 'i18n';
import { TaskPriorityTypes } from 'models/domain/TasksModel/types';

export const TASK_PRIORITY_COLORS = {
  low: 'var(--color-primary-200)',
  normal: 'var(--color-primary-500)',
  high: 'var(--color-accent-500)',
  urgent: 'var(--color-critical-500)',
};

export const TASK_PRIORITY_LIST = Object.entries(TaskPriorityTypes);

export const TASK_PRIORITY_TRANSLATION_MAP = {
  [TaskPriorityTypes.urgent]: i18mark('Urgent'),
  [TaskPriorityTypes.high]: i18mark('High'),
  [TaskPriorityTypes.normal]: i18mark('Normal'),
  [TaskPriorityTypes.low]: i18mark('Low'),
};
