import React, { FC, ReactNode } from 'react';

import Button from 'components/buttons/Button';

export const SpaceColoredButton: FC<{
  className: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onHoverStyles: Object;
  children: ReactNode;
  onClick: () => void;
}> = ({ children, className, onHoverStyles, onClick }) => (
  <Button className={className} onClick={onClick}>
    {children}
    <style>
      {`.${className}:hover{${Object.entries(onHoverStyles)
        .map(([key, val]) => `${key}: ${val};`)
        .join()}}`}
    </style>
  </Button>
);
