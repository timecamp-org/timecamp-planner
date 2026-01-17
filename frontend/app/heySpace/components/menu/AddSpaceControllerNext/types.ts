import { ChecklistItemInterface } from 'models/domain/ChecklistsModel/types';
import { ProjectInterface } from 'models/domain/ProjectsModel/types';
import { TaskInterface, TaskPriorityTypes } from 'models/domain/TasksModel/types';

export type TemplateEntityType = 'project' | 'task';
export interface TaskTEmplateInterface
  extends Pick<TaskInterface, 'name' | 'description' | 'startDate' | 'dueDate' | 'order' | 'id'> {
  taskPriorityType?: TaskPriorityTypes;
  checklistItemTemplates: Partial<ChecklistItemInterface>[];
}

export interface TaskListTemplate {
  id: string;
  order: number;
  name: string;
  taskTemplates?: TaskTEmplateInterface[];
}

export interface ProjectTemplateInterface
  extends Pick<ProjectInterface, 'color' | 'description' | 'name' | 'organizationId'> {
  id: string;
  order?: number;
  taskListTemplates: TaskListTemplate[];
}
