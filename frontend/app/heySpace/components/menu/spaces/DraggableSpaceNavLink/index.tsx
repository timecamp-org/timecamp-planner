import { FC, memo } from 'react';

import { Draggable } from '@hello-pangea/dnd';

import { Id } from 'common/utils/identifier';
import { GripDotsVertical } from 'commonComponents/Icons/fontawesome/GripDotsVertical';

import SpaceNavLink from '../SpaceNavLink';

import styles from './styles.css';

export type DraggableSpaceNavLinkInterface = {
  className?: string;
  spaceId: Id;
  index: number;
  isSelected: boolean;
  nameMaxLength?: number;
};

const DraggableSpaceNavLink: FC<DraggableSpaceNavLinkInterface> = ({
  spaceId,
  index,
  isSelected,
  className,
  nameMaxLength = 23,
}) => (
  <Draggable draggableId={spaceId} index={index} key={spaceId}>
    {(provided) => (
      <div
        className={styles.component}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={provided.draggableProps.style}
      >
        <GripDotsVertical className={styles.moveIcon} width="8" />
        <SpaceNavLink className={className} spaceId={spaceId} isSelected={isSelected} maxTextLength={nameMaxLength} />
      </div>
    )}
  </Draggable>
);

export default memo(DraggableSpaceNavLink);
