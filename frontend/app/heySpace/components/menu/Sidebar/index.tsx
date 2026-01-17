import { useContext, useEffect } from 'react';

import { Backdrop } from '@mui/material';

import { useSelector } from 'common/hooks/useSelector';
import { useResponsiveContext } from 'components/responsive/ResponsiveContext';
import { selectIsWorkspacesPanelVisible } from 'models/domain/AppModel/selectors';

import CollapsedMainMenu from '../CollapsedMainMenu';
import MainMenu from '../MainMenu';
import WorkspacesPanel from '../WorkspacesPanel';

import { CloseMobileSidebarButton } from 'components/responsive/CloseMobileSidebarButton';
import { SidebarContext, SidebarContextInterface, SidebarContextProvider } from './context';
import { BackdropWrapper, SidebarWrapper, backdropStyles, closeMobileSidebarButtonStyles } from './styled';

const Sidebar = () => {
  const { isCollapsed, onExpand } = useContext<SidebarContextInterface>(SidebarContext);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { isDesktop, isSidebarVisible, onHideSidebar } = useResponsiveContext();
  const shouldRenderWorkspacesPanel = useSelector(selectIsWorkspacesPanelVisible);

  useEffect(() => {
    if (!isDesktop) {
      onExpand();
    }
  }, [isDesktop]);
  return (
    <>
      <SidebarWrapper $isDesktop={isDesktop} $isMobileVisible={isSidebarVisible}>
        <WorkspacesPanel isVisible={shouldRenderWorkspacesPanel} />
        {isCollapsed && <CollapsedMainMenu />}
        {!isCollapsed && <MainMenu />}
        <BackdropWrapper>
          <Backdrop open={!isDesktop && isSidebarVisible} sx={backdropStyles} onClick={onHideSidebar}>
            <CloseMobileSidebarButton sx={closeMobileSidebarButtonStyles} />
          </Backdrop>
        </BackdropWrapper>
      </SidebarWrapper>
    </>
  );
};

const SidebarProvider = () => (
  <SidebarContextProvider>
    <Sidebar />
  </SidebarContextProvider>
);

export default SidebarProvider;
