import { Id } from 'common/utils/identifier'
import React, { FC } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import styles from './styles.css'
import SpaceGroup from '../SpaceGroup'

export type DraggableSpaceGroupInterface = {
  groupId: Id,
  index: number,
}

const defaultProps = {
}

const DraggableSpaceGroup: FC<DraggableSpaceGroupInterface> = ({
  groupId,
  index,
}) => (
  <Draggable
    draggableId={groupId}
    index={index}
    key={groupId}
  >
    {(provided) => (
      <div
        className={styles.component}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={provided.draggableProps.style}
      >
        <SpaceGroup
          groupId={groupId}
        />
      </div>
    )}
  </Draggable>
)

DraggableSpaceGroup.defaultProps = defaultProps

export default DraggableSpaceGroup
