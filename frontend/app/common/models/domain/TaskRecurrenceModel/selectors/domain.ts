import { createSelector } from 'reselect'
import { domain } from '../constants'
import { TaskRecurrenceState, TaskRecurrenceSettingsInterface } from '../types';
import { Id } from '../../../../utils/identifier';
import createCachedSelector from 're-reselect';
import generateSelectorName from '../../../../utils/generateSelectorName';


export const selectTaskRecurrenceDomain = (state) => state.get(domain) as TaskRecurrenceState

export const selectRecurrenceSettingsData = createSelector(
  selectTaskRecurrenceDomain,
  (domain) => domain.get('recurrenceSettingsData') as Map<Id, TaskRecurrenceSettingsInterface>,
)

export const selectRecurrenceIdByTaskIdDomain = createSelector(
  selectTaskRecurrenceDomain,
  (domain) => domain.get('recurrenceIdByTaskId') as Map<Id, Id>,
)


// args: recurrenceId
export const selectRecurrenceSettings = createCachedSelector(
  selectRecurrenceSettingsData,
  (_, args) => args.recurrenceId,
  (recurrenceSettingsData, recurrenceId) => recurrenceSettingsData.get(recurrenceId),
)
(
  (_, args) => generateSelectorName(args, ['recurrenceId']),
)

// args: taskId
export const selectRecurrenceIdByTaskId = createCachedSelector(
  selectRecurrenceIdByTaskIdDomain,
  (_, args) => args.taskId,
  (recurrenceIdByTaskId, taskId) => recurrenceIdByTaskId.get(taskId),
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrence = createCachedSelector(
  selectRecurrenceIdByTaskId,
  selectRecurrenceSettingsData,
  (recurrenceId, recurrenceSettingsData) => recurrenceSettingsData.get(recurrenceId) as TaskRecurrenceSettingsInterface,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrenceInterval = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.interval : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrencePeriodType = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.periodType : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrenceWeekDays = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.weekDays : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrenceDayOfMonth = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.dayOfMonth : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrenceMonth = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.month : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrenTaskListId = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.targetTaskListId : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrencePosition = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.position : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrenceUpdateDueDate = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.updateDueDate : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrenceDueDateOffset = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.dueDateOffset : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskRecurrenceDueDateOffsetPeriod = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.dueDateOffsetPeriod : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

// args: taskId
export const selectTaskNextRecurrenceAt = createCachedSelector(
  selectTaskRecurrence,
  (recurrence) => recurrence ? recurrence.nextRecurrenceAt : null,
)
(
  (_, args) => generateSelectorName(args, ['taskId']),
)

