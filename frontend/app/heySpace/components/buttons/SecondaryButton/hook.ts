import { SecondaryButtonInterface } from '.'
import { useSelector } from 'common/hooks/useSelector'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors'
import { selectTaskColor } from 'models/domain/TasksModel/selectors'

export type SecondaryButtonHookInterface = {
  color?: string,
}

export default function useComponent(props: SecondaryButtonInterface): SecondaryButtonHookInterface {
  const projectColor = useSelector(state => selectProjectColor(state, { projectId: props.projectId }))
  const taskColor = useSelector(state => selectTaskColor(state, { taskId: props.taskId }))
  return {
    color: props.color || projectColor || taskColor
  }
}