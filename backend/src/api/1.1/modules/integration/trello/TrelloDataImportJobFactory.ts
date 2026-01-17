import { TrelloDataImportJobFactoryInterface } from './interfaces/TrelloDataImportJobFactoryInterface'
import { inject, injectable } from 'inversify'
import {
  TrelloDataImportJobInterface,
  TrelloDataImportJobType,
  TrelloImportBoardCardsJobInterface,
  TrelloImportBoardJobInterface,
  TrelloImportBoardLabelsJobInterface,
  TrelloImportBoardListsJobInterface,
  TrelloImportCardJobInterface,
  TrelloImportListJobInterface,
  TrelloImportRootJobInterface,
} from './types'
import { CommonModule } from '../../common/CommonModule'
import { Id, IdGeneratorInterface } from '../../common/identifier'

@injectable()
export class TrelloDataImportJobFactory implements TrelloDataImportJobFactoryInterface {

  constructor(
    @inject(CommonModule.IdGeneratorInterface)
    private idGenerator: IdGeneratorInterface<Id>,
  ) {}

  private createBaseJob(
    type: TrelloDataImportJobType, 
    userId: Id, 
    organizationId: Id, 
    extensionId: Id,
  ): TrelloDataImportJobInterface {
    return {
      id: this.idGenerator.generateId(),
      type,
      userId,
      organizationId,
      extensionId
    }
  }

  createRootJob(userId: Id, organizationId: Id, extensionId: Id): TrelloImportRootJobInterface {
    const baseJob = this.createBaseJob(TrelloDataImportJobType.ROOT_JOB, userId, organizationId, extensionId)
    return {
      ...baseJob,
    }
  }

  createBoardLabelsImportJob(boardId: Id, userId: Id, organizationId: Id, extensionId: Id): TrelloImportBoardLabelsJobInterface {
    const baseJob = this.createBaseJob(TrelloDataImportJobType.BOARD_LABELS_IMPORT, userId, organizationId, extensionId)
    return {
      ...baseJob,
      boardId,
    }
  }

  createBoardListsImportJob(userId: Id, organizationId: Id, extensionId: Id, boardId: Id): TrelloImportBoardListsJobInterface {
    const baseJob = this.createBaseJob(TrelloDataImportJobType.BOARD_LISTS_IMPORT, userId, organizationId, extensionId)
    return {
      ...baseJob,
      boardId,
    }
  }

  createBoardCardsImportJob(userId: Id, organizationId: Id, extensionId: Id, boardId: Id, cardId?: string): TrelloImportBoardCardsJobInterface {
    const baseJob = this.createBaseJob(TrelloDataImportJobType.BOARD_CARDS_IMPORT, userId, organizationId, extensionId)
    return {
      ...baseJob,
      boardId,
      cardId,
    }
  }

  createBoardImportJob(boardId: Id, userId: Id, organizationId: Id, extensionId: Id): TrelloImportBoardJobInterface {
    const baseJob = this.createBaseJob(TrelloDataImportJobType.BOARD_IMPORT, userId, organizationId, extensionId)
    return {
      ...baseJob,
      boardId,
    }
  }

  createListImportJob(listId: Id, userId: Id, organizationId: Id, extensionId: Id): TrelloImportListJobInterface {
    const baseJob = this.createBaseJob(TrelloDataImportJobType.LIST_IMPORT, userId, organizationId, extensionId)
    return {
      ...baseJob,
      listId,
    }
  }

  createCardImportJob(cardId: Id, userId: Id, organizationId: Id, extensionId: Id): TrelloImportCardJobInterface {
    const baseJob = this.createBaseJob(TrelloDataImportJobType.CARD_IMPORT, userId, organizationId, extensionId)
    return {
      ...baseJob,
      cardId,
    }
  }

}