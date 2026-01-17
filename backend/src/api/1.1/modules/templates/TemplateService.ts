import { inject, injectable } from 'inversify';
import { omit } from 'lodash';
import { ChecklistItemServiceInterface } from '../checklist/ChecklistItemServiceInterface';
import { ChecklistModule } from '../checklist/ChecklistModule';
import { CheckListItemJson, CreateChecklistItemStatus } from '../checklist/types';
import { CommonModule } from '../common/CommonModule';
import { EntityType } from '../common/enum';
import { Id, IdGeneratorInterface } from '../common/identifier';
import Table from '../db/Table';
import { ListTemplateDbRow, ProjectTemplateDbRow, TaskTemplateDbRow } from '../db/schema';

import { ConnectionInterface } from '../db/ConnectionInterface';
import { DbModule } from '../db/DbModule';
import { ListsModule } from '../lists/ListsModule';
import { ListServiceInterface } from '../lists/interfaces/ListServiceInterface';
import { CreateListJson } from '../lists/types';
import { OrganizationsModule } from '../organizations/OrganizationsModule';
import { OrganizationProviderInterface } from '../organizations/interfaces/OrganizationProviderInterface';
import { ProjectService } from '../projects/ProjectService';
import { ProjectsModule } from '../projects/ProjectsModule';
import { ProjectProviderInterface } from '../projects/interfaces/ProjectProviderInterface';
import { UserInProjectProvider } from '../projects/providers/UserInProjectProvider';
import { CreateProjectStatus, ProjectJson } from '../projects/types';
import { TagServiceInterface } from '../tags/TagServiceInterface';
import { TagsModule } from '../tags/TagsModule';
import { TasksModule } from '../tasks/TasksModule';
import { TaskProviderInterface } from '../tasks/interfaces/TaskProviderInterface';
import { TaskServiceInterface } from '../tasks/interfaces/TaskServiceInterface';
import { CreateTaskStatus, TaskJson } from '../tasks/types';
import { TemplateModule } from './TemplateModule';
import { templateTableByEntityType } from './const';
import { TemplateProviderInterface } from './interfaces/TemplateProviderInterface';
import { TemplateServiceInterface } from './interfaces/TemplateServiceInterface';
import { checklistItemSerializer, projectSerializer, taskListSerializer, taskSerializer } from './serializers';
import {
  CreateEntityFromTemplateResult,
  CreateEntityFromTemplateStatus,
  CreateEntityTemplateStatus,
  DeleteEntityTemplateStatus,
  GetEntityTemplateStatus,
  GetEntityTemplatesStatus,
  ProjectTemplateType,
  UpdateEntityTemplateResult,
  UpdateEntityTemplateStatus,
} from './types';

@injectable()
export class TemplateService implements TemplateServiceInterface {
  constructor(
    @inject(TemplateModule.TemplateProviderInterface)
    protected templateProvider: TemplateProviderInterface,
    @inject(OrganizationsModule.OrganizationProviderInterface)
    private organizationProvider: OrganizationProviderInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
    @inject(ProjectsModule.ProjectServiceInterface)
    private projectService: ProjectService,
    @inject(ListsModule.ListServiceInterface)
    private listService: ListServiceInterface,
    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,
    @inject(ChecklistModule.ChecklistItemServiceInterface)
    private checklistService: ChecklistItemServiceInterface,
    @inject(ProjectsModule.UserInProjectProviderInterface)
    private userInProjectProvider: UserInProjectProvider,
    @inject(TasksModule.TaskProviderInterface)
    private taskProvider: TaskProviderInterface,
    @inject(TagsModule.TagServiceInterface)
    private tagsService: TagServiceInterface,
    @inject(ProjectsModule.ProjectProviderInterface)
    private projectProvider: ProjectProviderInterface,
    @inject(DbModule.ConnectionInterface)
    private connection: ConnectionInterface
  ) {}

