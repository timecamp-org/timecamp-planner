import { ChainableContextInterface } from "../interfaces/ChainableContextInterface";
import { NotificationDbRow, ProjectDbRow, ChangedPropertyInterface, NotificationData, ListDbRow } from "../../db/schema";
import { UserServiceInterface } from "../../users/UserServiceInterface";
import { ProjectServiceInterface } from "../../projects/interfaces/ProjectServiceInterface";
import { Actor } from "./types";
import { Id } from "../../common/identifier";
import { ListProviderInterface } from "../../lists/interfaces/ListProviderInterface";

export class NotificationContext
  implements ChainableContextInterface {
  protected notification: NotificationDbRow;
  protected userService: UserServiceInterface;
  protected projectService: ProjectServiceInterface;
  protected listProvider: ListProviderInterface;

  constructor(
    notification: NotificationDbRow,
    userService: UserServiceInterface,
    projectService: ProjectServiceInterface,
    listProvider: ListProviderInterface
  ) {
    this.notification = notification
    this.userService = userService
    this.projectService = projectService
    this.listProvider = listProvider
  }

  async getProject(projectId: Id): Promise<ProjectDbRow> {
    if (!projectId) {
      return null
    }
    return this.projectService.getProject(projectId);
  }

  async getTaskList(taskListId: Id): Promise<ListDbRow> {
    if (!taskListId) {
      return null
    }
    return this.listProvider.getList(taskListId)
  }

  getNotification(): NotificationDbRow {
    return this.notification;
  }

  getData(): NotificationData {
    return this.notification.data;
  }

  async getActor(): Promise<Actor> {
    return new Actor(await this.userService.getUserById(this.notification.actorId));
  }

  getChangedProperty<T>(propertyName: keyof T): ChangedPropertyInterface {
    const data = this.notification.data;
    if (!data.changedProps) {
      return null;
    }
    for (let prop of data.changedProps) {
      if (prop.propertyName === propertyName) {
        return prop;
      }
    }
    return null;
  }
}
