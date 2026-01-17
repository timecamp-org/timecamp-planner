import styled from 'styles/styled';
import { SxProps } from '@mui/material';

export const PopupWrapper = styled.div``;
export const ToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const YearWrapper = styled.span`
  font-weight: var(--fontWeight-semibold);
  font-size: var(--fontSize-base);
`;

export const MonthWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: var(--fontWeight-${({ isSelected }) => (isSelected ? 'semibold' : 'regular')});

  padding: 0.7rem;
  border-radius: 50%;
  user-select: none;
  ${({ isSelected }) => (isSelected ? ' color: var(--color-white);' : `color:var(--color-gray-900);`)}

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    height: 45px;
    width: 45px;
    background: transparent;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    ${({ isSelected }) => (isSelected ? 'background: var(--color-primary-500);  ' : ` `)}
  }

  &: hover:after {
    ${({ isSelected }) => (isSelected ? '' : `background: var(--color-gray-100);`)}
    
  }
`;
export const ValueWrapper = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 0.15rem;
  font-size: var(--fontSize-sm);
  z-index: 10;
`;

export const PlaceholderWrapper = styled.span`
  font-weight: var(--fontWeight-semibold);
  visibility: hidden;
  letter-spacing: 0.15rem;
  font-size: var(--fontSize-sm);
`;

export const monthsWrapperStyles: SxProps = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 2,
  padding: '2rem 1rem 1.5rem 1rem',
};

export const iconButtonStyles: SxProps = {
  color: 'var(--color-gray-900)',
  '&:hover *': {
    color: 'var(--color-primary-500)',
  },
};
