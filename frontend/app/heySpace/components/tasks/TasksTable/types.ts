import { TableCellProps, ColumnProps } from 'react-virtualized';
export enum TaskTableColumn {
  NAME = 'name',
  ASSIGN = 'assign',
  DATE = 'date',
  PROGRESS = 'progress',
  SPACE = 'space',
  LIST = 'list',
  TAGS = 'tags',
  PRIORITIES = 'priorities',
}

export interface ColumnConfig {
  isVisible?: boolean;
  isSortable?: boolean;
  props?: Partial<ColumnProps>;
}

export type ColumnsConfig = { [key in TaskTableColumn]?: ColumnConfig };
