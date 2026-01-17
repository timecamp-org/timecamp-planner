import { ProjectsModule } from "../projects/ProjectsModule";
import { TasksModule } from "../tasks/TasksModule";
import { inject, injectable } from "inversify";
import { MessageContainerServiceInterface } from "./interfaces/MessageContainerServiceInterface";
import { MessageDbRow, MessageContainerType } from "../db/schema";
import { MessageContainerInstance, MessageContainer, MessageContainerDefinition, MessageContainerDefinitions } from "./types";
import { Id } from "../common/identifier";
import ErrorDefinitions, { Type } from "../common/ErrorDefinitions";
import { ProjectProviderInterface } from "../projects/interfaces/ProjectProviderInterface";
import { TaskProviderInterface } from "../tasks/interfaces/TaskProviderInterface";
import { DbModule } from "../db/DbModule";
import { ConnectionInterface } from "../db/ConnectionInterface";

@injectable()
export class MessageContainerService implements MessageContainerServiceInterface {
  private projectProvider: ProjectProviderInterface
  private taskProvider: TaskProviderInterface

  constructor(
    @inject(ProjectsModule.ProjectProviderInterface) projectProvider: ProjectProviderInterface,
    @inject(TasksModule.TaskProviderInterface) taskProvider: TaskProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {
    this.projectProvider = projectProvider
    this.taskProvider = taskProvider
  }

  /**
   * @param message
   */
  public async getContainerInstance(message: Partial<MessageDbRow>): Promise<MessageContainerInstance> {
    const container = await this.getContainerForMessage(message);

    if (!container) {
      return null;
    }

    return await this.getInstance(container);
  }

  public getContainer(containerType: MessageContainerType, containerId: Id): MessageContainer {
    const containerDefinition = this.getContainerDefinition(containerType);
    return {
      ...containerDefinition,
      id: containerId
    }
  }

  public async getContainerForMessage(message: Partial<MessageDbRow>): Promise<MessageContainer> {
    const containerDefinition = this.getContainerDefinition(message.containerType);

    const containerRelationRow = await this.connection.getQueryBuilder()
      .select()
      .from(containerDefinition.relTable)
      .where('messageId', message.id)
      .first()
      ;
    if (!containerRelationRow) {
      console.warn(`Missing relation row!`);
    }

    return {
      ...containerDefinition,
      id: containerRelationRow[containerDefinition.idColumn]
    }
  }

  public getContainerDefinition(containerType: MessageContainerType): MessageContainerDefinition {
    if (!MessageContainerDefinitions[containerType]) {
      throw ErrorDefinitions[Type.NOT_IMPLEMENTED_CONTAINER_TYPE]
    }
    return MessageContainerDefinitions[containerType];
  }

  public async getInstance(container: MessageContainer): Promise<MessageContainerInstance> {
    const instance = await this.connection.getQueryBuilder()
      .select()
      .from(container.table)
      .where('id', container.id)
      .first()
      ;
    return {
      ...container,
      instance
    }
  }

  public async getOrganizationIdFromContainer(containerType: MessageContainerType, containerId: Id): Promise<Id> {
    let result = null
    let projectId = null

    if (containerType === MessageContainerType.TASK) {
      const task = await this.taskProvider.getTaskById(containerId)
      projectId = task ? task.projectId : null
    } else if (containerType === MessageContainerType.PROJECT) {
      projectId = containerId
    }

    if (projectId) {
      const project = await this.projectProvider.getProject(projectId)
      result = project ? project.organizationId : null
    }

    return result
  }
}
