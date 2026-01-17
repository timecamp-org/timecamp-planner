import { ReactNode } from 'react';

import { TaskGroupBy } from './useTaskGroups';

export type CellRendererType = (taskId: string) => JSX.Element;

export interface ColumnConfigInterface {
  key: string;
  label: ReactNode;
  width: string;
  minWidth?: string;
  isSortable: boolean;
  className?: string;
  renderCell: CellRendererType;
}

export type TasksTableInterface = {
  taskIds: string[];
  groupId: string;
  groupBy: TaskGroupBy;
  filterId?: string;
  disableCollapse?: boolean;
};
