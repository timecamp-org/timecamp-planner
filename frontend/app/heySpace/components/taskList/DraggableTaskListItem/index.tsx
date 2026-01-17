import React, { memo } from 'react'
import styles from './styles.css'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric
} from '@hello-pangea/dnd'

import TaskListItem from '../TaskListItem'
import { Id } from 'common/utils/identifier'

type DraggableTaskListItemInterface = {
  taskId: Id,
  index: number,
}

const DraggableTaskListItem: React.FC<DraggableTaskListItemInterface> = (props) => (
  <Draggable
    draggableId={props.taskId}
    index={props.index}>
    {renderDraggableInner}
  </Draggable>
)

function renderDraggableInner(provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`${styles.draggableTasksListItem} ${snapshot.isDragging ? styles.hoverItem : undefined}`}
    >
      <TaskListItem
        taskId={rubric.draggableId}
      />
    </div>
  )
}

export default memo(DraggableTaskListItem)
