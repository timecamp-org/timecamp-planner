import { first } from 'lodash';
import { generateId, Id } from '../common/identifier';
import Table from '../db/Table';

import { inject, injectable } from 'inversify';
import { isEqual } from 'lodash';
import { ChecklistItemProviderInterface } from '../checklist/ChecklistItemProviderInterface';
import { ChecklistModule } from '../checklist/ChecklistModule';
import { CommonModule } from '../common/CommonModule';
import { JsonSerializerInterface } from '../common/json/JsonSerializerInterface';
import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import {
  ActivityDbRow,
  ActivityType,
  ContainerType,
  ListDbRow,
  ProjectDbRow,
  TargetType,
  TaskDbRow,
  TaskTimeEstimateDbRow,
} from '../db/schema';
import { FilesModule } from '../files/FilesModule';
import { FileProviderInterface } from '../files/interfaces/FileProviderInterface';
import { ListProviderInterface } from '../lists/interfaces/ListProviderInterface';
import { ListsModule } from '../lists/ListsModule';
import { PaginationServiceInterface } from '../pagination/interfaces/PaginationServiceInterface';
import { PaginationModule } from '../pagination/PaginationModule';
import { StandardPaginationToken, StandardPaginatorOptions } from '../pagination/types';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';
import { ProjectsModule } from '../projects/ProjectsModule';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
import { TasksModule } from '../tasks/TasksModule';
import UserService from '../users/UserService';
import { UserServiceInterface } from '../users/UserServiceInterface';
import { UsersModule } from '../users/UsersModule';
import { ActivityContainer } from './ActivityContainer';
import { ActivityTarget } from './ActivityTarget';
import { ActivityServiceInterface } from './interfaces/ActivityServiceInterface';
import { Changes, GetActivitiesResult, GetActivitiesResultStatus } from './types';

