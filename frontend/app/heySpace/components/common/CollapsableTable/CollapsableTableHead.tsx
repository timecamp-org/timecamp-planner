import styled from 'styles/styled';
import { TableCell, TableHead, TableRow } from '@mui/material';
import ChevronDecider from 'commonComponents/ChevronDecider/ChevronDecider';
import { CollapsableTableInterface } from './types';

const TableCellHeader = styled.span<{ $isFirst: boolean; $isOpen: boolean }>`
  color: blueGreyColor;
  font-weight: boldFontWeight;
  text-transform: uppercase;
  cursor: ${({ $isFirst }) => ($isFirst ? 'pointer' : '')};
  visibility: ${({ $isOpen, $isFirst }) => (!$isOpen && !$isFirst ? 'hidden' : '')};
`;
const tableHeadRowStyles = {
  'td, th': {
    border: 0,
    fontSize: 'var(--fontSize-base)',
    borderBottom: '1px solid var(--color-primary-500)',
  },
  borderTop: 0,
};
type CollapsableTableHeadType<T> = Pick<CollapsableTableInterface<T>, 'onToggle' | 'isOpen' | 'columns' | 'count'>;

const CollapsableTableHead = <T extends unknown>({ onToggle, isOpen, count, columns }: CollapsableTableHeadType<T>) => {
  return (
    <TableHead>
      <TableRow sx={tableHeadRowStyles}>
        {columns.map(({ label = '' }, index) => {
          const isFirst = index === 0;
          return (
            <TableCell key={index} onClick={isFirst ? onToggle : null}>
              <TableCellHeader $isFirst={isFirst} $isOpen={isOpen}>
                {isFirst && <ChevronDecider direction={isOpen ? 'up' : 'down'} />}
                {label}
                {isFirst && count ? ` (${count})` : ''}
              </TableCellHeader>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default CollapsableTableHead;
