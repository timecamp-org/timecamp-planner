import { Id } from "../../../common/identifier";
import {
  TrelloBoard,
  TrelloList,
  TrelloTag,
  TrelloTaskWithChecklistData,
} from '../types'

export interface TrelloApiInterface {

  fetchUserBoardsData(organizationId: Id, userId: Id): PromiseLike<TrelloBoard[]>

  fetchBoardLabelsData(boardId: Id, organizationId: Id, userId: Id): PromiseLike<TrelloTag[]>

  fetchBoardListsData(boardId: Id, organizationId: Id, userId: Id): PromiseLike<TrelloList[]>

  fetchBoardCardsData(boardId: Id, organizationId: Id, userId: Id, limit?: number, beforeCardId?: Id): PromiseLike<TrelloTaskWithChecklistData[]>

}
