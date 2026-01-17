import { FC, ReactNode } from 'react';

import styled from 'styles/styled';
import { Backdrop, Box, ButtonBase, Drawer, SxProps } from '@mui/material';

import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';

import { useTemporaryDrawerContext } from './TemporaryDrawerContext';
import { useLocationChange } from './useLocationChange';

const boxStyles: SxProps = {
  position: 'relative',
  width: '28rem',
  padding: '1.6rem',
  height: '100%',
  paddingBottom: 0,
  marginBottom: '2rem',
  overflowX: 'hidden',
};

const buttonStyles: SxProps = {
  position: 'absolute',
  right: '1.6rem',
};

const backdropStyles: SxProps = {
  position: 'absolute',
  marginLeft: '100px',
  right: '0',
  zIndex: '-2',
  width: '100vw',
};

const drawerStyles: SxProps = {
  '&>.MuiPaper-root': {
    marginTop: 0,
  },
};

const popperStyles: SxProps = { position: 'absolute', left: 'calc(100% + 1px)', zIndex: -1 };
const popperProps = { sx: popperStyles };

interface TemporaryDrawerInterface {
  anchorRenderer: (props: { toggleOpen: () => void; isOpen: boolean }) => JSX.Element | ReactNode;
  id: 'chats' | 'projects' | '';
}
export const TemporaryDrawer: ReactFCWithChildren<TemporaryDrawerInterface> = ({ children, anchorRenderer, id }) => {
  const { drawerId, toggleId, closeDrawer } = useTemporaryDrawerContext();

  const toggleOpen = () => {
    toggleId(id);
  };

  useLocationChange(closeDrawer);
  const isOpen = drawerId === id;

  return (
    <>
      {anchorRenderer({ toggleOpen, isOpen })}
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={closeDrawer}
        sx={drawerStyles}
        PaperProps={popperProps}
        variant="persistent"
        elevation={0}
      >
        <Box sx={boxStyles}>
          <ButtonBase sx={buttonStyles} onClick={closeDrawer}>
            <Xmark />
          </ButtonBase>
          {children}
        </Box>
      </Drawer>
      <Backdrop open={isOpen} onClick={closeDrawer} sx={backdropStyles} />
    </>
  );
};

const Text = styled.p`
  color: var(--color-gray-900);
  font-size: var(--fontSize-base);
  font-weight: var(--fontWeight-semibold);
  margin-left: 1.6rem;
`;

export const TemporaryDrawerHeader: ReactFCWithChildren<{}> = ({ children }) => <Text>{children}</Text>;