  async isGlobalTemplateUnique(name: string, excludedId?: Id) {
    const templateWithSameName = await this.templateProvider.getTemplateEntitiesByQueryModifiers(
      Table.PROJECT_TEMPLATE,
      { name, organizationId: null }
    );

    let result = templateWithSameName;
    if (excludedId) {
      result = result.filter((template) => template.id !== excludedId);
    }

    if (result.length > 0) {
      return false;
    }

    return true;
  }

  async checkUserAccessToOrganization(userId: Id, organizationId: Id) {
    const userOrganizationsIds = await this.organizationProvider.getOrganizationsIdsForUser(userId);

    if (organizationId && !userOrganizationsIds.includes(organizationId)) {
      return true;
    }
    return false;
  }

  async getEntityTemplate(userId: Id, entityType: EntityType, templateId: Id) {
    const userOrganizationsIds = await this.organizationProvider.getOrganizationsIdsForUser(userId);
    const table = templateTableByEntityType[entityType];

    const entity = await this.templateProvider.getTemplateEntity(table, templateId, userOrganizationsIds);

    if (!entity) {
      return {
        status: GetEntityTemplateStatus.ENTITY_NOT_FOUND,
      };
    }

    return {
      status: GetEntityTemplateStatus.OK,
      template: entity,
    };
  }

  async getEntityTemplates(userId: Id, entityType: EntityType) {
    const userOrganizationsIds = await this.organizationProvider.getOrganizationsIdsForUser(userId);

    const table = templateTableByEntityType[entityType];
    const templates = await this.templateProvider.getTemplateEntities(table, userOrganizationsIds);

    return {
      status: GetEntityTemplatesStatus.OK,
      templates,
    };
  }

