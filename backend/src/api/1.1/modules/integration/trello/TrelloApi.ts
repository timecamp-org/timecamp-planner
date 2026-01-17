import { TrelloApiInterface } from "./interfaces/TrelloApiInterface";
import { injectable, inject } from "inversify";
import { Id } from "../../common/identifier";
import { OAuth1AuthorizedApplication } from "../../oauth1/types";
import { OAuth1ClientServiceInterface } from "../../oauth1/interfaces/OAuth1ClientServiceInterface";
import {
  TrelloBoard,
  TrelloList,
  TrelloTag,
  TrelloTaskWithChecklistData,
} from './types'
import { OAuth1Module } from "../../oauth1/OAuth1Module";
import {
  getFetchBoardCardsDataUrl,
  getFetchBoardLabelsDataUrl,
  getFetchBoardListsDataUrl,
  getFetchUserBoardsDataUrl,
} from './apiUrls'

@injectable()
export class TrelloApi implements TrelloApiInterface {

  constructor(
    @inject(OAuth1Module.OAuth1ClientServiceInterface)
      protected oauth1ClientService: OAuth1ClientServiceInterface,
  ) {}

  async fetchUserBoardsData(organizationId: Id, userId: Id): Promise<TrelloBoard[]> {
    return await this.oauth1ClientService.getOAuth1ProtectedResource(
      OAuth1AuthorizedApplication.TRELLO,
      organizationId,
      userId,
      getFetchUserBoardsDataUrl(),
    )
  }

  async fetchBoardLabelsData (boardId: Id, organizationId: Id, userId: Id): Promise<TrelloTag[]> {
    return await this.oauth1ClientService.getOAuth1ProtectedResource(
      OAuth1AuthorizedApplication.TRELLO,
      organizationId,
      userId,
      getFetchBoardLabelsDataUrl(boardId),
    )
  }

  async fetchBoardListsData(boardId, organizationId: Id, userId: Id): Promise<TrelloList[]> {
    return await this.oauth1ClientService.getOAuth1ProtectedResource(
      OAuth1AuthorizedApplication.TRELLO,
      organizationId,
      userId,
      getFetchBoardListsDataUrl(boardId),
    )
  }

  async fetchBoardCardsData(boardId, organizationId: Id, userId: Id, limit?: number, beforeCardId?: Id): Promise<TrelloTaskWithChecklistData[]> {
    return await this.oauth1ClientService.getOAuth1ProtectedResource(
      OAuth1AuthorizedApplication.TRELLO,
      organizationId,
      userId,
      getFetchBoardCardsDataUrl(boardId, limit, beforeCardId),
    )
  }
}
