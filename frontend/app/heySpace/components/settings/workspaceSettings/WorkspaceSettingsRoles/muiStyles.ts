import { SxProps } from '@mui/material';

export const buttonStyles: SxProps = {
  padding: '0 1rem',
  lineHeight: 'unset',
  '&:hover svg': {
    color: 'var(--color-primary-500)',
  },
  fontSize: 'var(--fontSize-sm)',
};

export const tableHeadRowStyles: SxProps = {
  'td, th': { border: 0 },
  borderTop: 0,
  borderBottom: '1px solid var(--color-primary-500)',
  fontSize: 'var(--fontSize-base)',
};

export const tableBodyStyles: SxProps = {
  '& .MuiTableRow-root': {
    cursor: 'pointer',
    background: 'var(--color-white)',
    '&:hover': { backgroundColor: 'var(--color-gray-100)' },
  },
  minWidth: 650,
};

export const tableBodyRowStyles: SxProps = {
  'td, th': { border: 0, fontSize: 'var(--fontSize-sm)', padding: '1.2rem' },
  borderTop: 0,
  lineHeight: 'unset',
};

export const tableBodyCellStyles: SxProps = {
  paddingLeft: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginLeft: 'auto',
};

export const addedJobRowStyles: SxProps = {
  'td, th': { border: 0, padding: '1.2rem' },
  borderTop: 0,
  '& *': { fontSize: 'var(--fontSize-sm)' },
};

export const addedJobCellStyles: SxProps = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '1rem',
};

export const addJobTitleButtonStyles: SxProps = {
  color: 'var(--color-gray-500)',
  display: 'flex',
  gap: '1rem',
  padding: '1.2rem',
  cursor: 'pointer',
  '&:hover': {
    color: 'var(--color-primary-500)',
  },
};
