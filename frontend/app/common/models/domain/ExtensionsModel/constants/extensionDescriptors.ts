import { i18mark } from '../../../../i18n';
import { ExtensionNamespace } from '../types';

export default {
  [ExtensionNamespace.AGILE]: {
    name: i18mark('Points'),
    description: i18mark('Estimate task points'),
  },
  [ExtensionNamespace.TASK_VOTING]: {
    name: i18mark('Votes'),
    description: i18mark('Add this module to vote for tasks.'),
  },
  [ExtensionNamespace.CALENDAR_SYNC]: {
    name: i18mark('Calendar Synchronisation'),
    description: i18mark('Export all your tasks directly to your calendar.'),
  },
  [ExtensionNamespace.TRELLO_DATA_IMPORT]: {
    name: i18mark('Trello Integration'),
    description: i18mark('Import all Trello boards to Planner.'),
  },
  [ExtensionNamespace.TASK_RECURRENCE]: {
    name: i18mark('Recurring tasks'),
    description: i18mark('Now make your tasks recurrent with fully customized settings'),
  },
  [ExtensionNamespace.KANBAN_LIMITS]: {
    name: i18mark('Work In Progress limit'),
    description: i18mark('WIP limit allows setting a limit of tasks in the list on the board.'),
  },
};
