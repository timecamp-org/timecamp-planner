import {
  ProjectDbRow,
  TaskDbRow,
} from '../../db/schema';
import {
  GetProjectTasksWithMetadataResult,
} from '../types'
import { Id } from '../../common/identifier';

import { ProjectTasksQueryParams } from '../../tasks/types';

export interface ProjectTasksServiceInterface {

  getProjectTasks(projectId: Id, trx?: Transaction): Promise<Array<TaskDbRow>>

  getProjectTasksWithMetadata(projectId: Id, queryParams: ProjectTasksQueryParams): Promise<GetProjectTasksWithMetadataResult>

  getProjectByTaskId(taskId: Id): Promise<ProjectDbRow>

}
