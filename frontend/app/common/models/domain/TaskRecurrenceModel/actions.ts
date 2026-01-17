import * as C from './constants'
import { TaskRecurrenceSettingsInterface, TaskRecurrenceDependencyInterface, TaskRecurrenceSettingsDbRow } from './types';
import { action } from 'typesafe-actions'
import { TaskRecurrenceSettings } from './models';
import { fromJS, Map } from 'immutable'
import { Id } from '../../../utils/identifier';

export const onSetTaskRecurrence = (recurrenceData: TaskRecurrenceSettingsInterface) =>
  action(C.onSetTaskRecurrence, recurrenceData)

export const onSetTaskRecurrenceSuccess = (recurrenceSettings: TaskRecurrenceSettingsInterface) =>
  action(C.onSetTaskRecurrenceSuccess, recurrenceSettings)

export const onDeleteTaskRecurrenceSettings = (recurrenceId: Id) =>
  action(C.onDeleteTaskRecurrenceSettings, { recurrenceId })

export const onDeleteTaskRecurrenceSettingsSuccess = (recurrenceId: Id) =>
  action(C.onDeleteTaskRecurrenceSettingsSuccess, { recurrenceId })

export const onUpdateTaskRecurrenceSettingsData = (recurrencySettingsDbRow: TaskRecurrenceSettingsDbRow) =>
{
  const { id, taskId, value, nextRecurrenceAt } = recurrencySettingsDbRow
  const recurrenceSettings = {
    id: id,
    nextRecurrenceAt: nextRecurrenceAt,
    taskId: taskId,
    ...value,
  }
  return action(C.onUpdateTaskRecurrenceSettingsData, new TaskRecurrenceSettings(fromJS(recurrenceSettings)))
}

export const onDeleteTaskRecurrenceSettingsData = (recurrenceSettings: TaskRecurrenceSettingsDbRow) =>
  action(C.onDeleteTaskRecurrenceSettingsData, { id: recurrenceSettings.id })

export const onUpdateTaskRecurrenceDependencyData = (dependence: TaskRecurrenceDependencyInterface) =>
  action(C.onUpdateTaskRecurrenceDependencyData, dependence)

export const onDeleteTaskRecurrenceDependencyData = (dependence: TaskRecurrenceDependencyInterface) =>
  action(C.onDeleteTaskRecurrenceDependencyData, dependence)

export const onBatchRecurrenceDedependency = (recurrenceIdByTaskId: Map<Id, Id>) =>
  action(C.onBatchRecurrenceDedependency, recurrenceIdByTaskId)

