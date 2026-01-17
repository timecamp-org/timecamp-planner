import { i18mark } from 'common/i18n';

import { convertFilteredData } from './helpers';
import {
  getRenderSelectCell,
  renderActionsCell,
  renderDateCell,
  renderFileNameCell,
  renderLocationCell,
  renderSelectHeader,
  renderUploadedByCell,
} from './tableCells';
import { ColumnConfig, FileTableColumn } from './types';

export const useSpaceFileListViewColumns = ({ filteredData, selectedFiles, setSelectedFiles }) => {
  const selectableFiles = filteredData.map(convertFilteredData);
  const allIdsSelected = selectedFiles.length === filteredData.length;

  const defaultColumConfig: ColumnConfig[] = [
    {
      key: FileTableColumn.SELECT,
      isVisible: true,
      isSortable: false,
      width: 50,
      headerKey: renderSelectHeader({ selectableFiles, setSelectedFiles, allIdsSelected }),
      cellRenderer: getRenderSelectCell({ selectedFiles, setSelectedFiles }),
    },
    {
      key: FileTableColumn.NAME,
      isVisible: true,
      isSortable: false,
      width: 600,
      headerKey: '',
      cellRenderer: renderFileNameCell,
    },
    {
      key: FileTableColumn.UPLOADED_BY,
      isVisible: true,
      isSortable: false,
      width: 500,
      headerKey: i18mark('Uploaded by'),
      cellRenderer: renderUploadedByCell,
    },
    {
      key: FileTableColumn.DATE,
      isVisible: true,
      isSortable: true,
      width: 500,
      headerKey: i18mark('Date'),
      cellRenderer: renderDateCell,
    },
    {
      key: FileTableColumn.LOCATION,
      isVisible: true,
      isSortable: false,
      width: 400,
      headerKey: <div style={{ paddingLeft: '2rem' }}>{i18mark('Location')}</div>,
      cellRenderer: renderLocationCell,
    },
    {
      key: FileTableColumn.ACTIONS,
      isVisible: true,
      isSortable: false,
      width: 200,
      headerKey: '',
      cellRenderer: renderActionsCell,
    },
  ];

  return defaultColumConfig;
};
