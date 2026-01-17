import { SxProps } from '@mui/material';
import styled from 'styles/styled';

export const SidebarWrapper = styled.div<{ $isDesktop: boolean; $isMobileVisible: boolean }>`
  display: flex;
  position: relative;
  z-index: 700;
  ${({ $isDesktop }) => !$isDesktop && 'position:absolute; left:-100%;'}
  ${({ $isMobileVisible }) => $isMobileVisible && 'left:0;background:var(--color-white);'}
`;

export const backdropStyles: SxProps = { zIndex: 10, left: '300px' };

export const BackdropWrapper = styled.div`
  z-index: 11;
  position: relative;
`;

export const closeMobileSidebarButtonStyles: SxProps = {
  left: -27,
  position: 'absolute',
  top: '1.2rem',
  border: '0.1rem solid var(--color-gray-200)',
  borderRadius: '50%',
  width: '3.2rem',
  height: '3.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'translateX(50%)',
  backgroundColor: 'var(--color-white)',
  cursor: 'pointer',
};
