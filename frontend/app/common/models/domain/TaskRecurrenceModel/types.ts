import { Id } from "../../../utils/identifier";
import { PeriodType, Position, ImmutableMap } from "../../../types";

export type TaskRecurrenceSettingsDbRow = {
  id: Id,
  taskId: Id,
  value: TaskRecurrenceSettingsInterface,
  nextRecurrenceAt: Date,
}

export type TaskRecurrenceSettingsInterface = {
  id: Id,
  taskId: Id,

  targetTaskListId: Id,
  periodType: PeriodType,
  interval: number,

  dayOfMonth: number,
  month: number,
  weekDays: number[],
  
  nextRecurrenceAt: Date,
  position: Position,

  updateDueDate: boolean,
  dueDateOffset: number,
  dueDateOffsetPeriod: PeriodType,
}

export type TaskRecurrenceDependencyInterface = {
  id: Id,
  taskId: Id,
  targetTaskId: Id,
  recurrencySettingsId: Id,
}

export interface TaskRecurrenceState extends ImmutableMap<string, any> {
  recurrenceSettingsData: Map<Id, TaskRecurrenceSettingsInterface>,
  recurrenceIdByTaskId: Map<Id, Id>,
}
