import { Id } from '../../common/identifier'
import queryString = require('query-string')

const hostName = 'https://api.trello.com/1'

export const getFetchUserBoardsDataUrl = (boardsFilter = TrelloBoardsFilter.OPEN) => `${hostName}/members/me/boards?${queryString.stringify({filter: boardsFilter, fields: ['id', 'name', 'closed', 'prefs']}, { arrayFormat: 'comma' })}`

export const getFetchBoardLabelsDataUrl = (boardId: Id) => `${hostName}/boards/${boardId}/labels`

export const getFetchBoardListsDataUrl = (boardId: Id) => `${hostName}/boards/${boardId}/lists?${queryString.stringify({cards: 'none', fields: ['id', 'idBoard', 'name', 'pos']}, { arrayFormat: 'comma' })}`

export const getFetchBoardCardsDataUrl = (boardId: Id, limit = 1, beforeCardId?: Id) => `${hostName}/boards/${boardId}/cards/open?${queryString.stringify({limit, before: beforeCardId, checklists: 'all', fields: ['id', 'idList', 'idBoard', 'idLabels', 'closed', 'desc', 'due', 'name', 'pos']}, { arrayFormat: 'comma' })}`

export enum TrelloBoardsFilter {
  ALL = 'all',
  CLOSED = 'closed',
  MEMBERS = 'members',
  OPEN = 'open',
  ORGANIZATION = 'organization',
  PUBLIC = 'public',
  STARRED = 'starred',
}