

import {
  ProjectDbRow,
  TaskDbRow,
} from '../db/schema'
import { ProjectTasksServiceInterface } from './interfaces/ProjectTasksServiceInterface'
import {
  GetProjectTasksWithMetadataStatus,
  GetProjectTasksWithMetadataResult,
  RemoveProjectMemberEventData,
  ProjectTasksResourceContext,
  ProjectTasksResourceData,
} from './types'
import { inject, injectable } from 'inversify'
import { TasksModule } from '../tasks/TasksModule'
import { Id } from '../common/identifier'
import { ProjectPeopleServiceInterface } from './interfaces/ProjectPeopleServiceInterface';
import { ProjectsModule } from './ProjectsModule';
import { ProjectProviderInterface } from './interfaces/ProjectProviderInterface';
import { TaskServiceInterface } from '../tasks/interfaces/TaskServiceInterface';

import { ProjectTasksProviderInterface } from './interfaces/ProjectTasksProviderInterface'
import { ResourceInterface } from '../../../../infrastructure/resources/ResourceInterface'
import { ProjectTasksQueryParams } from '../tasks/types'
import { getTasksAssignedToUserQueryDecorator } from '../tasks/queryDecorators'

@injectable()
export class ProjectTasksService implements ProjectTasksServiceInterface {

  constructor(
    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,
    @inject(ProjectsModule.ProjectPeopleServiceInterface)
    private projectPeopleService: ProjectPeopleServiceInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(ProjectsModule.ProjectTasksProviderInterface)
    private projectTasksProvider: ProjectTasksProviderInterface,
    @inject(ProjectsModule.ProjectTasksResource)
    private resource: ResourceInterface<ProjectTasksQueryParams, ProjectTasksResourceContext, ProjectTasksResourceData>,
  ) {
    this.attachToEntityEvents()
  }

  protected attachToEntityEvents() {
    this.projectPeopleService.removeProjectMemberEvent.attach(this.removeProjectTasksPerson.bind(this));
  }

  async getProjectTasks(projectId: Id, trx?: Transaction): Promise<TaskDbRow[]> {
    return await this.projectTasksProvider.getProjectTasks(projectId, trx)
  }

  async removeProjectTasksPerson(params: RemoveProjectMemberEventData): Promise<void> {
    const { projectId, trx, userId, actorId } = params
    const projectUserAssignedTasks = await this.projectTasksProvider.getProjectTasksBasicData(
      projectId,
      [getTasksAssignedToUserQueryDecorator(userId)],
      ['id'],
      trx
    )
    const deleteTaskPeopleRolePromises = projectUserAssignedTasks.map(async task => {
      return await this.taskService.doDeleteTaskPeopleRole(trx, task.id, userId, actorId);
    })

    await Promise.all(deleteTaskPeopleRolePromises)
  }

  async getProjectTasksWithMetadata(
    projectId: Id,
    queryParams: ProjectTasksQueryParams,
  ): Promise<GetProjectTasksWithMetadataResult> {

    const project = await this.projectProvider.getProject(projectId)
    if (!project) {
      return { status: GetProjectTasksWithMetadataStatus.PROJECT_NOT_FOUND }
    }

    const data = await this.resource.getData(queryParams, { project })

    return {
      status: GetProjectTasksWithMetadataStatus.OK,
      data
    }
  }

  async getProjectByTaskId(taskId: Id): Promise<ProjectDbRow> {
    return await this.projectTasksProvider.getProjectByTaskId(taskId)
  }

}
