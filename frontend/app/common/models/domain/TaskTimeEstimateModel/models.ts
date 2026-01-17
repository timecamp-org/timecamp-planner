import { Id } from 'common/utils/identifier';
import { Record } from 'immutable';
import { SumPeriod, TaskTimeEstimateInterface } from './types';

const defaultTaskTimeEstimate: TaskTimeEstimateInterface = {
  minutes: undefined,
  skipWeekends: true,
  sumPeriod: undefined,
  taskId: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};

export class TaskTimeEstimate extends Record(defaultTaskTimeEstimate) implements TaskTimeEstimateInterface {
  public readonly minutes!: number;
  public readonly skipWeekends!: boolean;
  public readonly sumPeriod!: SumPeriod;
  public readonly taskId!: Id;
  public readonly createdAt!: number;
  public readonly updatedAt!: number;

  public constructor(values?: Partial<TaskTimeEstimateInterface>) {
    values ? super(values) : super();
  }
}
