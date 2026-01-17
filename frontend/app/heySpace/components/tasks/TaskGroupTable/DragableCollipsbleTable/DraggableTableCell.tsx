import TableCell from '@mui/material/TableCell';

import styles from './styles.css';
import { DraggableTableCellInterface } from './types';

export const DraggableTableCell: ReactFCWithChildren<DraggableTableCellInterface> = ({ children, width, minWidth }) => (
  <TableCell sortDirection="desc" component="th" scope="row" className={styles.cell} width={width} style={{ minWidth }}>
    {children}
  </TableCell>
);
