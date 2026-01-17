import styled from 'styles/styled';
import { ButtonBase } from '@mui/material';

import { useResponsiveContext } from './ResponsiveContext';

const MenuIcon = styled.div`
  width: 2.5rem;
  height: 1.5rem;
  border-bottom: 0.2rem solid var(--color-gray-800);
  border-top: 0.2rem solid var(--color-gray-800);
  position: relative;
  padding: 0.4rem;
  margin-left: 0.5rem;

  &::after {
    position: absolute;
    display: block;
    width: 2.5rem;
    height: 0.2rem;
    content: '';
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: var(--color-gray-800);
  }
`;

interface OpenMobileSidebarButtonPropsInterface {
  className?: string;
}

export const OpenMobileSidebarButton = ({ className = '' }: OpenMobileSidebarButtonPropsInterface) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { isDesktop, onShowSidebar } = useResponsiveContext();

  return (
    !isDesktop && (
      <ButtonBase onClick={onShowSidebar} className={className}>
        <MenuIcon />
      </ButtonBase>
    )
  );
};
