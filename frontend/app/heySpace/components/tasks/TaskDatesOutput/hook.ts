import { TaskDatesOutputInterface } from './index'
import { useSelector } from 'common/hooks/useSelector'
import { selectTaskColor, selectTaskDueDate, selectTaskStartDate } from 'models/domain/TasksModel/selectors'
import format from 'date-fns/format'

export type TaskDatesOutputHookInterface = {
  color: string,
  startDateString?: string,
  dueDateString?: string,
}

const useComponent = (props: TaskDatesOutputInterface): TaskDatesOutputHookInterface => {
  const startDateTimestamp = useSelector(state => selectTaskStartDate(state, { taskId: props.taskId }))
  const dueDateTimestamp = useSelector(state => selectTaskDueDate(state, { taskId: props.taskId }))
  const color = useSelector(state => selectTaskColor(state, { taskId: props.taskId }))

  return {
    color,
    startDateString: format(startDateTimestamp, 'DD.MM'),
    dueDateString: format(dueDateTimestamp, 'DD.MM'),
  }
}

export default useComponent
