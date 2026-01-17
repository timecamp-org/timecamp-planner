import { injectable, inject } from "inversify";
import { Id, generateId } from "../../common/identifier";
import { ListDbRow } from "../../db/schema";
import { DataImportListServiceInterface } from "./interfaces/DataImportListServiceInterface";
import { IntegrationModule } from "../IntegrationModule";
import { EntityInternalIdByExternalId, ExternalEntityType, DefaultList } from "../types";
import { ExistingEntitiesServiceInterface } from "../interfaces/ExistingEntitiesServiceInterface";

import { ListsModule } from "../../lists/ListsModule";
import { ListProviderInterface } from "../../lists/interfaces/ListProviderInterface";
import { ListServiceInterface } from "../../lists/interfaces/ListServiceInterface";
import { OrderModule } from "../../order/OrderModule";
import { OrderServiceInterface } from "../../order/OrderServiceInterface";
import Table from "../../db/Table";
import { OrderServiceFactoryInterface } from "../../order/OrderServiceFactoryInterface";

@injectable()
export class DataImportListService implements DataImportListServiceInterface {

  protected listProvider: ListProviderInterface;
  protected listService: ListServiceInterface;
  protected existingEntitiesService: ExistingEntitiesServiceInterface;
  protected orderService: OrderServiceInterface;

  constructor(
    @inject(IntegrationModule.ExistingEntitiesServiceInterface) existingEntitiesService: ExistingEntitiesServiceInterface,
    @inject(ListsModule.ListProviderInterface) listProvider: ListProviderInterface,
    @inject(ListsModule.ListServiceInterface) listService: ListServiceInterface,
    @inject(OrderModule.OrderServiceFactoryInterface) orderFactoryService: OrderServiceFactoryInterface,
  ) {
    this.listProvider = listProvider
    this.listService = listService
    this.existingEntitiesService = existingEntitiesService
    this.orderService = orderFactoryService.create<ListDbRow>(Table.TASK_LIST, 'projectId', 'order')
  }

  async createLists(
    extensionId: Id,
    organizationId: Id,
    userId: Id,
    externalLists: Partial<ListDbRow>[],
    trx: Transaction,
  ): Promise<ListDbRow[]> {
    let internalLists: ListDbRow[] = []

    const projectInternalIdByExternalId = await this.existingEntitiesService.getExistingEntityData(organizationId, extensionId, ExternalEntityType.PROJECT, trx)

    const newListsExternalProjectIds = externalLists.map(externalList => externalList.projectId).filter(this.filterDuplicates)
    const newListsInternalProjectIds = newListsExternalProjectIds.map(externalProjectId => projectInternalIdByExternalId[externalProjectId])

    const lastListOrderByInternalProjectId = await this.listService.getProjectsLastListsOrder(newListsInternalProjectIds, trx)

    for (let i = 0; i < newListsExternalProjectIds.length; i++) {
      const externalProjectId = newListsExternalProjectIds[i];
      const internalProjectId = projectInternalIdByExternalId[externalProjectId]

      const projectNewExternalLists = externalLists
        .filter(externalList => externalList.projectId === externalProjectId)

      const projectNewInternalLists = await this.createProjectLists(
        extensionId,
        organizationId,
        userId,
        projectNewExternalLists,
        lastListOrderByInternalProjectId[internalProjectId],
        internalProjectId,
        trx,
      )

      internalLists = internalLists.concat(projectNewInternalLists)
    }

    return internalLists
  }

  async createProjectLists(
    extensionId: Id,
    organizationId: Id,
    userId: Id,
    projectNewExternalLists: Partial<ListDbRow>[],
    lastListOrder = 0,
    internalProjectId: Id,
    trx: Transaction,
  ) {
    const internalLists: ListDbRow[] = []
    const newListInternalIdByExternalId: EntityInternalIdByExternalId = {}
    const defaultList = this.makeDefaultList(userId)

    projectNewExternalLists
      .sort(this.sortAscending)
      .forEach((externalList) => {
        const newListId = generateId()
        newListInternalIdByExternalId[externalList.id] = newListId

        let order = externalList.order ? Math.round(externalList.order) : this.orderService.getNextOrder(lastListOrder)

        if (lastListOrder === order) {
          order = this.orderService.getNextOrder(lastListOrder)
        }

        const list: ListDbRow = {
          ...defaultList,
          ...externalList,
          id: newListId,
          projectId: internalProjectId,
          order,
        }

        lastListOrder = order

        internalLists.push(list)
      })


    await this.listProvider.createLists(internalLists, trx)
    await this.existingEntitiesService.saveEntityExternalIdInternalIds(
      organizationId,
      extensionId,
      ExternalEntityType.LIST,
      newListInternalIdByExternalId,
      trx,
    )

    return internalLists
  }

  makeDefaultList(userId: Id): DefaultList {
    return {
      name: 'Imported list',
      isArchived: false,
      creatorId: userId,
    }
  }

  sortAscending(a: ListDbRow, b: ListDbRow) {
    return a.order - b.order
  }

  private filterDuplicates(value, index, self) {
    return self.indexOf(value) === index
  }

}
