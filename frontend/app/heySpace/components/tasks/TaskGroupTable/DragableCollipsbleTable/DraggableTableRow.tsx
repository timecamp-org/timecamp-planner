import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import styles from './styles.css';
import { DraggableTableRowInterface } from './types';

export const DraggableTableRow: FC<DraggableTableRowInterface> = ({ itemRenderer, className, ...draggableProps }) => (
  <Draggable {...draggableProps}>
    {({ innerRef, draggableProps, dragHandleProps }, snapshot, rubric) => (
      <TableRow ref={innerRef} {...draggableProps} {...dragHandleProps} className={`${styles.row} ${className || ''}`}>
        {itemRenderer(rubric.draggableId)}
      </TableRow>
    )}
  </Draggable>
);
