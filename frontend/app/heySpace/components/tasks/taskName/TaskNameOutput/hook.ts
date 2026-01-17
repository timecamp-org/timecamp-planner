import { Id } from "common/utils/identifier"
import { selectTaskName } from "common/models/domain/TasksModel/selectors"
import { selectTaskSearchValue } from "common/models/component/SearchModel/selectors/domain"
import { useSelector } from 'common/hooks/useSelector'

export type TaskNameOutputHookInterface = {
  taskName: string,
  searchPhrase: string,
}

export function useComponent(taskId: Id): TaskNameOutputHookInterface {
  return {
    taskName: useSelector(state => selectTaskName(state, { taskId })),
    searchPhrase: useSelector(state => selectTaskSearchValue(state)),
  }
}