  async createEntityTemplate(userId: Id, entityType: EntityType, entityJson: any) {
    switch (entityType) {
      case EntityType.Project:
        return await this.createProjectTemplate(userId, entityJson);

      case EntityType.TaskList:
        return await this.createTaskListTemplate(entityJson);

      case EntityType.Task:
        return await this.createTaskTemplate(entityJson);

      case EntityType.ChecklistItem:
        return await this.createChecklistItemTemplate(entityJson);

      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  async createProjectTemplate(userId: Id, projectTemplateJson: ProjectTemplateType, trx?: Transaction) {
    const userOrganizationsIds = await this.organizationProvider.getOrganizationsIdsForUser(userId);
    const isOrganizationIdNotProvidedWhenRequired = userId && !projectTemplateJson.organizationId;
    if (isOrganizationIdNotProvidedWhenRequired) {
      return {
        status: CreateEntityTemplateStatus.ORGANIZATION_ID_NOT_PROVIDED,
      };
    }

    const isGlobalTemplateAndDoesntHaveUniqueName =
      !userId && !projectTemplateJson.organizationId && !(await this.isGlobalTemplateUnique(projectTemplateJson.name));
    if (isGlobalTemplateAndDoesntHaveUniqueName) {
      return {
        status: CreateEntityTemplateStatus.GLOBAL_TEMPLATE_NOT_UNIQUE_NAME,
      };
    }

    const isPrivateTemplateCreatorWithoutAccessToOrganization = await this.checkUserAccessToOrganization(
      userId,
      projectTemplateJson.organizationId
    );

    if (isPrivateTemplateCreatorWithoutAccessToOrganization) {
      return {
        status: CreateEntityTemplateStatus.USER_NOT_IN_ORGANIZATION,
      };
    }
    const { taskListTemplates = [], ...projectTemplate } = projectTemplateJson;

    const serializedProjectTemplate = projectSerializer(projectTemplate);
    const { id: projectTemplateId } = await this.templateProvider.createTemplateEntity(
      Table.PROJECT_TEMPLATE,
      serializedProjectTemplate
    );
    await this.createTaskListTemplates(projectTemplateId, taskListTemplates);

    const createdProjectTemplate = await this.templateProvider.getTemplateEntity(
      Table.PROJECT_TEMPLATE,
      projectTemplateId,
      userOrganizationsIds
    );
    return {
      status: CreateEntityTemplateStatus.OK,
      template: createdProjectTemplate,
    };
  }

  async createTaskListTemplates(projectTemplateId: Id, taskListTemplates = []) {
    for (const taskListTemplate of taskListTemplates) {
      const { taskTemplates, ...restOfTaskTemplate } = taskListTemplate;
      const serializedTaskListTemplate = taskListSerializer(restOfTaskTemplate);
      await this.createTaskListTemplate({ ...serializedTaskListTemplate, projectTemplateId, taskTemplates });
    }
  }

  async createTaskListTemplate(taskListJson) {
    const { taskTemplates = [], ...taskList } = taskListJson;

    const { id: taskListTemplateId } = await this.templateProvider.createTemplateEntity(Table.TASK_LIST_TEMPLATE, {
      order: 1,
      ...taskList,
    });

    for (const taskTemplate of taskTemplates) {
      const { checklistItemTemplates, ...restOfTaskTemplate } = taskTemplate;
      const serializedTaskTemplate = taskSerializer(restOfTaskTemplate);
      await this.createTaskTemplate({
        ...serializedTaskTemplate,
        taskListTemplateId,
        checklistItemTemplates,
      });
    }
    const template = await this.templateProvider.getTemplateEntity(Table.TASK_LIST_TEMPLATE, taskListTemplateId);
    return {
      status: CreateEntityTemplateStatus.OK,
      template,
    };
  }

  async createTaskTemplate(taskTemplateJson) {
    const { checklistItemTemplates = [], tagTemplates, ...taskTemplate } = taskTemplateJson;
    const { id: taskTemplateId } = await this.templateProvider.createTemplateEntity(Table.TASK_TEMPLATE, {
      order: 1,
      ...taskTemplate,
    });

    await this.createTagTemplates(taskTemplate, tagTemplates, taskTemplateId);

    for (const checklistItemTemplate of checklistItemTemplates) {
      const serializedChecklistItem = checklistItemSerializer(checklistItemTemplate);
      await this.createChecklistItemTemplate({
        ...serializedChecklistItem,
        taskTemplateId,
      });
    }

    const template = await this.templateProvider.getTemplateEntity(Table.TASK_TEMPLATE, taskTemplateId);
    return {
      status: CreateEntityTemplateStatus.OK,
      template,
    };
  }

  async createChecklistItemTemplate(checklistItemTemplate) {
    const template = await this.templateProvider.createTemplateEntity(Table.CHECKLIST_ITEM_TEMPLATE, {
      order: 1,
      ...checklistItemTemplate,
    });

    return {
      status: CreateEntityTemplateStatus.OK,
      template,
    };
  }

  async updateEntityTemplate(
    userId: string,
    entityType: EntityType,
    templateId: string,
    entityTemplateJson: any
  ): Promise<UpdateEntityTemplateResult> {
    let error;
    switch (entityType) {
      case EntityType.Project:
        error = await this.updateProjectTemplate(userId, templateId, entityTemplateJson);
        break;
      case EntityType.TaskList:
        error = await this.updateTaskListTemplate(userId, templateId, entityTemplateJson);
        break;
      case EntityType.Task:
        error = await this.updateTaskTemplate(userId, templateId, entityTemplateJson);
        break;
      case EntityType.ChecklistItem:
        error = await this.updateChecklistItemTemplate(userId, templateId, entityTemplateJson);
        break;
      default:
        throw new Error('Not supported entity type');
    }

    if (error) {
      return error;
    }

    const table = templateTableByEntityType[entityType];
    const template = await this.templateProvider.getTemplateEntity(table, templateId);

    return {
      status: UpdateEntityTemplateStatus.OK,
      template,
    };
  }

  async updateProjectTemplate(userId: Id, templateId: Id, entityTemplateJson: any) {
    const isOrganizationIdNotProvidedWhenRequired = userId && !entityTemplateJson.organizationId;
    if (isOrganizationIdNotProvidedWhenRequired) {
      return {
        status: UpdateEntityTemplateStatus.ORGANIZATION_ID_NOT_PROVIDED,
      };
    }
    const isGlobalTemplateAndDoesntHaveUniqueName =
      !userId &&
      !entityTemplateJson.organizationId &&
      !(await this.isGlobalTemplateUnique(entityTemplateJson.name, templateId));
    if (isGlobalTemplateAndDoesntHaveUniqueName) {
      return {
        status: UpdateEntityTemplateStatus.GLOBAL_TEMPLATE_NOT_UNIQUE_NAME,
      };
    }

    const isPrivateTemplateCreatorWithoutAccessToOrganization = await this.checkUserAccessToOrganization(
      userId,
      entityTemplateJson.organizationId
    );
    if (isPrivateTemplateCreatorWithoutAccessToOrganization) {
      return {
        status: UpdateEntityTemplateStatus.USER_NOT_IN_ORGANIZATION,
      };
    }

    const { taskListTemplates = [], ...templateJson } = entityTemplateJson;

    await this.templateProvider.updateTemplateEntity(Table.PROJECT_TEMPLATE, templateId, templateJson);

    await this.templateProvider.deleteCascadeTemplateEntityChildren(Table.TASK_LIST_TEMPLATE, templateId);

    await this.createTaskListTemplates(templateId, taskListTemplates);
  }

  async updateTaskListTemplate(userId: Id, taskListTemplateId: Id, entityTemplateJson) {
    const { taskTemplates = [], ...templateJson } = entityTemplateJson;

    await this.templateProvider.updateTemplateEntity(Table.TASK_LIST_TEMPLATE, taskListTemplateId, templateJson);

    await this.templateProvider.deleteCascadeTemplateEntityChildren(Table.TASK_TEMPLATE, taskListTemplateId);

    for (const taskTemplate of taskTemplates || []) {
      await this.createTaskTemplate({
        ...taskTemplate,
        taskListTemplateId,
      });
    }
  }

  async updateTaskTemplate(userId: Id, taskTemplateId: Id, entityTemplateJson) {
    const { checklistItemTemplates = [], tagTemplates = [], ...templateJson } = entityTemplateJson;

    await this.templateProvider.updateTemplateEntity(Table.TASK_TEMPLATE, taskTemplateId, templateJson);

    await this.templateProvider.deleteCascadeTemplateEntityChildren(Table.CHECKLIST_ITEM_TEMPLATE, taskTemplateId);

    for (const checklistItemTemplate of checklistItemTemplates || []) {
      await this.createChecklistItemTemplate({
        ...checklistItemTemplate,
        taskTemplateId,
      });
    }

    await this.connection.getConnection().select(Table.TASK_TEMPLATE_HAS_TAG).where({ taskTemplateId }).del();

    await this.createTagTemplates(templateJson, tagTemplates, taskTemplateId);
  }

  async createTagTemplates(taskTemplate, tagTemplates = [], taskTemplateId) {
    let projectTemplateId = null;
    if (taskTemplate.taskListTemplateId) {
      const taskListTemplate = await this.templateProvider.getEntity<ListTemplateDbRow>(
        Table.TASK_LIST_TEMPLATE,
        taskTemplate.taskListTemplateId
      );

      projectTemplateId = taskListTemplate?.projectTemplateId || null;
    }

    let tagTemplateOptions = {};

    if (projectTemplateId) {
      const projectTemplate = await this.templateProvider.getEntity<ProjectTemplateDbRow>(
        Table.PROJECT_TEMPLATE,
        projectTemplateId
      );
      tagTemplateOptions = projectTemplate?.organizationId ? { organizationId: projectTemplate.organizationId } : {};
    }

    if (tagTemplates && tagTemplates.length) {
      const createdTagTemplates = await this.templateProvider.createTemplateEntities(
        Table.TAG_TEMPLATE,
        tagTemplates.map((tagTemplate) => ({ ...tagTemplate, ...tagTemplateOptions }))
      );

      await this.templateProvider.createTemplateEntities(
        Table.TASK_TEMPLATE_HAS_TAG,
        createdTagTemplates.map((tagTemplate) => ({
          taskTemplateId,
          tagTemplateId: tagTemplate.id,
        }))
      );
    }
  }

  async updateChecklistItemTemplate(userId: Id, templateId: Id, entityTemplateJson) {
    await this.templateProvider.updateTemplateEntity(Table.CHECKLIST_ITEM_TEMPLATE, templateId, entityTemplateJson);
  }

  async deleteEntityTemplate(entityType: EntityType, templateId: Id) {
    const table = templateTableByEntityType[entityType];
    await this.templateProvider.deleteTemplateEntity(table, templateId);
    return {
      status: DeleteEntityTemplateStatus.OK,
    };
  }

  async createEntityFromTemplateAction(userId: Id, entityType: EntityType, templateId: Id, body, omitTasks: boolean) {
    switch (entityType) {
      case EntityType.Project:
        return await this.handleEntityProjectFromTemplate(userId, templateId, body, omitTasks);

      case EntityType.TaskList:
        return await this.handleEntityTaskListFromTemplate(userId, templateId, body, omitTasks);

      case EntityType.Task:
        return await this.handleEntityTaskFromTemplate(userId, templateId, body, omitTasks);

      case EntityType.ChecklistItem:
        return await this.handleEntityChecklistItemFromTemplate(userId, templateId, body);

      default:
        return {
          status: CreateEntityFromTemplateStatus.NOT_SUPPORTED_TEMPLATE_ENTITY_TYPE,
        };
    }
  }

  async handleEntityProjectFromTemplate(userId: Id, templateId: Id, body, omitTasks: boolean) {
    if (await this.checkUserAccessToOrganization(userId, body.organizationId)) {
      return {
        status: CreateEntityFromTemplateStatus.USER_NOT_IN_ORGANIZATION,
      };
    }
    const userOrganizationsIds = await this.organizationProvider.getOrganizationsIdsForUser(userId);
    const projectTemplate = await this.templateProvider.getTemplateEntity(
      Table.PROJECT_TEMPLATE,
      templateId,
      userOrganizationsIds
    );

    if (!projectTemplate) {
      return {
        status: CreateEntityFromTemplateStatus.TEMPLATE_ENTITY_NOT_FOUND,
      };
    }
    const serializedProjectBody = projectSerializer(body);

    return await this.createProjectFromTemplate(
      { ...projectTemplate, ...serializedProjectBody },
      userId,
      serializedProjectBody.organizationId,
      omitTasks
    );
  }

  async handleEntityTaskListFromTemplate(userId: Id, templateId: Id, body, omitTasks: boolean) {
    const userOrganizationsIds = await this.organizationProvider.getOrganizationsIdsForUser(userId);
    const taskListTemplate = await this.templateProvider.getTemplateEntity(
      Table.TASK_LIST_TEMPLATE,
      templateId,
      userOrganizationsIds
    );
    if (!taskListTemplate) {
      return {
        status: CreateEntityFromTemplateStatus.TEMPLATE_ENTITY_NOT_FOUND,
      };
    }

    const serializedTaskListBody = taskListSerializer(body);

    return await this.createTaskListFromTemplate(
      {
        ...taskListTemplate,
        ...serializedTaskListBody,
      },
      userId,
      body.projectId,
      omitTasks
    );
  }
  async handleEntityTaskFromTemplate(userId: Id, templateId: Id, body, omitTasks: boolean, trx?: Transaction) {
    const taskTemplate = await this.templateProvider.getTemplateEntity(Table.TASK_TEMPLATE, templateId, null);

    if (!taskTemplate) {
      return {
        status: CreateEntityFromTemplateStatus.TEMPLATE_ENTITY_NOT_FOUND,
      };
    }
    const serializedTaskBody = taskSerializer(body);
    const { tagTemplates = [], ...restOfTaskTemplate } = taskTemplate as TaskTemplateDbRow;

    const createdTaskFromTemplate = await this.createTaskFromTemplate(
      { ...restOfTaskTemplate, ...serializedTaskBody },
      body.projectId,
      userId,
      body.taskListId,
      omitTasks
    );

    if (createdTaskFromTemplate.status !== CreateEntityFromTemplateStatus.OK) {
      return createdTaskFromTemplate;
    }

    return createdTaskFromTemplate;
  }

  async handleEntityChecklistItemFromTemplate(userId: Id, templateId: Id, body) {
    const checklistItemTemplate = await this.templateProvider.getTemplateEntity(
      Table.CHECKLIST_ITEM_TEMPLATE,
      templateId
    );

    if (!checklistItemTemplate) {
      return {
        status: CreateEntityFromTemplateStatus.TEMPLATE_ENTITY_NOT_FOUND,
      };
    }
    const serializedChecklistItemBody = checklistItemSerializer(body);

    if (!body.taskId) {
      return {
        status: CreateEntityFromTemplateStatus.TASK_NOT_FOUND,
      };
    }
    return await this.createChecklistItemFromTemplate(
      { ...checklistItemTemplate, ...serializedChecklistItemBody },
      body.taskId
    );
  }

  async createProjectFromTemplate(projectTemplate, userId: Id, organizationId: Id, omitTasks = false) {
    const { taskListTemplates = [], projectId, order, ...restOfProjectTemplate } = projectTemplate;

    const theTemplate: ProjectJson = {
      ...restOfProjectTemplate,
      organizationId,
    };

    const projectUuid = this.idGenerator.generateId();

    const entity = await this.projectService.createProject(projectUuid, userId, theTemplate);

    switch (entity.status) {
      case CreateProjectStatus.OK:
        break;
      case CreateProjectStatus.ORGANIZATION_NOT_FOUND:
        return {
          status: CreateEntityFromTemplateStatus.ORGANIZATION_NOT_FOUND,
        };
      case CreateProjectStatus.PROJECT_ALREADY_EXISTS:
        return {
          status: CreateEntityFromTemplateStatus.PROJECT_ALREADY_EXISTS,
        };
      default:
        break;
    }

    await this.userInProjectProvider.setUserOwnerToProject(userId, projectUuid);

    const result = {
      status: CreateEntityFromTemplateStatus.OK,
      entity: entity.project,
    };

    for (const taskListTemplate of taskListTemplates || []) {
      await this.createTaskListFromTemplate(taskListTemplate, userId, projectUuid, omitTasks);
    }

    return result;
  }

  async createTaskListFromTemplate(taskListTemplate, creatorId: Id, projectId: Id, omitTasks = false) {
    const id = this.idGenerator.generateId();

    const { taskTemplates = [], projectTemplateId, ...restOfTaskTemplate } = taskListTemplate;
    const taskListTemplateJson: CreateListJson = {
      ...restOfTaskTemplate,
      projectId,
      creatorId,
      id,
    };

    const entity = await this.listService.createList(id, taskListTemplateJson);

    const result = {
      status: CreateEntityFromTemplateStatus.OK,
      entity: entity.list,
    };

    if (omitTasks) {
      return result;
    }

    for (const taskTemplate of taskTemplates || []) {
      await this.createTaskFromTemplate(taskTemplate, projectId, creatorId, id, omitTasks);
    }

    return result;
  }

  async createTaskFromTemplate(
    taskTemplate,
    projectId: Id,
    creatorId: Id,
    taskListId: Id,
    omitTasks: boolean = false
  ): Promise<CreateEntityFromTemplateResult> {
    const id = this.idGenerator.generateId();
    const { organizationId } = await this.projectProvider.getProject(projectId);
    const { checklistItemTemplates = [], taskListTemplateId, tagTemplates = [], ...restOfTaskTemplate } = taskTemplate;
    const taskTemplateJson: Omit<TaskJson, 'startDate' | 'dueDate'> = {
      ...restOfTaskTemplate,
      creatorId,
      id,
      taskListId,
      projectId,
    };

    const entity = await this.taskService.createTask(id, creatorId, omit(taskTemplateJson, 'projectTemplateId'));

    let entityStatus;
    switch (entity.status) {
      case CreateTaskStatus.OK:
        entityStatus = CreateEntityFromTemplateStatus.OK;
        break;
      case CreateTaskStatus.TASK_ALREADY_EXISTS:
        entityStatus = CreateEntityFromTemplateStatus.TASK_ALREADY_EXISTS;
        break;
      case CreateTaskStatus.LIST_NOT_FOUND:
        entityStatus = CreateEntityFromTemplateStatus.LIST_NOT_FOUND;
        break;
      case CreateTaskStatus.PROJECT_NOT_FOUND:
        entityStatus = CreateEntityFromTemplateStatus.PROJECT_NOT_FOUND;
        break;
      case CreateTaskStatus.DUE_DATE_EARLIER_THAN_START_DATE:
        entityStatus = CreateEntityFromTemplateStatus.DUE_DATE_EARLIER_THAN_START_DATE;
        break;
      case CreateTaskStatus.TASK_WITH_ORDER_ALREADY_EXISTS:
        entityStatus = CreateEntityFromTemplateStatus.TASK_WITH_ORDER_ALREADY_EXISTS;
        break;
      default:
        throw new Error(`Unsupported CreateTaskStatus: ${entity.status}`);
    }

    if (entityStatus !== CreateEntityFromTemplateStatus.OK) {
      return {
        status: entityStatus,
      };
    }

    const tasksHaveTags = [];
    for (const tagTemplate of tagTemplates || []) {
      const tagId = this.idGenerator.generateId();
      const newTag = await this.tagsService.createOrGetTagByNameForOrganization({
        ...tagTemplate,
        organizationId,
        id: tagId,
      });

      tasksHaveTags.push({
        taskId: id,
        tagId: newTag.id,
      });
    }

    if (tasksHaveTags.length) {
      await this.taskService.attachTagsToTasks(tasksHaveTags, undefined);
    }

    const result: CreateEntityFromTemplateResult = {
      status: CreateEntityFromTemplateStatus.OK,
      entity: entity.task,
    };

    if (omitTasks) {
      return result;
    }

    for (const checklistItemTemplate of checklistItemTemplates) {
      await this.createChecklistItemFromTemplate(checklistItemTemplate, id);
    }

    return result;
  }

  async createChecklistItemFromTemplate(checklistItemTemplate, taskId: Id) {
    const id = this.idGenerator.generateId();
    const { taskTemplateId, ...restOfChecklistItemTemplate } = checklistItemTemplate;

    const checklistItemTemplateJson: CheckListItemJson = {
      isChecked: false,
      ...restOfChecklistItemTemplate,
      id,
      taskId,
    };

    const task = await this.taskProvider.getTaskById(taskId);
    if (!task) {
      return {
        status: CreateEntityFromTemplateStatus.TASK_NOT_FOUND,
      };
    }

    const entity = await this.checklistService.createChecklistItem(id, taskId, checklistItemTemplateJson);

    let entityStatus;
    switch (entity.status) {
      case CreateChecklistItemStatus.OK:
        entityStatus = CreateEntityFromTemplateStatus.OK;
        break;
      case CreateChecklistItemStatus.TASK_NOT_FOUND:
        entityStatus = CreateEntityFromTemplateStatus.TASK_NOT_FOUND;
        break;
      case CreateChecklistItemStatus.CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS:
        entityStatus = CreateEntityFromTemplateStatus.CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS;
        break;
      case CreateChecklistItemStatus.CHECKLIST_ITEM_ALREADY_EXISTS:
        entityStatus = CreateEntityFromTemplateStatus.CHECKLIST_ITEM_ALREADY_EXISTS;
        break;
    }

    if (entityStatus !== CreateEntityFromTemplateStatus.OK) {
      return {
        status: entityStatus,
      };
    }
    return {
      status: CreateEntityFromTemplateStatus.OK,
      entity: entity.checklistItem,
    };
  }
}