@injectable()
export class ActivityService implements ActivityServiceInterface {
  constructor(
    @inject(PaginationModule.StandardPaginationService)
    private standardPaginationService: PaginationServiceInterface<StandardPaginationToken, StandardPaginatorOptions>,
    @inject(UsersModule.UserServiceInterface)
    private userService: UserServiceInterface,
    @inject(FilesModule.FileProviderInterface)
    private fileProvider: FileProviderInterface,
    @inject(CommonModule.JsonSerializerInterface)
    private jsonSerializer: JsonSerializerInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(ChecklistModule.ChecklistItemProviderInterface)
    private checklistItemProvider: ChecklistItemProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  /**
   * @param {Id} containerId
   * @return {Promise<GetActivitiesResult>}
   */
  async getActivities(
    containerType: ContainerType,
    containerId: Id,
    page: string,
    limit: number
  ): Promise<GetActivitiesResult> {
    switch (containerType) {
      case ContainerType.PROJECT: {
        const project = await this.projectProvider.getProject(containerId);
        if (!project) {
          return {
            status: GetActivitiesResultStatus.PROJECT_NOT_FOUND,
          };
        }
        break;
      }
      case ContainerType.TASK: {
        const task = await this.taskProvider.getTaskById(containerId);
        if (!task) {
          return {
            status: GetActivitiesResultStatus.TASK_NOT_FOUND,
          };
        }
        break;
      }
      default: {
        // do nothing
      }
    }

    try {
      const tableName = ActivityContainer.getTableName(containerType);
      const propertyName = ActivityContainer.getPropertyName(containerType);

      const query = this.connection
        .getQueryBuilder()
        .select()
        .from(tableName)
        .where({ [propertyName]: containerId })
        .join(Table.ACTIVITY, `${Table.ACTIVITY}.id`, `${tableName}.activity_id`)
        .returning('*');
      const paginator = this.standardPaginationService.getPaginator(page, {
        limit,
        columns: ['createdAt', 'id'],
      });
      const results = await paginator.execute<ActivityDbRow>(query);

      return {
        status: GetActivitiesResultStatus.OK,
        activities: results.results,
      };
    } catch (error) {
      if (error.message === ActivityContainer.ERROR_TABLE_DOES_NOT_EXIST) {
        return {
          status: GetActivitiesResultStatus.NOT_IMPLEMENTED_CONTAINER_TYPE,
        };
      }
      throw error;
    }
  }

  /**
   * @param {Id} containerId
   * @return {Promise<boolean>}
   */
  async createActivity(activity: ActivityDbRow, trx?: Transaction): Promise<boolean> {
    return await this.connection.getQueryWithTransaction(trx).insert(activity).into(Table.ACTIVITY);
  }

  /**
   * @param {Id} containerId
   * @return {Promise<boolean>}
   */
  async createActivityContainer(
    containerId: Id,
    activityId: Id,
    containerType: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const containerTableName = ActivityContainer.getTableName(containerType);
    const propertyName = ActivityContainer.getPropertyName(containerType);

    await this.connection
      .getQueryWithTransaction(transaction)
      .insert({
        [propertyName]: containerId,
        activityId,
      })
      .into(containerTableName);

    return true;
  }

  /**
   * @param {Id} containerId
   * @return {Promise<boolean>}
   */
  async createActivityTarget(
    targetId: Id,
    activityId: Id,
    targetType: string,
    transaction?: Transaction
  ): Promise<boolean> {
    const targetTableName = ActivityTarget.getTableName(targetType);
    const propertyName = ActivityTarget.getPropertyName(targetType);

    await this.connection
      .getQueryWithTransaction(transaction)
      .insert({
        [propertyName]: targetId,
        activityId,
      })
      .into(targetTableName);

    return true;
  }

  /**
   * @param {Id} containerId
   * @return {Promise<boolean>}
   */
  async createActivityChanges(
    activityId: Id,
    changes?: Changes<TaskDbRow | ProjectDbRow | Pick<TaskTimeEstimateDbRow, 'minutes'>>,
    transaction?: Transaction
  ): Promise<boolean> {
    const changesFields = Object.keys(changes.new);
    const rows = [];

    for (let i = 0; i < changesFields.length; i++) {
      const field = changesFields[i];
      const newValue = changes.new[field];
      const oldValue = changes.old[field];

      if (!isEqual(oldValue, newValue)) {
        rows.push({
          id: generateId(),
          activityId,
          propertyName: field,
          new: this.jsonSerializer.toJson(newValue),
          old: this.jsonSerializer.toJson(oldValue),
        });
      }
    }

    if (rows.length === 0) {
      return;
    }
    await this.connection.getQueryWithTransaction(transaction).insert(rows).into(Table.ACTIVITY_CHANGED_PROP);

    return true;
  }

  async createActivityTaskCreated(task: TaskDbRow, creatorId: Id, trx?: Transaction): Promise<boolean> {
    const activityId = generateId();

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.CREATE,
        actorId: creatorId,
        targetType: TargetType.TASK,
        targetValue: task ? task.name : null,
      },
      trx
    );

    await this.createActivityContainer(task.id, activityId, ContainerType.TASK, trx);

    await this.createActivityTarget(task.id, activityId, TargetType.TASK, trx);

