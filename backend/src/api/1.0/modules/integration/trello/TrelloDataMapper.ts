import { injectable, inject } from "inversify";
import { TrelloDataMapperInterface } from './interfaces/TrelloDataMapperInterface'
import {
  TrelloBoard,
  TrelloChecklist,
  TrelloChecklistItem,
  TrelloChecklistItemStatus,
  TrelloList,
  TrelloPermissionLevel,
  TrelloTag,
  TrelloTaskMinimalData,
} from './types'
import { ChecklistItemDbRow, ListDbRow, ProjectDbRow, ProjectType, TagDbRow, TaskDbRow } from '../../db/schema'
import { ExternalChecklist } from '../types'
import { CommonModule } from '../../common/CommonModule'
import { TimeServiceInterface } from '../../common/time/TimeServiceInterface'

@injectable()
export class TrelloDataMapper implements TrelloDataMapperInterface {

  constructor(
    @inject(CommonModule.TimeServiceInterface)
    private timeService: TimeServiceInterface,
  ) {}

  translateTrelloBoard(trelloProject: TrelloBoard): Partial<ProjectDbRow> {
    return {
      id: trelloProject.id,
      name: trelloProject.name,
      projectType: ProjectType.PROJECT,
      isPrivate: trelloProject.prefs.permissionLevel === TrelloPermissionLevel.PRIVATE,
    }
  }

  translateTrelloList(trelloList: TrelloList): Partial<ListDbRow> {
    return {
      id: trelloList.id,
      projectId: trelloList.idBoard,
      order: trelloList.pos,
      name: trelloList.name,
    }
  }

  translateTrelloTask(trelloTask: TrelloTaskMinimalData): Partial<TaskDbRow> {
    const dueDate = trelloTask.due ? this.timeService.getDateFromString(trelloTask.due) : null
    return {
      id: trelloTask.id,
      projectId: trelloTask.idBoard,
      taskListId: trelloTask.idList,
      order: trelloTask.pos,
      name: trelloTask.name,
      description: trelloTask.desc,
      dueDate,
    }
  }

  translateTrelloTag(trelloTag: TrelloTag): Partial<TagDbRow> {
    return {
      id: trelloTag.id,
      name: trelloTag.name,
    }
  }

  translateTrelloChecklist(trelloChecklist: TrelloChecklist): Partial<ExternalChecklist> {
    const checklistItems = trelloChecklist.checkItems
      .map(trelloChecklistItem => this.translateTrelloChecklistItem(trelloChecklistItem, trelloChecklist.idCard))

    return {
      id: trelloChecklist.id,
      name: trelloChecklist.name,
      projectId: trelloChecklist.idBoard,
      taskId: trelloChecklist.idCard,
      order: trelloChecklist.pos,
      checklistItems,
    }
  }

  translateTrelloChecklistItem(trelloChecklistItem: TrelloChecklistItem, taskId: string): Partial<ChecklistItemDbRow> {
    return {
      id: trelloChecklistItem.id,
      taskId,
      order: trelloChecklistItem.pos,
      name: trelloChecklistItem.name,
      isChecked: trelloChecklistItem.state === TrelloChecklistItemStatus.COMPLETE,
    }
  }
}