import { Id } from '../../common/identifier'
import {
  DataImportQueueType,
  DataImportJobInterface,
  ExternalChecklist,
  ExternalEntityIdsByExternalEntityId,
} from '../types'
import { ListDbRow, ProjectDbRow, TagDbRow, TaskDbRow } from '../../db/schema'
import { UserInProjectJson } from '../../projects/types'

export type TrelloBoardRelatedObjects = {
  id: string,
  name: string,
  cards: TrelloTask[],
  lists: TrelloList[],
  checklists: TrelloChecklist[],
  labels: TrelloTag[],
}

export enum TrelloPermissionLevel {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export type TrelloBoardPrefferences = {
  permissionLevel: TrelloPermissionLevel,
}

export type TrelloBoard = {
  id: string,
  name: string,
  closed: boolean,
  prefs: TrelloBoardPrefferences,
}

export type TrelloTask = {
  id: string,
  checkItemStates?: any,
  closed: boolean,
  dateLastActivity: string,
  desc: string,
  descData?: any,
  dueReminder?: any,
  idBoard: string,
  idList: string,
  idMembersVoted: string[],
  idShort: number,
  idAttachmentCover?: string,
  idLabels: string[],
  manualCoverAttachment: boolean,
  name: string,
  pos: number,
  shortLink: string,
  badges: any,
  dueComplete: boolean,
  due?: string,
  idChecklists: string[],
  idMembers: string[],
  labels: TrelloTag[],
  shortUrl: string,
  subscribed: boolean,
  url: string,
}

export type TrelloTaskMinimalData = {
  id: string,
  name: string,
  idList: string,
  idBoard: string,
  idLabels: string[],
  due: string,
  desc: string,
  pos: number,
  closed: boolean,
}

export interface TrelloTaskWithChecklistData extends TrelloTaskMinimalData {
  checklists: TrelloChecklist[]
}

export type TrelloTag = {
  color: string,
  id: string,
  idBoard: string,
  name: string,
}

export type TrelloList = {
  id: string,
  name: string,
  closed: boolean,
  idBoard: string,
  pos: number,
  subscribed: boolean,
}

export type TrelloChecklist = {
  id: string,
  name: string,
  idBoard: string,
  idCard: string,
  pos: number,
  checkItems: TrelloChecklistItem[],
}

export type TrelloChecklistItem = {
  id: string,
  idChecklist: string,
  name: string,
  nameData: any,
  pos: number,
  state: TrelloChecklistItemStatus,
}

export enum TrelloChecklistItemStatus {
  COMPLETE = 'complete',
  INCOMPLETE = 'incomplete',
}

export enum TrelloDataImportJobType {
  ROOT_JOB = 'trello_root_job',
  BOARD_IMPORT = 'trello_board_import',
  BOARD_LABELS_IMPORT = 'trello_board_labels_import',
  BOARD_LISTS_IMPORT = 'trello_board_lists_import',
  BOARD_CARDS_IMPORT = 'trello_board_cards_import',
  LIST_IMPORT = 'trello_list_import',
  CARD_IMPORT = 'trello_card_import'
}

export type TrelloDataImportJobInterface = DataImportJobInterface<TrelloDataImportJobType>

export interface TrelloImportRootJobInterface extends TrelloDataImportJobInterface {
}

export interface TrelloImportBoardLabelsJobInterface extends TrelloDataImportJobInterface {
  boardId: Id,
}

export interface TrelloImportBoardListsJobInterface extends TrelloDataImportJobInterface {
  boardId: Id,
}

export interface TrelloImportBoardCardsJobInterface extends TrelloDataImportJobInterface {
  boardId: Id,
  cardId?: Id,
}

export interface TrelloImportBoardJobInterface extends TrelloDataImportJobInterface {
  boardId: Id,
}

export interface TrelloImportListJobInterface extends TrelloDataImportJobInterface {
  listId: Id,
}

export interface TrelloImportCardJobInterface extends TrelloDataImportJobInterface {
  cardId: Id,
}

export type TrelloDataImportQueueTypes = DataImportQueueType.TRELLO | DataImportQueueType.TRELLO_DELAYED

export interface TrelloRootExternalDataInterface {
  boardsData: TrelloBoard[],
}

export interface TrelloRootInternalDataInterface {
  projects: Partial<ProjectDbRow>[]
  projectPeople: UserInProjectJson[]
}

export interface TrelloBoardListsExternalDataInterface {
  listsData: TrelloList[]
}

export interface TrelloBoardListsInternalDataInterface {
  lists: Partial<ListDbRow>[]
}

export interface TrelloBoardLabelsExternalDataInterface {
  labelsData: TrelloTag[],
}

export interface TrelloBoardLabelsInternalDataInterface {
  tags: Partial<TagDbRow>[]
}

export interface TrelloBoardCardsExternalDataInterface {
  cardsData: TrelloTaskMinimalData[],
  checklistsData: TrelloChecklist[],
}

export interface TrelloBoardCardsInternalDataInterface {
  cards: Partial<TaskDbRow>[]
  externalChecklists: Partial<ExternalChecklist>[]
  externalTagIdsByExternalCardId: ExternalEntityIdsByExternalEntityId,
}

export interface TrelloError {
  data: string,
  statusCode: number,
}
