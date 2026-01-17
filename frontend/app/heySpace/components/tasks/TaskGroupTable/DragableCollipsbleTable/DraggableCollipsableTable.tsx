/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/ban-types */
import { FC, useLayoutEffect, useRef, useState } from 'react';

import { Collapse } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Droppable } from '@hello-pangea/dnd';

import { DraggableType } from 'components/App/useDragDrop';

import styles from './styles.css';
import { DraggableCollapsibleTableInterface } from './types';

export const DraggableCollapsibleTable: ReactFCWithChildren<DraggableCollapsibleTableInterface> = ({
  headers,
  rows,
  tableId,
  isOpen,
  children,
}) => {
  const headRef = useRef<HTMLTableSectionElement>();
  const [collapsedSize, setCollapsedSize] = useState(0);

  useLayoutEffect(() => {
    if (headRef.current) {
      setCollapsedSize(headRef.current.clientHeight + 4 || 50);
    }
  }, [headRef.current]);

  return (
    <Collapse in={isOpen} collapsedSize={collapsedSize}>
      <Droppable direction="vertical" droppableId={tableId} type={DraggableType.TASK}>
        {({ droppableProps, innerRef }) => (
          <TableContainer component={Paper} className={styles.table}>
            <Table>
              <TableHead ref={headRef}>
                <tr className={styles.headerRow}>{headers}</tr>
              </TableHead>
              <TableBody ref={innerRef} {...droppableProps}>
                {rows}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Droppable>
      {children}
    </Collapse>
  );
};
