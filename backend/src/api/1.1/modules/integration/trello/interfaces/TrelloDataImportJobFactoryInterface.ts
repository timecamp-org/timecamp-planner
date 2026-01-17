import { Id } from '../../../common/identifier'
import {
  TrelloImportBoardCardsJobInterface,
  TrelloImportBoardJobInterface,
  TrelloImportBoardLabelsJobInterface,
  TrelloImportBoardListsJobInterface,
  TrelloImportCardJobInterface,
  TrelloImportListJobInterface,
  TrelloImportRootJobInterface,
} from '../types'

export interface TrelloDataImportJobFactoryInterface {
  createRootJob(
    userId: Id, 
    organizationId: Id, 
    extensionId: Id,
  ): TrelloImportRootJobInterface

  createBoardLabelsImportJob(
    boardId: Id,
    userId: Id,
    organizationId: Id,
    extensionId: Id
  ): TrelloImportBoardLabelsJobInterface

  createBoardListsImportJob(
    userId: Id,
    organizationId: Id,
    extensionId: Id,
    boardId: Id,
  ): TrelloImportBoardListsJobInterface

  createBoardCardsImportJob(
    userId: Id,
    organizationId: Id,
    extensionId: Id,
    boardId: string,
    cardId?: string,
  ): TrelloImportBoardCardsJobInterface

  createBoardImportJob(
    userId: Id,
    organizationId: Id,
    extensionId: Id,
    boardId: Id,
  ): TrelloImportBoardJobInterface

  createListImportJob(
    userId: Id,
    organizationId: Id,
    extensionId: Id,
    listId: Id,
  ): TrelloImportListJobInterface

  createCardImportJob(
    userId: Id,
    organizationId: Id,
    extensionId: Id,
    cardId: Id,
  ): TrelloImportCardJobInterface
}