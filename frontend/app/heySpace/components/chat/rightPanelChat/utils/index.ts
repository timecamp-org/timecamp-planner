import handleError from 'common/utils/handleError';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { ProjectPanelType, RightPanelType } from 'models/domain/ProjectsSettingsModel/types';

export function getCurrentPanelType(
  isOpen: boolean,
  rightPanelType: RightPanelType,
  projectPanelType: ProjectPanelType
): RightPanelType {
  if (projectPanelType === ProjectPanelType.CHAT && rightPanelType === undefined && isOpen) {
    return RightPanelType.TASKS;
  }

  return rightPanelType;
}

export function getTaskFiltersTargetType(projectPanelType: ProjectPanelType): TaskFiltersTargetType {
  switch (projectPanelType) {
    case ProjectPanelType.CALENDAR:
      return TaskFiltersTargetType.CALENDAR;
    case ProjectPanelType.CHAT:
      return TaskFiltersTargetType.KANBAN_VERTICAL;
    case ProjectPanelType.KANBAN:
      return TaskFiltersTargetType.KANBAN;
    case ProjectPanelType.LIST:
      return TaskFiltersTargetType.TASK_LIST;
    case ProjectPanelType.TIMELINE:
      return TaskFiltersTargetType.TIMELINE;
    case ProjectPanelType.TIMELINE_PROJECT:
      return TaskFiltersTargetType.TIMELINE;
    case ProjectPanelType.TIMELINE_PEOPLE:
      return TaskFiltersTargetType.TIMELINE;
    case ProjectPanelType.FILES:
      return null;
    default:
      handleError(new Error(`Unspecified target type ${projectPanelType}`));
  }
}
