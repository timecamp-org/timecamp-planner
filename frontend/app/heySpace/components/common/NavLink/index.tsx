import { doNothing } from 'common/utils';
import { MouseEventHandler } from 'react';
import { useComponent } from './hook';

export type NavLinkInterface = {
  className?: string;
  activeClassName?: string;
  to: string;
  isDisabled?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const defaultProps = {
  onClick: doNothing,
};

const NavLink: ReactFCWithChildren<NavLinkInterface> = (props) => {
  const { className, activeClassName, children } = props;
  const hook = useComponent(props);
  return (
    <div className={`${className} ${hook.isActive && activeClassName}`} onClick={hook.onClick}>
      {children}
    </div>
  );
};

NavLink.defaultProps = defaultProps;

export default NavLink;
