import React from 'react'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import styles from './styles.css'
import { Droppable } from '@hello-pangea/dnd'
import { doNothing } from 'common/utils'

import DraggableChecklistItem from 'components/tasks/taskCheckList/DraggableChecklistItem'

const emptyList = List()

TaskChecklist.propTypes = {
  className: PropTypes.string,
  taskId: PropTypes.string.isRequired,
  checklistItemsIds: ImmutablePropTypes.list,

  onDeleteChecklistItemCallback: PropTypes.func,
}

TaskChecklist.defaultProps = {
  checklistItemsIds: emptyList,

  onDeleteChecklistItemCallback: doNothing,
}

function TaskChecklist(props) {
  return (
    <Droppable
      droppableId={props.taskId}
      type={'CHECKLIST'}>
      {(provided) => (
        <div
          className={props.className || styles.component}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {props.checklistItemsIds.map(renderDraggableChecklistItem)}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )

  function renderDraggableChecklistItem(checklistItemId, index) {
    return (<DraggableChecklistItem
      key={checklistItemId}
      color={props.color}
      checklistItemId={checklistItemId}
      taskId={props.taskId}
      index={index}
      onDeleteChecklistItemCallback={props.onDeleteChecklistItemCallback}
    />)
  }
}

export default TaskChecklist
