import { Box, Button, ButtonGroup, Menu, SxProps } from '@mui/material';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { FC, ReactNode, useState } from 'react';
import DropdownMenuItem, { DropdownMenuItemInterface } from './DropdownMenuItem';

interface DropdownMenuInterface {
  items: { label: ReactNode; props: DropdownMenuItemInterface }[];
  label: ReactNode;
}

const wrapperStyles: SxProps = {
  marginLeft: '3rem',
};

const buttonStyles: SxProps = {
  padding: '0.25rem 1.5rem',
};

const DropdownMenu: FC<DropdownMenuInterface> = ({ items, label }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = !!anchorEl;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={wrapperStyles}>
      <ButtonGroup onClick={handleClick}>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          disableRipple
          sx={buttonStyles}
        >
          {label}
        </Button>
        <Button disableRipple>
          <ChevronDown />
        </Button>
      </ButtonGroup>

      <Menu
        aria-labelledby="bulk-edit-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {items.map(({ label, props: { onClick, disabled } }, index) => (
          <DropdownMenuItem
            key={index}
            disabled={disabled}
            onClick={() => {
              handleClose();
              onClick?.();
            }}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default DropdownMenu;
