import { TaskDbRow, ProjectDbRow } from '../../db/schema';

import { Id } from '../../common/identifier';
import { Maybe } from '../../common/types';
import { QueryModifier } from '../../../../../services/types';

export interface ProjectTasksProviderInterface {
  getProjectTasks(projectId: Id, trx?: Transaction): PromiseLike<TaskDbRow[]>

  getProjectTasksBasicData(
    projectId: Id,
    queryDecorators?: Maybe<QueryModifier[]>,
    columnNames?: string[],
    trx?: Transaction,
  ): PromiseLike<TaskDbRow[]>;

  getProjectByTaskId(taskId: Id): PromiseLike<ProjectDbRow>;
}