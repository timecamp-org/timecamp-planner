import { SxProps, TableBody, TableCell, TableRow } from '@mui/material';
import { CollapsableTableInterface } from './types';

const tableBodyRowStyles = {
  'td, th': { border: 0, fontSize: 'unset' },

  borderTop: 0,
  fontSize: 'unset',
};

const tableBodyStyles: SxProps = {
  '& .MuiTableRow-root': {
    cursor: 'pointer',
    background: 'var(--color-white)',
    '&:hover': { backgroundColor: 'var(--color-gray-100)' },
  },
  minWidth: 650,
};

type CollapsableTableBodyType<T> = Pick<CollapsableTableInterface<T>, 'columns' | 'records' | 'isOpen' | 'extractKey'>;

const CollapsableTableBody = <T extends unknown>({
  isOpen,
  records,
  columns,
  extractKey,
}: CollapsableTableBodyType<T>) => {
  if (!isOpen) {
    return null;
  }
  return (
    <TableBody sx={tableBodyStyles}>
      <>
        {records.map((record) => (
          <TableRow hover key={extractKey(record)} sx={tableBodyRowStyles}>
            {columns.map(({ renderCell, props = {} }, index) => {
              return (
                <TableCell {...props} style={{ ...(props.style || {}) }} key={index}>
                  {renderCell(record)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </>
    </TableBody>
  );
};

export default CollapsableTableBody;
