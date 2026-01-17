import { ReactNode, Dispatch, SetStateAction } from 'react';

import { TableCellProps } from 'react-virtualized/dist/es/Table';

import { Id } from 'common/utils/identifier';

export enum FileTableColumn {
  NAME = 'name',
  UPLOADED_BY = 'userId',
  DATE = 'createdAt',
  LOCATION = 'location',
  ACTIONS = 'actions',
  SELECT = 'select',
}

export type SelectedFileData = {
  id: Id;
  url: string;
  userId: Id;
  name: string;
};

export type SetSelectedFiles = Dispatch<SetStateAction<SelectedFileData[]>>;

export interface ColumnConfig {
  key: FileTableColumn;
  isVisible?: boolean;
  isSortable?: boolean;
  width?: number;
  cellRenderer: (props: FileTableCellInterface) => ReactNode;
  headerKey: ReactNode;
}

export interface FileTableCellInterface extends TableCellProps {
  rowData: FileData;
}

export interface SelectCellInterface extends FileTableCellInterface {
  selectedFiles: SelectedFileData[];
  setSelectedFiles: SetSelectedFiles;
}

export type FileData = {
  contentType: string;
  createdAt: number;
  height: number;
  id: Id;
  name: string;
  organizationId: string;
  size: number;
  status: string;
  url: string;
  userId: Id;
  width: number;
  taskId: Id;
  projectId?: Id;
};

export interface HeaderCellInterface {
  label: string | ReactNode;
  disableSort: boolean;
  dataKey: keyof FileData;
}

export type RenderColumnConfig = Omit<ColumnConfig, 'headerKey'> & {
  headerLabel: string;
};
