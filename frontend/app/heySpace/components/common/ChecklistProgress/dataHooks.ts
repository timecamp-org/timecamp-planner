import { Id } from 'common/utils/identifier'
import { useSelector } from 'react-redux'
import { selectTaskColor } from 'models/domain/TasksModel/selectors'
import {
  selectTaskChecklistItemsCount,
  selectTaskDoneChecklistItemsCount
} from 'models/domain/ChecklistsModel/selectors/domain'

export type DataProviderHook = {
  itemsDone: number,
  itemsTotal: number,
  color: string,
}
export const useDataProvider = (taskId: Id): DataProviderHook => {
  const itemsDone = useSelector(state => selectTaskDoneChecklistItemsCount(state, { taskId }))
  const itemsTotal = useSelector(state => selectTaskChecklistItemsCount(state, { taskId }))
  const color = useSelector(state => selectTaskColor(state, { taskId }))

  return {
    itemsDone,
    itemsTotal,
    color,
  }
}
