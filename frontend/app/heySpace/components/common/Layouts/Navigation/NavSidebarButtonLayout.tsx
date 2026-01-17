import { FC, ReactNode } from 'react';

import styled from 'styles/styled';
import { Box, SxProps } from '@mui/system';

interface NavSidebarButtonLayoutInterface {
  icon?: ReactNode;
  text?: ReactNode;
  className?: string;
}

const wrapperStyles: SxProps = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',

  '&:not(:firstChild) > *': {
    minWidth: '0',
    flexGrow: '1',
  },
};

const IconWrapper = styled.div<{ $hasText: boolean }>`
  ${({ $hasText }) =>
    $hasText
      ? `
  margin-right: 1rem;
  padding-left: 1rem;
  display: flex;
`
      : `
         display: flex;
   align-items: center;
   justify-content: center;
      `}
`;

export const NavSidebarButtonLayout: FC<NavSidebarButtonLayoutInterface> = ({ className, text, icon }) => (
  <Box className={className} sx={!!text && wrapperStyles}>
    {icon && <IconWrapper $hasText={!!text}>{icon}</IconWrapper>}
    {text}
  </Box>
);
