import { ButtonProps } from '@mui/material';
import { ReactNode } from 'react';

export interface UnderlinedDropdownItem {
  label: ReactNode;
  props: ButtonProps & { onClick: () => void };
  isSelected?: boolean;
}

export interface UnderlinedDropdownInterface {
  header?: ReactNode;
  label: string;
  items: UnderlinedDropdownItem[];
  isDisabled?: boolean;
  preventAutoCloseOnClick?: boolean;
}
