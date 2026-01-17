import { ReactElement, ReactNode, useState } from 'react';

import styled from 'styles/styled';
import { MenuProps, Select } from '@mui/material';

import { ChevronDown } from '../Icons/fontawesome/ChevronDown';

import styles from './styles.css';

const StyledSelect = styled(Select)<{ open: boolean }>`
  border-bottom: 1px solid transparent;
  ${({ open }) => open && 'border-color:var(--color-primary-500)'};

  & > svg {
    ${({ open }) => open && 'color:var(--color-primary-500)'};
  }
`;

const menuProps: Partial<MenuProps> = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
};

interface UnderlinedSelectInterface<T> {
  value: T;
  onChange: (value: T) => void;
  children: ReactNode | JSX.Element;
  label?: ReactNode;
  id?: string;
  className?: string;
}

export const UnderlinedSelect: <T>(p: UnderlinedSelectInterface<T>) => ReactElement<UnderlinedSelectInterface<T>> = ({
  children,
  id,
  label,
  className,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const onSelectChange = (e) => onChange(e.target.value);
  const onClick = () => setOpen((o) => !o);

  return (
    <div className={className || styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <StyledSelect
        open={open}
        disableUnderline
        variant="standard"
        MenuProps={menuProps}
        value={value}
        onChange={onSelectChange}
        onClick={onClick}
        IconComponent={ChevronDown}
      >
        {children}
      </StyledSelect>
    </div>
  );
};
