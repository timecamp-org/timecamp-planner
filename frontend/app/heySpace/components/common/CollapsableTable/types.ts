import { TableCellProps } from '@mui/material';
import { Iterable } from 'immutable';
import { ReactNode } from 'react';

export interface CollapsableColumnInterface<T extends unknown> {
  label?: ReactNode;
  width: string;
  renderCell: (row: T) => ReactNode;
  props?: TableCellProps;
}

export interface CollapsableTableInterface<T> {
  onIsEdited?: (selectedRow, targetRow) => boolean;
  isOpen: boolean;
  onToggle: () => void;
  columns: CollapsableColumnInterface<T>[];
  records: Iterable<number, T>;
  count?: ReactNode;
  maxHeight?: string;
  extractKey: (record: T) => string | number;
}
