import { Id } from '../common/identifier'
import { union } from 'lodash'
import { TaskServiceInterface } from '../tasks/interfaces/TaskServiceInterface'
import { inject, injectable } from 'inversify'
import { FollowerServiceInterface } from './interfaces/FollowerServiceInterface'
import { TasksModule } from '../tasks/TasksModule'
import { ProjectsModule } from '../projects/ProjectsModule'
import { ListsModule } from '../lists/ListsModule'
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface';
import { ListFollowersProviderInterface } from '../lists/interfaces/ListFollowersProviderInterface';
import { ProjectFollowersServiceInterface } from '../projects/interfaces/ProjectFollowersServiceInterface';

@injectable()
export class FollowerService
  implements FollowerServiceInterface
{
  private taskService: TaskServiceInterface;
  private listProvider: ListProviderInterface;
  private listFollowersProvider: ListFollowersProviderInterface;
  protected projectFollowersService: ProjectFollowersServiceInterface;

  constructor(
    @inject(TasksModule.TaskServiceInterface)
    taskService: TaskServiceInterface,
    
    @inject(ListsModule.ListProviderInterface)
    listProvider: ListProviderInterface,
    
    @inject(ListsModule.ListFollowersProviderInterface)
    listFollowersProvider: ListFollowersProviderInterface,

    @inject(ProjectsModule.ProjectFollowersServiceInterface)
    projectFollowersService: ProjectFollowersServiceInterface,
  ) {
    this.taskService = taskService
    this.listProvider = listProvider
    this.listFollowersProvider = listFollowersProvider
    this.projectFollowersService = projectFollowersService
  }

  async getFollowersForTask(taskId: Id): Promise<Array<Id>> {
    const task = await this.taskService.getTaskById(taskId)

    const followers = await Promise.all([
      this.taskService.getTaskFollowerIdsWithAssignees(taskId),
      this.projectFollowersService.getProjectFollowerIds(task.projectId),
      this.listFollowersProvider.getListsFollowerIdsByListIds([ task.taskListId ])
    ]);

    const [ taskFollowers, projectFollowers, listFollowers ] = followers;

    return union(taskFollowers, projectFollowers, listFollowers[ task.taskListId ])
  }

  async getFollowersForList(listId: Id): Promise<Array<Id>> {
    const list = await this.listProvider.getList(listId)
    const projectId = list.projectId

    const projectFollowers = await this.projectFollowersService.getProjectFollowerIds(projectId);
    const listsFollowers = await this.listFollowersProvider.getListsFollowerIdsByListIds([ listId ])
    const listFollowers = listsFollowers[ listId ]

    return union(projectFollowers, listFollowers)
  }
}
