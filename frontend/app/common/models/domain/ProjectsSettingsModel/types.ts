import { ImmutableMap } from '../../../types';
import { Id } from '../../../utils/identifier';

export enum ProjectPanelType {
  CHAT = 'chat',
  KANBAN = 'kanban',
  CALENDAR = 'calendar',
  TIMELINE = 'timeline',
  TIMELINE_PEOPLE = 'timeline-people',
  TIMELINE_PROJECT = 'timeline-project',
  LIST = 'list',
  FILES = 'files',
}

export enum RightPanelType {
  TASKS = 'tasks',
  SETTINGS = 'settings',
  FILTERS = 'filters',
  MEMBERS = 'members',
  ADDONS = 'addons',
}

export interface UserProjectSettingsDbRow {
  userId: Id;
  projectId: Id;
}

export interface UserProjectSettingsInterface {}

export interface ProjectsSettingsState extends ImmutableMap<string, any> {
  userProjectsSettingsData: UserProjectsSettingsData;
}

export type UserProjectsSettingsData = ImmutableMap<Id, UserProjectSettingsInterface>;
