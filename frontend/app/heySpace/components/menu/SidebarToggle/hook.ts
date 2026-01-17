import { useLocalStorage } from 'common/hooks/useLocalStorage';

export function useComponent() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebarToggle', false);

  const onCollapse = () => {
    setIsCollapsed(true);
  };

  const onExpand = () => {
    setIsCollapsed(false);
  };

  return {
    isCollapsed,
    onCollapse,
    onExpand,
  };
}
