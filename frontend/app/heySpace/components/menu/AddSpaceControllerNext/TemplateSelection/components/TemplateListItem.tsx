import { FC } from 'react';

import styled from '@emotion/styled';
import { ButtonBase } from '@mui/material';

import { ChartSimpleHorizontal } from 'commonComponents/Icons/fontawesome/ChartSimpleHorizontal';

const Item = styled.li<{ isActive: boolean }>`
  width: 100%;
  height: 4rem;
  padding: 0;

  border-radius: var(--borderRadius-sm);
  border: 1px solid ${({ isActive }) => (isActive ? 'var(--color-primary-500)' : 'transparent')};
  background-color: ${({ isActive }) => (isActive ? 'var(--color-primary-50)' : 'transparent')};
  overflow: hidden;

  :hover {
    cursor: pointer;
    background-color: var(--color-gray-100);
  }
`;

const Button = styled(ButtonBase)`
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 0.8rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  color: var(--color-primary-700);
  background-color: var(--color-gray-100);
  border-radius: var(--borderRadius-sm);
  transform: rotate(90deg);
`;

interface SelectTemplateButtonInterface {
  onClick: (id: string) => void;
  template: { id: string; name: string; icon?: string };
  isActive?: boolean;
}

export const SelectTemplateButton: FC<SelectTemplateButtonInterface> = ({
  onClick,
  isActive,
  template: { id, name, icon },
}) => (
  <Item isActive={isActive}>
    <Button onClick={() => onClick(id)}>
      <IconWrapper>{icon || <ChartSimpleHorizontal />}</IconWrapper>
      <span>{name}</span>
    </Button>
  </Item>
);
