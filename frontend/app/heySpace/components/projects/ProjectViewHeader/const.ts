import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';

export const viewTypesWithoutSection = [
  ProjectPanelType.LIST,
  ProjectPanelType.TIMELINE,
  ProjectPanelType.TIMELINE_PROJECT,
  ProjectPanelType.TIMELINE_PEOPLE,
];

export const rightPanelTypes = [ProjectPanelType.CALENDAR, ProjectPanelType.TIMELINE, ProjectPanelType.LIST];

export const ICON_COLOR = 'var(--color-black)';
