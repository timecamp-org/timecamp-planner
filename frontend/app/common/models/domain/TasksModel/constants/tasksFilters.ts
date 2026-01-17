import { i18mark } from '../../../../i18n';
import { DueDateFilterKey, TaskStatusFilterType } from '../types';

export interface TaskStatusFilterInterface {
  key: TaskStatusFilterType;
  label: string;
}

export interface TaskDueDateFilterInterface {
  key: DueDateFilterKey;
  label: string;
}

export const taskStatusOptions: TaskStatusFilterInterface[] = [
  { key: TaskStatusFilterType.ALL, label: i18mark('All tasks') },
  { key: TaskStatusFilterType.ACTIVE, label: i18mark('Incompleted') },
  { key: TaskStatusFilterType.COMPLETED, label: i18mark('Completed') },
  { key: TaskStatusFilterType.ARCHIVED, label: i18mark('Archived tasks') },
];

export const scheduleTaskStatusOptions = taskStatusOptions.filter(
  (option) => option.key !== TaskStatusFilterType.ARCHIVED
);

export const taskDueDateOptions: TaskDueDateFilterInterface[] = [
  { key: 'today', label: i18mark('Due date today') },
  { key: 'tomorrow', label: i18mark('Due date in next day') },
  { key: 'this-week', label: i18mark('Due date in this week') },
  { key: 'next-week', label: i18mark('Due date in next week') },
  { key: 'this-month', label: i18mark('Due date in this month') },
  { key: 'next-month', label: i18mark('Due date in next month') },
  { key: 'overdue', label: i18mark('Overdue') },
  { key: 'none', label: i18mark('No due date') },
];
