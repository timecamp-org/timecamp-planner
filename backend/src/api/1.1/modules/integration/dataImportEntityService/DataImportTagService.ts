import { injectable, inject } from 'inversify';
import { Id, generateId } from '../../common/identifier';
import { DataImportTagServiceInterface } from './interfaces/DataImportTagServiceInterface';

import { TagDbRow, TaskDbRow, TaskHasTagDbRow } from '../../db/schema';
import { TagServiceInterface } from '../../tags/TagServiceInterface';
import { ColorGeneratorInterface } from '../../common/ColorGenerator';
import { TagsModule } from '../../tags/TagsModule';
import { ExternalEntityIdsByExternalEntityId, ExternalEntityType, EntityInternalIdByExternalId } from '../types';
import { TaskServiceInterface } from '../../tasks/interfaces/TaskServiceInterface';
import { ExistingEntitiesServiceInterface } from '../interfaces/ExistingEntitiesServiceInterface';
import { TasksModule } from '../../tasks/TasksModule';
import { IntegrationModule } from '../IntegrationModule';

@injectable()
export class DataImportTagService implements DataImportTagServiceInterface {

  protected taskService: TaskServiceInterface;
  protected tagService: TagServiceInterface;
  protected tagColorGenerator: ColorGeneratorInterface;
  protected existingEntitiesService: ExistingEntitiesServiceInterface;

  constructor(
    @inject(TagsModule.TagServiceInterface) tagService: TagServiceInterface,
    @inject(IntegrationModule.ExistingEntitiesServiceInterface) existingEntitiesService: ExistingEntitiesServiceInterface,
    @inject(TagsModule.TagColorGeneratorInterface) tagColorGenerator: ColorGeneratorInterface,
    @inject(TasksModule.TaskServiceInterface) taskService: TaskServiceInterface,
  ) {
    this.tagService = tagService
    this.existingEntitiesService = existingEntitiesService
    this.tagColorGenerator = tagColorGenerator
    this.taskService = taskService
  }

  async createTags(
    extensionId: Id,
    organizationId: Id,
    externalTags: Partial<TagDbRow>[],
    trx: Transaction,
  ): Promise<TagDbRow[]> {
    const internalTags: TagDbRow[] = []

    const newTagInternalIdByExternalId: EntityInternalIdByExternalId = {}

    externalTags
      .forEach(externalTag => {
        const tag: TagDbRow = {
          id: generateId(),
          name: externalTag.name,
          organizationId,
          color: this.tagColorGenerator.generate(),
        }

        internalTags.push(tag)
        newTagInternalIdByExternalId[externalTag.id] = tag.id
      })

    await this.tagService.createTags(internalTags, trx)
    await this.existingEntitiesService.saveEntityExternalIdInternalIds(
      organizationId,
      extensionId,
      ExternalEntityType.TAG,
      newTagInternalIdByExternalId,
      trx,
    )

    return internalTags
  }

  async createTaskTags(
    extensionId: Id,
    organizationId: Id,
    newInternalTasks: TaskDbRow[],
    externalTagIdsByExternalTaskId: ExternalEntityIdsByExternalEntityId,
    trx: Transaction,
  ): Promise<TaskHasTagDbRow[]> {
    const taskTags: TaskHasTagDbRow[] = []
    const taskInternalIdByExternalId = await this.existingEntitiesService.getExistingEntityData(organizationId, extensionId, ExternalEntityType.TASK, trx)
    const tagInternalIdByExternalId = await this.existingEntitiesService.getExistingEntityData(organizationId, extensionId, ExternalEntityType.TAG, trx)

    const externalTaskIds = Object.keys(taskInternalIdByExternalId)
    const newExternalTaskIds = externalTaskIds
      .filter(externalTaskId => {
        const internalTaskId = taskInternalIdByExternalId[externalTaskId]
        return newInternalTasks.find(internalTask => internalTask.id === internalTaskId)
      })

    newExternalTaskIds.forEach(externalTaskId => {
      const externalTagIds = externalTagIdsByExternalTaskId[externalTaskId]
      const internalTaskId = taskInternalIdByExternalId[externalTaskId]
      if (!externalTagIds || !internalTaskId) {
        return
      }

      externalTagIds.forEach((externalTagId) => {
        const internalTagId = tagInternalIdByExternalId[externalTagId]

        if (!internalTagId) {
          return
        }
        
        taskTags.push({
          tagId: internalTagId,
          taskId: internalTaskId,
        })
      })
    })

    if (taskTags.length) {
      await this.taskService.attachTagsToTasks(taskTags, trx)
    }
    
    return taskTags
  }

}