    return true;
  }

  async createActivityTaskUpdated(task: TaskDbRow, creatorId: Id, changes: Changes<TaskDbRow>, trx?: Transaction) {
    const activityId = generateId();

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.MODIFY,
        actorId: creatorId,
        targetType: TargetType.TASK,
        targetValue: task ? task.name : null,
      },
      trx
    );

    await this.createActivityContainer(task.id, activityId, ContainerType.TASK, trx);

    await this.createActivityTarget(task.id, activityId, TargetType.TASK, trx);

    await this.createActivityChanges(activityId, changes, trx);

    return true;
  }

  async createActivityTaskPeopleAdded(taskId: Id, creatorId: Id, userId: Id, trx?: Transaction) {
    const activityId = generateId();
    const user = await this.userService.getUserById(userId, trx);
    const task = await this.taskProvider.getTaskById(taskId, trx);

    let firstName,
      lastName,
      email = null;
    if (user) {
      firstName = user.firstName;
      lastName = user.lastName;
      email = user.email;
    }

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.ADD,
        actorId: creatorId,
        targetType: TargetType.USER,
        targetValue: firstName && lastName ? `${firstName} ${lastName}` : `${email}`,
        containerType: ContainerType.TASK,
        containerValue: task ? task.name : null,
      },
      trx
    );

    await this.createActivityContainer(taskId, activityId, ContainerType.TASK, trx);

    await this.createActivityTarget(userId, activityId, TargetType.USER, trx);

    return true;
  }

  async createActivityFileAttachedToTask(fileId: Id, taskId: Id, creatorId: Id, trx?: Transaction) {
    const activityId = generateId();
    const file = first(await this.fileProvider.getFilesByIds([fileId], trx));

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.ADD,
        actorId: creatorId,
        targetType: TargetType.FILE,
        targetValue: file ? file.name : null,
        containerType: ContainerType.TASK,
      },
      trx
    );

    await this.createActivityContainer(taskId, activityId, ContainerType.TASK, trx);

    await this.createActivityTarget(fileId, activityId, TargetType.FILE, trx);

    return true;
  }

  async createActivityTaskPeopleDeleted(taskId: Id, creatorId: Id, userId: Id, trx?: Transaction) {
    const activityId = generateId();
    const user = await this.userService.getUserById(userId, trx);
    const task = await this.taskProvider.getTaskById(taskId, trx);

    let firstName,
      lastName,
      email = null;
    if (user) {
      firstName = user.firstName;
      lastName = user.lastName;
      email = user.email;
    }

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.REMOVE,
        actorId: creatorId,
        targetType: TargetType.USER,
        targetValue: firstName && lastName ? `${firstName} ${lastName}` : `${email}`,
        containerType: ContainerType.TASK,
        containerValue: task ? task.name : null,
      },
      trx
    );

    await this.createActivityContainer(taskId, activityId, ContainerType.TASK, trx);

    await this.createActivityTarget(userId, activityId, TargetType.USER, trx);

    return true;
  }

  async createActivityChecklistAssigneesAdded(
    checklistItemId: Id,
    creatorId: Id,
    userId: Id,
    trx?: Transaction
  ): Promise<boolean> {
    const activityId = generateId();
    const user = await this.userService.getUserById(userId, trx);
    const checklistItem = await this.checklistItemProvider.getChecklistItem(checklistItemId, trx);

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.ADD,
        actorId: creatorId,
        targetType: TargetType.USER,
        targetValue: UserService.getUserFullName(user),
        containerType: ContainerType.CHECKLIST_ITEM,
        containerValue: checklistItem ? checklistItem.name : null,
      },
      trx
    );

    await this.createActivityContainer(checklistItemId, activityId, ContainerType.CHECKLIST_ITEM, trx);

    await this.createActivityTarget(userId, activityId, TargetType.USER, trx);

    return true;
  }

  async createActivityChecklistAssigneesRemoved(
    checklistItemId: Id,
    creatorId: Id,
    userId: Id,
    trx?: Transaction
  ): Promise<boolean> {
    const activityId = generateId();
    const user = await this.userService.getUserById(userId, trx);
    const checklistItem = await this.checklistItemProvider.getChecklistItem(checklistItemId, trx);

    let firstName,
      lastName,
      email = null;
    if (user) {
      firstName = user.firstName;
      lastName = user.lastName;
      email = user.email;
    }

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.REMOVE,
        actorId: creatorId,
        targetType: TargetType.USER,
        targetValue: firstName && lastName ? `${firstName} ${lastName}` : `${email}`,
        containerType: ContainerType.CHECKLIST_ITEM,
        containerValue: checklistItem ? checklistItem.name : null,
      },
      trx
    );

    await this.createActivityContainer(checklistItemId, activityId, ContainerType.CHECKLIST_ITEM, trx);

    await this.createActivityTarget(userId, activityId, TargetType.USER, trx);

    return true;
  }

  async createActivityTaskListCreated(list: ListDbRow, creatorId: Id, trx: Transaction) {
    const activityId = generateId();

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.CREATE,
        actorId: creatorId,
        targetType: TargetType.TASK_LIST,
        targetValue: list ? list.name : null,
      },
      trx
    );

    await this.createActivityContainer(list.id, activityId, ContainerType.TASK_LIST, trx);

    await this.createActivityTarget(list.id, activityId, TargetType.TASK_LIST, trx);

    return true;
  }

  async createActivityTaskListUpdated(listId: Id, creatorId: Id, changes: Changes<TaskDbRow>, trx: Transaction) {
    const activityId = generateId();
    const { name } = await this.listProvider.getList(listId, trx);

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.MODIFY,
        actorId: creatorId,
        targetType: TargetType.TASK_LIST,
        targetValue: name,
      },
      trx
    );

    await this.createActivityContainer(listId, activityId, ContainerType.TASK_LIST, trx);

    await this.createActivityTarget(listId, activityId, TargetType.TASK_LIST, trx);

    await this.createActivityChanges(activityId, changes, trx);

    return true;
  }

  async createActivityProjectPeopleAdded(projectId: Id, creatorId: Id, userId: Id, trx?: Transaction) {
    const activityId = generateId();
    const user = await this.userService.getUserById(userId, trx);
    const project = await this.projectProvider.getProject(projectId, trx);

    let firstName,
      lastName,
      email = null;
    if (user) {
      firstName = user.firstName;
      lastName = user.lastName;
      email = user.email;
    }

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.ADD,
        actorId: creatorId,
        targetType: TargetType.USER,
        targetValue: firstName && lastName ? `${firstName} ${lastName}` : `${email}`,
        containerType: ContainerType.PROJECT,
        containerValue: project ? project.name : null,
      },
      trx
    );

    await this.createActivityContainer(projectId, activityId, ContainerType.PROJECT, trx);

    await this.createActivityTarget(userId, activityId, TargetType.USER, trx);

    return true;
  }

  async createActivityProjectPeopleDeleted(projectId: Id, creatorId: Id, userId: Id, trx?: Transaction) {
    const activityId = generateId();
    const user = await this.userService.getUserById(userId, trx);
    const project = await this.projectProvider.getProject(projectId, trx);

    let firstName,
      lastName,
      email = null;
    if (user) {
      firstName = user.firstName;
      lastName = user.lastName;
      email = user.email;
    }

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.REMOVE,
        actorId: creatorId,
        targetType: TargetType.USER,
        targetValue: firstName && lastName ? `${firstName} ${lastName}` : `${email}`,
        containerType: ContainerType.PROJECT,
        containerValue: project ? project.name : null,
      },
      trx
    );

    await this.createActivityContainer(projectId, activityId, ContainerType.PROJECT, trx);

    await this.createActivityTarget(userId, activityId, TargetType.USER, trx);

    return true;
  }

  async createActivityProjectUpdated(projectId: Id, creatorId: Id, changes: Changes<ProjectDbRow>, trx?: Transaction) {
    const activityId = generateId();
    const { name } = await this.projectProvider.getProject(projectId, trx);

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.MODIFY,
        actorId: creatorId,
        targetType: TargetType.PROJECT,
        targetValue: name,
      },
      trx
    );

    await this.createActivityContainer(projectId, activityId, ContainerType.PROJECT, trx);

    await this.createActivityTarget(projectId, activityId, TargetType.PROJECT, trx);

    await this.createActivityChanges(activityId, changes, trx);

    return true;
  }

  async createActivityCustomFieldValueUpdate(
    creatorId: Id,
    targetType: TargetType,
    targetId: Id,
    changes: Changes<TaskDbRow | ProjectDbRow>,
    trx?: Transaction
  ) {
    const activityId = generateId();

    let targetValue = '';
    switch (targetType) {
      case TargetType.PROJECT: {
        const project = await this.projectProvider.getProject(targetId, trx);
        targetValue = project ? project.name : null;
        break;
      }
      case TargetType.TASK: {
        const task = await this.taskProvider.getTaskById(targetId, trx);
        targetValue = task ? task.name : null;
        break;
      }
      default:
        break;
    }

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.MODIFY,
        actorId: creatorId,
        targetType: targetType,
        targetValue: targetValue,
      },
      trx
    );

    await this.createActivityContainer(targetId, activityId, targetType, trx);

    await this.createActivityTarget(targetId, activityId, targetType, trx);

    await this.createActivityChanges(activityId, changes, trx);

    return true;
  }

  async createActivityTaskTimeEstimateUpdated(
    estimate: TaskTimeEstimateDbRow,
    creatorId: Id,
    changes: Changes<Pick<TaskTimeEstimateDbRow, 'minutes'>>,
    trx: Transaction
  ) {
    const activityId = generateId();

    const task = await this.taskProvider.getTaskById(estimate.taskId, trx);

    await this.createActivity(
      {
        id: activityId,
        type: ActivityType.MODIFY,
        actorId: creatorId,
        targetType: TargetType.TASK,
        targetValue: estimate.minutes.toString(),
      },
      trx
    );

    await this.createActivityContainer(task.id, activityId, ContainerType.TASK, trx);

    await this.createActivityTarget(task.id, activityId, TargetType.TASK, trx);

    await this.createActivityChanges(activityId, changes, trx);

    return true;
  }
}
