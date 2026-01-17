import { injectable, inject } from 'inversify';
import { Id, generateId } from '../../common/identifier';
import { TaskDbRow, ChecklistItemDbRow } from '../../db/schema';
import { DataImportChecklistServiceInterface } from './interfaces/DataImportChecklistServiceInterface';
import { IntegrationModule } from '../IntegrationModule';
import { ExternalEntityType, ExternalChecklist } from '../types';
import { ExistingEntitiesServiceInterface } from '../interfaces/ExistingEntitiesServiceInterface';

import { ChecklistModule } from '../../checklist/ChecklistModule';
import { ChecklistItemServiceInterface } from '../../checklist/ChecklistItemServiceInterface';
import Table from '../../db/Table';
import { OrderModule } from '../../order/OrderModule';
import { OrderServiceInterface } from '../../order/OrderServiceInterface';
import { OrderServiceFactoryInterface } from '../../order/OrderServiceFactoryInterface';

@injectable()
export class DataImportChecklistService implements DataImportChecklistServiceInterface {

  protected checklistItemService: ChecklistItemServiceInterface;
  protected existingEntitiesService: ExistingEntitiesServiceInterface;
  protected orderService: OrderServiceInterface;

  constructor(
    @inject(IntegrationModule.ExistingEntitiesServiceInterface) existingEntitiesService: ExistingEntitiesServiceInterface,
    @inject(ChecklistModule.ChecklistItemServiceInterface) checklistItemService: ChecklistItemServiceInterface,
    @inject(OrderModule.OrderServiceFactoryInterface) orderFactoryService: OrderServiceFactoryInterface,
  ) {
    this.checklistItemService = checklistItemService
    this.existingEntitiesService = existingEntitiesService
    this.orderService = orderFactoryService.create<ChecklistItemDbRow>(Table.CHECKLIST_ITEM, 'taskId', 'order')
  }

  async createChecklists(
    extensionId: Id,
    organizationId: Id,
    newInternalTasks: TaskDbRow[],
    externalChecklists: Partial<ExternalChecklist>[],
    trx: Transaction,
  ): Promise<ChecklistItemDbRow[]> {
    let internalChecklistItems: ChecklistItemDbRow[] = []
    const taskInternalIdByExternalId = await this.existingEntitiesService.getExistingEntityData(organizationId, extensionId, ExternalEntityType.TASK, trx)

    const externalTaskIds = Object.keys(taskInternalIdByExternalId)
    const newExternalTaskIds = externalTaskIds
      .filter(externalTaskId => {
        const internalTaskId = taskInternalIdByExternalId[externalTaskId]
        return newInternalTasks.find(internalTask => internalTask.id === internalTaskId)
      })

    newExternalTaskIds.forEach((externalTaskId) => {
      const internalTaskId = taskInternalIdByExternalId[externalTaskId]
      const taskChecklists = externalChecklists
        .filter(checklist => checklist.taskId === externalTaskId)

      const taskChecklistItems = this.getTaskChecklistItems(internalTaskId, taskChecklists)
      internalChecklistItems = internalChecklistItems.concat(taskChecklistItems)
    })

    if (internalChecklistItems.length) {
      await this.checklistItemService.createChecklistItems(internalChecklistItems, trx)
    }
    return internalChecklistItems
  }

  getTaskChecklistItems(taskId: Id, taskChecklists: Partial<ExternalChecklist>[]): ChecklistItemDbRow[] {
    let taskChecklistItems = []
    const sortedTaskChecklists = taskChecklists.sort(this.sortAscending)

    let order = 0
    sortedTaskChecklists.forEach(checklist => {
      order = this.orderService.getNextOrder(order)

      taskChecklistItems.push({
        id: generateId(),
        taskId,
        order,
        name: checklist.name,
        isChecked: true,
      })

      const checklistItems = checklist.checklistItems
        .sort(this.sortAscending)
        .map(checklistItem => {
          order = this.orderService.getNextOrder(order)

          return {
            id: generateId(),
            taskId,
            order,
            name: checklistItem.name,
            isChecked: checklistItem.isChecked,
          }
        })

      taskChecklistItems = taskChecklistItems.concat(checklistItems)
    })

    return taskChecklistItems
  }

  sortAscending(a: Partial<ExternalChecklist> | Partial<ChecklistItemDbRow>, b: Partial<ExternalChecklist> | Partial<ChecklistItemDbRow>) {
    return a.order - b.order
  }

}
