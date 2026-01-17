import { ButtonBase, SxProps } from '@mui/material';

import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';

import { useResponsiveContext } from './ResponsiveContext';

interface CloseMobileSidebarButtonPropsInterface {
  sx?: SxProps;
}

export const CloseMobileSidebarButton = ({ sx = {} }: CloseMobileSidebarButtonPropsInterface) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { isDesktop, onHideSidebar, isSidebarVisible } = useResponsiveContext();

  return (
    !isDesktop &&
    isSidebarVisible && (
      <ButtonBase onClick={onHideSidebar} sx={sx}>
        <Xmark />
      </ButtonBase>
    )
  );
};
