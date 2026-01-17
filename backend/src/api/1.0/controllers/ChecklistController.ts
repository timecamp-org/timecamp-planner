import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { ChecklistModule } from '../modules/checklist/ChecklistModule'
import { ChecklistItemServiceInterface } from '../modules/checklist/ChecklistItemServiceInterface'
import { LoggerInterface } from '../../../infrastructure/logger'
import ErrorDefinitions, { Type } from '../modules/common/ErrorDefinitions'
import {
  AddChecklistItemAssigneeStatus,
  CreateChecklistItemStatus, DeleteChecklistItemStatus,
  RemoveChecklistItemAssigneeStatus, UpdateChecklistItemStatus, CheckListItemJson,
} from '../modules/checklist/types'
import { HttpStatus } from '../../../infrastructure/enum'
import { omit } from 'lodash'
import { ChecklistItemProviderInterface } from '../modules/checklist/ChecklistItemProviderInterface'
import { CommonModule } from '../modules/common/CommonModule'
import { Id, IdGeneratorInterface } from '../modules/common/identifier'
import { InfrastructureModule } from '../../../infrastructure/InfrastructureModule'

@injectable()
export class ChecklistController {

  constructor(
    @inject(ChecklistModule.ChecklistItemServiceInterface)
      private checklistItemService: ChecklistItemServiceInterface,
    @inject(ChecklistModule.ChecklistItemProviderInterface)
      private checklistItemProvider: ChecklistItemProviderInterface,
    @inject(CommonModule.IdGeneratorInterface)
      private idGenerator: IdGeneratorInterface<Id>,
    @inject(InfrastructureModule.LoggerInterface)
      private logger: LoggerInterface,
  ) {}


  async createChecklistItemAction(req: Request, res: Response) {
    try {

      const checkListItemId = req.params.checkListItemId || this.idGenerator.generateId()
      const result = await this.checklistItemService.createChecklistItem(checkListItemId, req.params.taskId, req.body)

      switch (result.status) {
        case CreateChecklistItemStatus.OK:
          return res.send(result.checklistItem);
        case CreateChecklistItemStatus.CHECKLIST_ITEM_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.CHECKLIST_ITEM_ALREADY_EXISTS]);
        case CreateChecklistItemStatus.TASK_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.TASK_NOT_FOUND]);
        case CreateChecklistItemStatus.CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS:
          return res.send(ErrorDefinitions[Type.CHECKLIST_ITEM_WITH_ORDER_ALREADY_EXISTS]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async getChecklistItemAction(req: Request, res: Response) {
    try {

      const { checkListItemId } = req.params
      const checklistItem = await this.checklistItemProvider.getChecklistItem(checkListItemId)

      if (!checklistItem) {
        return res.send(ErrorDefinitions[Type.CHECKLIST_ITEM_NOT_FOUND])
      }

      return res.send(checklistItem)
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async updateChecklistItemAction(req: Request, res: Response) {
    try {
      const result = await this.checklistItemService.updateChecklistItem(
        req.params.checkListItemId,
        req.params.taskId,
        omit(req.body, 'updatedAt') as CheckListItemJson,
        req.body.updatedAt
      )

      switch (result.status) {
        case UpdateChecklistItemStatus.OK:
          return res.send();
        case UpdateChecklistItemStatus.CHECKLIST_ITEM_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.CHECKLIST_ITEM_NOT_FOUND]);
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL]);
      }
    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async deleteChecklistItemAction(req: Request, res: Response) {
    try {
      const result = await this.checklistItemService.deleteChecklistItem(req.params.checkListItemId)

      switch (result.status) {
        case DeleteChecklistItemStatus.OK:
          return res.status(HttpStatus.OK).send()
        case DeleteChecklistItemStatus.CHECKLIST_ITEM_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.CHECKLIST_ITEM_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }

    } catch (error) {
      this.logger.error(error)
      return res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async addChecklistItemAssigneeAction(req: Request, res: Response) {
    try {
      const actorId = req.heyspace.authResult.userId
      const { checklistItemId, userId } = req.params

      const result = await this.checklistItemService.addChecklistItemAssignee(checklistItemId, userId, actorId)

      switch (result.status) {
        case AddChecklistItemAssigneeStatus.OK:
          return res.status(HttpStatus.OK).send()
        case AddChecklistItemAssigneeStatus.USER_ALREADY_ASSIGNED:
          return res.send(ErrorDefinitions[Type.USER_ALREADY_IN_CHECKLIST_ITEM])
        case AddChecklistItemAssigneeStatus.CHECKLIST_ITEM_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.CHECKLIST_ITEM_NOT_FOUND])
        case AddChecklistItemAssigneeStatus.USER_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.USER_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }

    } catch (error) {
      this.logger.error(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

  async removeChecklistItemAssigneeAction(req: Request, res: Response) {
    try {
      const actorId = req.heyspace.authResult.userId
      const { checklistItemId, userId } = req.params

      const result = await this.checklistItemService.removeChecklistItemAssignee(checklistItemId, userId, actorId)

      switch (result.status) {
        case RemoveChecklistItemAssigneeStatus.OK:
          return res.status(HttpStatus.OK).send()
        case RemoveChecklistItemAssigneeStatus.CHECKLIST_ITEM_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.CHECKLIST_ITEM_NOT_FOUND])
        case RemoveChecklistItemAssigneeStatus.CHECKLIST_ASSIGNEE_NOT_FOUND:
          return res.send(ErrorDefinitions[Type.CHECKLIST_ASSIGNEE_NOT_FOUND])
        default:
          return res.send(ErrorDefinitions[Type.INTERNAL])
      }

    } catch (error) {
      this.logger.error(error)
      res.send(ErrorDefinitions[Type.INTERNAL])
    }
  }

}