import { Record } from 'immutable';
import { TaskStatus, TaskInterface, TaskPriorityTypes } from './types';
import { Id } from '../../../utils/identifier';

const defaultTask: TaskInterface = {
  id: undefined,
  status: TaskStatus.ACTIVE,
  name: '',
  description: '',
  creatorId: undefined,
  dueDate: undefined,
  startDate: undefined,
  isArchived: false,
  order: 0,
  progress: 0,
  projectId: undefined,
  sourceMessageId: undefined,
  taskListId: undefined,
  taskPriorityType: undefined,
};

export class Task extends Record(defaultTask) implements TaskInterface {
  public readonly id!: Id;
  public readonly status!: TaskStatus;
  public readonly name!: string;
  public readonly creatorId!: Id;
  public readonly dueDate!: number;
  public readonly startDate!: number;
  public readonly isArchived!: boolean;
  public readonly order!: number;
  public readonly progress!: number;
  public readonly projectId!: Id;
  public readonly sourceMessageId!: Id;
  public readonly taskListId!: Id;
  public readonly taskPriorityType!: TaskPriorityTypes;

  public constructor(values?: Partial<TaskInterface>) {
    values ? super(values) : super();
  }
}
