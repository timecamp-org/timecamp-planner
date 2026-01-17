import {
  TrelloBoard,
  TrelloChecklist,
  TrelloChecklistItem,
  TrelloList,
  TrelloTag,
  TrelloTaskMinimalData,
} from '../types'
import { ChecklistItemDbRow, ListDbRow, ProjectDbRow, TagDbRow, TaskDbRow } from '../../../db/schema'
import { ExternalChecklist } from '../../types'

export interface TrelloDataMapperInterface {
  translateTrelloBoard(trelloProject: TrelloBoard): Partial<ProjectDbRow>
  translateTrelloList(trelloList: TrelloList): Partial<ListDbRow>
  translateTrelloTask(trelloTask: TrelloTaskMinimalData): Partial<TaskDbRow>
  translateTrelloTag(trelloTag: TrelloTag): Partial<TagDbRow>
  translateTrelloChecklist(trelloChecklist: TrelloChecklist): Partial<ExternalChecklist>
  translateTrelloChecklistItem(trelloChecklistItem: TrelloChecklistItem, taskId: string): Partial<ChecklistItemDbRow>
}