import { FC } from 'react';

import { Button, ButtonProps } from '@mui/material';
import styled from 'styles/styled';

export const StyledButton = styled(Button)<{ $isActive?: boolean; $isDashed?: boolean }>`
  color: ${({ $isActive }) => ($isActive ? 'var(--color-primary-500)' : 'var(--color-gray-900)')};
  ${({ $isDashed }) =>
    $isDashed &&
    `border-radius:50%;
    border: 1px dashed var(--color-gray-500);
    padding: 0.4rem;`}
`;

interface ActivatableButtonInterface extends ButtonProps {
  isActive?: boolean;
  isDashed?: boolean;
}

export const ActivatableButton: FC<ActivatableButtonInterface> = (props) => {
  const { isDashed, isActive, ...restOfProps } = props;
  return <StyledButton variant="text-reversed" {...restOfProps} $isDashed={isDashed} $isActive={isActive} />;
};
