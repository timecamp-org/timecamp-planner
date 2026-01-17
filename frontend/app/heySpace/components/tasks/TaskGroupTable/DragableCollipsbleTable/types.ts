import { ReactNode } from 'react';

export interface DraggableTableRowInterface {
  draggableId: string;
  index: number;
  isDragDisabled?: boolean;
  itemRenderer: (rubric: string) => JSX.Element;
  className?: string;
}

export interface DraggableCollapsibleTableInterface {
  tableId: string;
  isOpen: boolean;
  headers: JSX.Element | ReactNode;
  rows: JSX.Element[];
}

export interface DraggableTableCellInterface {
  width?: string;
  minWidth?: string;
}
