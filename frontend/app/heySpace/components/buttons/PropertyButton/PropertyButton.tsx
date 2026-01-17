import { FC, MouseEventHandler, ReactNode } from 'react';

import styled from 'styles/styled';

import { ActivatableButton } from '../ActivableButton/ActivableButton';

const withoutPropertyStyles = `
  color: var(--color-gray-500);
  fill: var(--color-gray-500);
  border-radius: 50%;
  border: 1px dashed var(--color-gray-500);
  width: 2.4rem;
`;

const StyledButton = styled(ActivatableButton)<{ $hasProperty: boolean; $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
  color: var(--color-gray-900);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  ${({ $hasProperty }) => !$hasProperty && withoutPropertyStyles};
  ${({ $isActive }) => $isActive && 'color: var(--color-primary-500); border-color: var(--color-primary-500);'}
`;

const IconWrapper = styled.div<{ $hasSpacing: boolean }>`
  margin-right: ${({ $hasSpacing }) => $hasSpacing && '1rem'};
`;

type PropertyButtonInterface = {
  icon?: ReactNode;
  hasProperty?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  className?: string;
  onClick?: (() => void) | MouseEventHandler<Element>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export const PropertyButton: ReactFCWithChildren<PropertyButtonInterface> = ({
  icon,
  children,
  hasProperty,
  isDisabled,
  isActive,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => (
  <StyledButton
    className={className}
    onClick={onClick}
    disabled={isDisabled}
    $hasProperty={hasProperty}
    $isActive={isActive}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {icon && <IconWrapper $hasSpacing={hasProperty}>{icon}</IconWrapper>} {hasProperty && children}
  </StyledButton>
);
