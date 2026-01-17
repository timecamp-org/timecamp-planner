import { TaskDbRow, ProjectDbRow } from '../../db/schema';
import { ProjectTasksProviderInterface } from '../interfaces/ProjectTasksProviderInterface';
import { AbstractPostgresProvider } from '../../postgresDataProvider/AbstractPostgresProvider';
import Table from '../../db/Table';
import { injectable } from 'inversify';
import { Id } from '../../common/identifier';
import { Maybe } from '../../common/types';
import { QueryModifier } from '../../../../../services/types';

const defaultTaskBasicDataColumnNames = [
  'id',
  'projectId',
  'name',
  'order',
  'taskListId',
  'isArchived',
  'progress',
  'dueDate',
  'startDate',
  'status',
  'taskPriorityType',
];

@injectable()
export class ProjectTasksProvider extends AbstractPostgresProvider implements ProjectTasksProviderInterface {
  async getProjectTasks(projectId: Id, trx?: Transaction): Promise<TaskDbRow[]> {
    const query = this.connection.getQueryWithTransaction(trx);
    return await query.from(Table.TASK).where('projectId', projectId);
  }

  async getProjectByTaskId(taskId: Id): Promise<ProjectDbRow> {
    return await this.connection
      .getQueryBuilder()
      .first()
      .from(Table.PROJECT)
      .whereIn('id', function () {
        this.select('project_id').from(Table.TASK).where({ id: taskId });
      });
  }

  async getProjectTasksBasicData(
    projectId: Id,
    queryDecorators: Maybe<QueryModifier[]> = [],
    columnNames: string[] = defaultTaskBasicDataColumnNames,
    trx?: Transaction
  ): Promise<TaskDbRow[]> {
    columnNames = columnNames.map((name) => `${Table.TASK}.${name}`);
    let projectTasksQuery = this.connection
      .getQueryWithTransaction(trx)
      .from(Table.TASK)
      .select(columnNames)
      .where(function () {
        this.where(`${Table.TASK}.projectId`, '=', projectId);
      });

    for (const decorateQuery of queryDecorators) {
      if (decorateQuery) {
        projectTasksQuery = decorateQuery(projectTasksQuery);
      }
    }
    return await projectTasksQuery;
  }
}
