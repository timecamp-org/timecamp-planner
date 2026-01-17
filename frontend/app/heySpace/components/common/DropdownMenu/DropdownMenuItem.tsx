import { Button, MenuItem, SxProps } from '@mui/material';
import { FC } from 'react';

export type DropdownMenuItemInterface = {
  disabled?: boolean;
  onClick: () => void;
};
const menuItemStyles: SxProps = {
  '&:hover': {
    background: 'var(--color-white)',
  },
  padding: '0 1rem',
  margin: 0,
};

const buttonStyles: SxProps = {
  flex: 1,
  width: '100%',
  gap: '1rem',
  justifyContent: 'flex-start',
  color: 'var(--color-gray-900)',
  fontWeight: 'var(--fontWeight-regular)',
  borderRadius: '5px',
  '&:hover': {
    background: 'var(--color-gray-100)',
  },
};

const DropdownMenuItem: ReactFCWithChildren<DropdownMenuItemInterface> = ({ children, ...props }) => (
  <MenuItem disableGutters sx={menuItemStyles} {...props}>
    <Button variant="text" sx={buttonStyles} disableRipple>
      {children}
    </Button>
  </MenuItem>
);

export default DropdownMenuItem;
