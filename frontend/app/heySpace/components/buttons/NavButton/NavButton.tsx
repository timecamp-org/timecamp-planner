import { forwardRef, MouseEventHandler, ReactNode } from 'react';

import Dotdotdot from 'react-dotdotdot';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

import { SidebarActionButton } from '../SidebarActionButton';

type NavButtonInterface = {
  to: string;
  className?: string;
  shouldTruncateText?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void | MouseEventHandler;
  children?: ReactNode;
};

type ContortedNavButtonInterface = Partial<NavButtonInterface> & {
  isActive: boolean;
};

const NavButton = forwardRef<HTMLAnchorElement, NavButtonInterface | ContortedNavButtonInterface>(
  ({ to, children, className, isActive, isDisabled, onClick, shouldTruncateText, isCollapsed }, ref) => {
    const routeMatch = useRouteMatch();
    const active = (to && routeMatch.url.includes(to)) || isActive;
    const url = isDisabled ? '#' : to || '#';

    const onLinkClick = () => {
      if (!isDisabled) {
        onClick?.();
      }
    };

    return (
      <Link className={className} onClick={onLinkClick} to={url} ref={ref}>
        <SidebarActionButton isActive={active} isDisabled={isDisabled} isCollapsed={isCollapsed}>
          {shouldTruncateText ? (
            <Dotdotdot clamp={1} useNativeClamp>
              {children}
            </Dotdotdot>
          ) : (
            children
          )}
        </SidebarActionButton>
      </Link>
    );
  },
);

export default NavButton;
