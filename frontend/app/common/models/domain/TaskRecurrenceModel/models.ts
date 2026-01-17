import { Record } from 'immutable'
import { Id } from '../../../utils/identifier';
import { TaskRecurrenceSettingsInterface } from './types';
import { PeriodType, Position } from '../../../types';

const defaultRecurrenceSettings: TaskRecurrenceSettingsInterface = {
  id: undefined,
  taskId: undefined,

  targetTaskListId: undefined,
  periodType: undefined,
  interval: undefined,

  dayOfMonth: undefined,
  month: undefined,
  weekDays: undefined,
  
  nextRecurrenceAt: undefined,
  position: undefined,

  updateDueDate: undefined,
  dueDateOffset: undefined,
  dueDateOffsetPeriod: undefined,
}

export class TaskRecurrenceSettings extends Record(defaultRecurrenceSettings) implements TaskRecurrenceSettingsInterface {
  public readonly id!: Id
  
  public readonly taskId!: Id
  public readonly targetTaskListId!: Id
  public readonly periodType!: PeriodType
  public readonly interval!: number
  public readonly nextRecurrenceAt!: Date
  public readonly position!: Position
  public readonly updateDueDate!: boolean
  public readonly dueDateOffset!: number
  public readonly dueDateOffsetPeriod!: PeriodType
  public readonly dayOfMonth!: number
  public readonly month!: number
  public readonly weekDays!: number[]

  public constructor(values?: Partial<TaskRecurrenceSettingsInterface>) {
    values ? super(values) : super()
  }
}
