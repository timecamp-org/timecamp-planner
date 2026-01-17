import { Id } from 'common/utils/identifier'
import { List, Map } from 'immutable'
import { ImmutableMap } from 'common/types'

export interface ChecklistItemInterface {
  id: Id,
  name: string,
  isChecked: boolean,
  order: number,
  wasJustCreated?: boolean,
}

export interface ChecklistsState extends ImmutableMap<string, any> {
  checklistItemsData: Map<Id, ChecklistItemInterface>,
  checklistsByTaskId: Map<Id, List<Id>>,
  checklistItemPeopleIds: Map<Id, List<Id>>,
  taskIdByChecklistItemId: Map<Id, Id>,
}

export interface ChecklistItemBasicData {
  id: Id,
  isChecked: boolean,
  taskId: Id,
}

export type ChecklistItemPropType = ChecklistItemInterface[keyof ChecklistItemInterface]