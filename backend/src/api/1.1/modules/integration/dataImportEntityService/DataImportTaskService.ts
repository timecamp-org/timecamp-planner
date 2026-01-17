import { injectable, inject } from 'inversify';
import { Id, generateId } from '../../common/identifier';
import { TaskDbRow, TaskStatus } from '../../db/schema';
import { DataImportTaskServiceInterface } from './interfaces/DataImportTaskServiceInterface';
import { IntegrationModule } from '../IntegrationModule';
import {
  EntityInternalIdByExternalId,
  ExternalEntityType,
  DefaultTask,
} from '../types';
import { ExistingEntitiesServiceInterface } from '../interfaces/ExistingEntitiesServiceInterface';

import { TaskServiceInterface } from '../../tasks/interfaces/TaskServiceInterface';
import { TasksModule } from '../../tasks/TasksModule';
import { OrderServiceInterface } from '../../order/OrderServiceInterface';
import { OrderServiceFactoryInterface } from '../../order/OrderServiceFactoryInterface';
import { OrderModule } from '../../order/OrderModule';
import Table from '../../db/Table';
import { ListsModule } from '../../lists/ListsModule';
import { ListProviderInterface } from '../../lists/interfaces/ListProviderInterface';
import { keyBy } from 'lodash';
import { InfrastructureModule } from '../../../../../infrastructure/InfrastructureModule';
import { LoggerInterface } from '../../../../../infrastructure/logger';
@injectable()
export class DataImportTaskService implements DataImportTaskServiceInterface {
  protected orderService: OrderServiceInterface;

  constructor(
    @inject(IntegrationModule.ExistingEntitiesServiceInterface)
    private existingEntitiesService: ExistingEntitiesServiceInterface,
    @inject(TasksModule.TaskServiceInterface)
    private taskService: TaskServiceInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(InfrastructureModule.LoggerInterface)
    private logger: LoggerInterface,
    @inject(OrderModule.OrderServiceFactoryInterface)
    orderFactoryService: OrderServiceFactoryInterface
  ) {
    this.orderService = orderFactoryService.create<TaskDbRow>(
      Table.TASK,
      'taskListId',
      'order'
    );
  }

  async createTasks(
    extensionId: Id,
    organizationId: Id,
    userId: Id,
    externalTasks: Partial<TaskDbRow>[],
    trx: Transaction
  ): Promise<TaskDbRow[]> {
    let internalTasks: TaskDbRow[] = [];

    const projectInternalIdByExternalId =
      await this.existingEntitiesService.getExistingEntityData(
        organizationId,
        extensionId,
        ExternalEntityType.PROJECT,
        trx
      );
    const listInternalIdByExternalId =
      await this.existingEntitiesService.getExistingEntityData(
        organizationId,
        extensionId,
        ExternalEntityType.LIST,
        trx
      );

    const newTasksExternalListIds = externalTasks
      .map((newExternalTasks) => newExternalTasks.taskListId)
      .filter(this.filterDuplicates);

    const newTasksInternalListIds = newTasksExternalListIds
      .map((externalListId) => listInternalIdByExternalId[externalListId])
      .filter(Boolean);

    const lastTaskOrderByInternalListId =
      await this.taskService.getListsLastTasksOrder(
        newTasksInternalListIds,
        trx
      );

    for (const externalListId of newTasksExternalListIds) {
      const internalListId = listInternalIdByExternalId[externalListId];

      if (!internalListId) {
        this.logger.error(
          `No internal listId was found for external: ${externalListId}`
        );
        continue;
      }

      const listExternalTasks = externalTasks.filter(
        (externalTask) => externalTask.taskListId === externalListId
      );

      const newListTasks = await this.createListTasks(
        extensionId,
        organizationId,
        userId,
        listExternalTasks,
        internalListId,
        lastTaskOrderByInternalListId[internalListId],
        projectInternalIdByExternalId,
        trx
      );

      internalTasks = internalTasks.concat(newListTasks);
    }

    return internalTasks;
  }

  async createListTasks(
    extensionId: Id,
    organizationId: Id,
    userId: Id,
    listExternalTasks: Partial<TaskDbRow>[],
    internalListId: Id,
    lastTaskOrder = 0,
    projectInternalIdByExternalId: EntityInternalIdByExternalId,
    trx: Transaction
  ) {
    const newTaskInternalIdByExternalId: EntityInternalIdByExternalId = {};
    const internalTasks: TaskDbRow[] = [];
    const defaultTask = this.makeDefaultTask(userId);

    const ordersLookup = [];

    listExternalTasks.sort(this.sortAscending).forEach((externalTask) => {
      const newTaskId = generateId();
      newTaskInternalIdByExternalId[externalTask.id] = newTaskId;

      let order = externalTask.order
        ? Math.round(externalTask.order)
        : this.orderService.getNextOrder(lastTaskOrder);

      if (lastTaskOrder === order) {
        order = this.orderService.getNextOrder(lastTaskOrder);
      }

      if (!ordersLookup.includes(order)) {
        ordersLookup.push(order);
      } else {
        const existingOrders = internalTasks.map((task) => task.order);
        const maxOrder = Math.max(...existingOrders);
        order = this.orderService.getNextOrder(maxOrder);
      }

      lastTaskOrder = order;

      const task: TaskDbRow = {
        ...defaultTask,
        ...externalTask,
        id: newTaskId,
        projectId: projectInternalIdByExternalId[externalTask.projectId],
        taskListId: internalListId,
        order,
      };

      internalTasks.push(task);
    });

    await this.deduplicateInternalTasks(trx, internalListId, internalTasks);

    this.logger.info(
      `Getting existing internal tasks from list: ${internalListId}`
    );

    await this.taskService.createTasks(internalTasks, trx);
    await this.existingEntitiesService.saveEntityExternalIdInternalIds(
      organizationId,
      extensionId,
      ExternalEntityType.TASK,
      newTaskInternalIdByExternalId,
      trx
    );

    return internalTasks;
  }

  async deduplicateInternalTasks(
    trx: Transaction,
    internalListId: Id,
    internalTasks: TaskDbRow[]
  ) {
    const existingInternalTasks = await this.listProvider.getListTasks(
      internalListId,
      trx
    );

    if (existingInternalTasks.length > 0) {
      const existingInternalTasksSorted = existingInternalTasks.sort(
        (taskA, taskB) => taskA.order - taskB.order
      );
      let lastOrder =
        existingInternalTasksSorted[existingInternalTasks.length - 1].order;
      const existingTasksByOrder = keyBy(existingInternalTasksSorted, 'order');

      internalTasks.forEach((task) => {
        const existingTaskWithOrder = existingTasksByOrder[task.order];
        if (existingTaskWithOrder) {
          this.logger.info(
            `Found duplicate order in list: ${internalListId} - ${task.order}. Incrementing...`
          );
          task.order = this.orderService.getNextOrder(lastOrder);
          lastOrder = task.order;
        }
      });
    }
  }

  makeDefaultTask(userId: Id): DefaultTask {
    return {
      name: 'Imported task',
      isArchived: false,
      creatorId: userId,
      description: '',
      status: TaskStatus.INCOMPLETE,
      progress: 0,
      dueDate: null,
      sourceMessageId: null,
    };
  }

  sortAscending(a: TaskDbRow, b: TaskDbRow) {
    return a.order - b.order;
  }

  private filterDuplicates(value, index, self) {
    return self.indexOf(value) === index;
  }
}
