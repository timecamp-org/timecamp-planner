import React, { createContext, useContext, useLayoutEffect, useState } from 'react';

import { doNothing } from 'common/utils';

export type ResponsiveContextInterface = {
  isDesktop: boolean;
  isSidebarVisible: boolean;
  onShowSidebar(): void;
  onHideSidebar(): void;
};

const DESKTOP_BREAKPOINT = 1050;

const SidebarContext = createContext<ResponsiveContextInterface>({
  isDesktop: true,
  isSidebarVisible: true,
  onShowSidebar: doNothing,
  onHideSidebar: doNothing,
});

export const ResponsiveContextProvider: ReactFCWithChildren = (props) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // eslint-disable-next-line no-unused-expressions
      window.innerWidth <= DESKTOP_BREAKPOINT ? setIsDesktop(false) : setIsDesktop(true);
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const onShowSidebar = () => setIsSidebarVisible(true);
  const onHideSidebar = () => setIsSidebarVisible(false);

  return (
    <SidebarContext.Provider
      value={{
        isDesktop,
        isSidebarVisible,
        onShowSidebar,
        onHideSidebar,
      }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
};

export const useResponsiveContext = () => useContext(SidebarContext);
