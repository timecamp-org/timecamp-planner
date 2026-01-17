import React, { createContext } from 'react';

import { useLocalStorage } from 'common/hooks/useLocalStorage';
import { doNothing } from 'common/utils';

export type SidebarContextInterface = {
  isCollapsed: boolean;
  onCollapse(): void;
  onExpand(): void;
  onToggleSidebarSize(): void;
};

export const SidebarContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebarToggle', false);

  const onCollapse = () => {
    setIsCollapsed(true);
  };

  const onExpand = () => {
    setIsCollapsed(false);
  };

  const onToggleSidebarSize = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, onCollapse, onExpand, onToggleSidebarSize }}>
      {props.children}
    </SidebarContext.Provider>
  );
};

export const SidebarContext = createContext<SidebarContextInterface>({
  isCollapsed: false,
  onCollapse: doNothing,
  onExpand: doNothing,
  onToggleSidebarSize: doNothing,
});
