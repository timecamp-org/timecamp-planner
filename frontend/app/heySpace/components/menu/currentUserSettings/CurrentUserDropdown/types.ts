import { MouseEventHandler } from 'react';

export type UserDropdownItemProps = {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
  Icon?: any;
  url?: string;
  label?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
};
