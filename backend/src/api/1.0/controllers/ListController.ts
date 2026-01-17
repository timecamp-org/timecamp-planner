import { Request, Response } from 'express';

import {
  CopyListStatus,
  MoveAllTasksInListStatus,
  CreateListStatus,
  UpdateListStatus,
  AddListFollowerStatus,
  RemoveListFollowerStatus,
  GetListStatus
} from '../modules/lists/types';
import logger from '../../../infrastructure/logger';
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions';
import { HttpStatus } from '../../../infrastructure/enum';
import { injectable, inject } from 'inversify';
import { ListsModule } from '../modules/lists/ListsModule';
import { ListServiceInterface } from '../modules/lists/interfaces/ListServiceInterface';
import { ListProviderInterface } from '../modules/lists/interfaces/ListProviderInterface';
import { CommonModule } from '../modules/common/CommonModule';
import { IdGeneratorInterface, Id } from '../modules/common/identifier';

@injectable()
export class ListController {

  constructor(
    @inject(ListsModule.ListServiceInterface)
    private listService: ListServiceInterface,
    @inject(ListsModule.ListProviderInterface)
    private listProvider: ListProviderInterface,
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
  ) {
  }

  async createListAction(req: Request, res: Response) {
    try {
      const listJson = req.body
      listJson.creatorId = req.heyspace.authResult.userId
      const listId = req.params.listId || this.idGenerator.generateId()
      const result = await this.listService.createList(listId, listJson);

      switch (result.status) {
        case CreateListStatus.OK:
          return res.send(result.list)
        case CreateListStatus.LIST_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.LIST_ALREADY_EXISTS]);
        case CreateListStatus.LIST_WITH_ORDER_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.LIST_WITH_ORDER_ALREADY_EXISTS]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async updateListAction(req: Request, res: Response) {
    try {
      const userId = req.heyspace.authResult.userId
      const result = await this.listService.updateList(req.params.listId, req.body, userId);

      switch (result.status) {
        case UpdateListStatus.OK:
          return res.status(HttpStatus.OK).send()
        case UpdateListStatus.LIST_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.LIST_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async getListAction(req: Request, res: Response) {
    try {
      const result = await this.listService.getList(req.params.listId);

      switch (result.status) {
        case GetListStatus.OK:
          return res.send(result.list)
        case GetListStatus.LIST_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.LIST_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async getListTasksAction(req: Request, res: Response) {
    try {
      const { listId } = req.params
      const tasks = await this.listProvider.getListTasks(listId)

      return res.status(HttpStatus.OK).send(tasks)
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async addFollowerAction(req: Request, res: Response) {
    try {
      const result = await this.listService.addListFollower(req.params.listId, req.params.userId)

      switch (result.status) {
        case AddListFollowerStatus.OK:
          return res.status(HttpStatus.OK).send()
        case AddListFollowerStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND]);
        case AddListFollowerStatus.USER_ALREADY_FOLLOWING_LIST:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_FOLLOWING_LIST]);
        case AddListFollowerStatus.LIST_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.LIST_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async removeFollowerAction(req: Request, res: Response) {
    try {
      const result = await this.listService.removeListFollower(req.params.listId, req.params.userId)

      switch (result.status) {
        case RemoveListFollowerStatus.OK:
          return res.send();
        case RemoveListFollowerStatus.LIST_FOLLOWER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.LIST_FOLLOWER_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }

    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async copyListAction(req: Request, res: Response) {
    try {
      const { sourceListId } = req.params
      const { userId } = req.heyspace.authResult
      const { name, order, newListId } = req.body
      const result = await this.listService.copyListWithTasks(sourceListId, userId, null, name, order, newListId)

      switch (result.status) {
        case CopyListStatus.OK:
          return res.send({ id: result.newTaskListId });
        case CopyListStatus.LIST_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.LIST_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }

    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async moveAllTasksInListAction(req: Request, res: Response) {
    try {
      const { sourceListId } = req.params
      const { destinationListId } = req.body

      const result = await this.listService.moveAllTasksInList(sourceListId, destinationListId, req.heyspace.authResult.userId)

      switch (result.status) {
        case MoveAllTasksInListStatus.OK:
          return res.send();
        case MoveAllTasksInListStatus.SOURCE_LIST_NOT_FOUND:
        case MoveAllTasksInListStatus.DESTINATION_LIST_NOT_FOUND:
          // Both  results return the same response
          return res.send(ErrorDefinitions[Type.LIST_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }

    } catch (error) {
      logger(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }
}
