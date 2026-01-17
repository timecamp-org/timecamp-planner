import { AbstractResource } from '../../../../../infrastructure/resources/AbstractResource';
import {
  ProjectTasksMetadataType,
  ProjectTasksResourceContext,
  ProjectTasksResourceData,
} from '../types';
import { injectable, inject } from 'inversify';
import { TasksModule } from '../../tasks/TasksModule';
import { TaskServiceInterface } from '../../tasks/interfaces/TaskServiceInterface';
import { AnyDict } from '../../common/types';
import { ProjectType } from '../../db/schema'
import { ProjectsModule } from '../ProjectsModule';
import { ProjectTasksProviderInterface } from '../interfaces/ProjectTasksProviderInterface';
import { ConversationServiceInterface } from '../interfaces/ConversationServiceInterface';
import { getTasksQueryDecorator } from '../../tasks/queryDecorators';
import { PaginationModule } from '../../pagination/PaginationModule';
import { QueryModifier } from '../../../../../services/types';
import { PaginationServiceFactoryInterface } from '../../pagination/interfaces/PaginationServiceFactoryInterface';
import { TimeRangePaginatorOptions } from '../../pagination/types';
import Table from '../../db/Table';
import { ProjectTasksQueryParams } from '../../tasks/types';
import { ChecklistModule } from '../../checklist/ChecklistModule';
import { ChecklistItemServiceInterface } from '../../checklist/ChecklistItemServiceInterface';

@injectable()
export class ProjectTasksResource
  extends AbstractResource<ProjectTasksQueryParams, ProjectTasksResourceContext, ProjectTasksResourceData> {

  constructor(
    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,
    @inject(ProjectsModule.ProjectTasksProviderInterface)
    private projectTasksProvider: ProjectTasksProviderInterface,
    @inject(ProjectsModule.ConversationServiceInterface)
    private conversationService: ConversationServiceInterface,
    @inject(ChecklistModule.ChecklistItemServiceInterface)
    private checklistItemService: ChecklistItemServiceInterface,
    @inject(PaginationModule.PaginationServiceFactoryInterface)
    paginationServiceFactory: PaginationServiceFactoryInterface
  ) {
    super(paginationServiceFactory)
  }

  async getData(queryParams: ProjectTasksQueryParams, context: ProjectTasksResourceContext): Promise<ProjectTasksResourceData> {
    const { project } = context
    let tasks = []

    const paginator = super.getPaginator(queryParams, context)
    const columnNames = this.getColumnNames(queryParams)
    const decorators = this.getQueryDecorators({ ...queryParams, organizationId: project.organizationId }, context)

    if (paginator !== null) {
      decorators.unshift(paginator.decorate.bind(paginator))
    }

    if (project.projectType === ProjectType.PROJECT) {
      tasks = await this.projectTasksProvider.getProjectTasksBasicData(project.id, decorators, columnNames)
    } else {
      tasks = await this.conversationService.getConversationTasks(project.id, null, decorators)
    }

    const taskIds = tasks.map(task => task.id)

    const metadata = await this.getMetadata(queryParams, { ...context, taskIds })

    return {
      tasks,
      ...metadata
    }
  }

  public getQueryDecorators(queryParams: ProjectTasksQueryParams, context: ProjectTasksResourceContext): QueryModifier[] {
    return [getTasksQueryDecorator(queryParams)]
  }

  public getPaginatorOptions(queryParams: ProjectTasksQueryParams): TimeRangePaginatorOptions {
    const { before, since } = queryParams
    return {
      before,
      since,
      fromColumn: `${Table.TASK}.startDate`,
      toColumn: `${Table.TASK}.dueDate`,
    }
  }

  protected getMetadataPromiseForField(field: string, context: ProjectTasksResourceContext): PromiseLike<AnyDict> {
    const { taskIds } = context
    switch (field) {
      case ProjectTasksMetadataType.FOLLOWERS:
        return this.taskService.getTasksFollowers(taskIds)
      case ProjectTasksMetadataType.PEOPLE:
        return this.taskService.getTasksPeople(taskIds)
      case ProjectTasksMetadataType.TAGS:
        return this.taskService.getTasksTags(taskIds)
      case ProjectTasksMetadataType.CHECKLIST:
        return this.checklistItemService.getTasksChecklistItemsBasicData(taskIds)
    }
  }

}