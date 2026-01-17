import { SxProps, TableContainer } from '@mui/material';
import Table from '@mui/material/Table';

import CollapsableTableBody from './CollapsableTableBody';
import CollapsableTableHead from './CollapsableTableHead';
import { CollapsableTableInterface } from './types';

const tableStyles: SxProps = {
  minWidth: 650,
};

const CollapsableTable = <T extends unknown>(props: CollapsableTableInterface<T>) => {
  const { columns, maxHeight = '30rem' } = props;
  return (
    <TableContainer style={{ maxHeight }}>
      <Table stickyHeader sx={tableStyles} size="small" aria-label="job title table">
        <colgroup>
          {columns.map(({ width }, index) => (
            <col key={index} style={{ width }}></col>
          ))}
        </colgroup>
        <CollapsableTableHead {...props} />
        <CollapsableTableBody {...props} />
      </Table>
    </TableContainer>
  );
};

export default CollapsableTable;
