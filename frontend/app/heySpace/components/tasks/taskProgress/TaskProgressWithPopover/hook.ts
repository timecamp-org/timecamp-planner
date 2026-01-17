import { selectTaskColor, selectTaskProgressEstimate } from 'models/domain/TasksModel/selectors'
import { useSelector } from 'react-redux'
import useElementOpen from 'common/hooks/useElementOpen'
import { TaskProgressWithPopoverInterface } from '.'
import { useCallback } from 'react'

export type TaskProgressWithPopoverHookInterface = {
  taskColor: string,
  taskProgress: number,
  isOpen: boolean,
  onClosePopover: VoidFunction,
  onClick: VoidFunction,
}

export function useComponent(props: TaskProgressWithPopoverInterface): TaskProgressWithPopoverHookInterface {
  const { isOpen, onClose, onToggleOpen } = useElementOpen()

  const onClosePopover = useCallback(() => {
    props.onSetIsPopoverOpen(false)
    onClose()
  }, [])

  const onClick = useCallback(() => {
    props.onSetIsPopoverOpen(!isOpen)
    onToggleOpen()
  }, [isOpen, onToggleOpen])

  return {
    taskColor: useSelector(state => selectTaskColor(state, { taskId: props.taskId })),
    taskProgress: useSelector(state => selectTaskProgressEstimate(state, { taskId: props.taskId })),
    isOpen,
    onClosePopover,
    onClick,
  }
}
