import { Box, Button, SxProps } from '@mui/material';
import styled from 'styles/styled';
import { UnderlinedDropdownInterface } from './types';
import { FC } from 'react';

const dropdownHeaderStyles: SxProps = {
  color: 'var(--color-gray-900)',
  borderBottom: '1px solid var(--color-gray-300)',
  padding: '0.5rem 1.5rem',
  whiteSpace: 'nowrap',
};

const DropdownItemButton = styled(Button)<{ $isSelected: boolean }>`
  color: ${({ $isSelected }) => ($isSelected ? 'var(--color-primary-500)' : 'var(--color-gray-900)')};
  text-transform: unset;
  justify-content: flex-start;

  font-weight: var(--fontWeight-regular);
  border-radius: 5px;

  &:hover {
    background: var(--color-gray-100);
  }
  &:active {
    background: var(--color-gray-100);
  }
`;

const dropdownItemsStyles: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0.5rem',
  marginTop: '0.5rem',
};

type UnderlinedDropdownItemsInterface = { onClose: () => void } & Pick<
  UnderlinedDropdownInterface,
  'items' | 'header' | 'preventAutoCloseOnClick'
>;

const UnderlinedDropdownItems: FC<UnderlinedDropdownItemsInterface> = ({
  items,
  header,
  onClose,
  preventAutoCloseOnClick,
}) => {
  return (
    <div>
      {header && <Box sx={dropdownHeaderStyles}>{header}</Box>}

      <Box sx={dropdownItemsStyles} onClick={!preventAutoCloseOnClick && onClose}>
        {items.map(({ label, props, isSelected }, index) => (
          <DropdownItemButton $isSelected={isSelected} variant="text" disableRipple {...props} key={index}>
            {label}
          </DropdownItemButton>
        ))}
      </Box>
    </div>
  );
};

export default UnderlinedDropdownItems;
