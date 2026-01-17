import React from 'react'
import PropTypes from 'prop-types'
import { Draggable } from '@hello-pangea/dnd'

import ChecklistItem from 'components/tasks/taskCheckList/ChecklistItem'

DraggableChecklistItem.propTypes = {
  taskId: PropTypes.string.isRequired,
  checklistItemId: PropTypes.string.isRequired,
}

function DraggableChecklistItem(props) {
  return (
    <Draggable
      draggableId={props.checklistItemId}
      index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
        >
          <ChecklistItem
            color={props.color}
            checklistItemId={props.checklistItemId}
            taskId={props.taskId}
            onDeleteChecklistItemCallback={props.onDeleteChecklistItemCallback}
          />
        </div>
      )}
    </Draggable>
  )
}

export default DraggableChecklistItem
