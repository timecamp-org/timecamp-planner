import { useCurrentUserDropdownMenuItems } from '../useCurrentUserDropdownMenuItems';

type UserDropdownItemsProps = {
  onClick: () => void;
};

const UserDropdownItems = ({ onClick }: UserDropdownItemsProps) => {
  const menuItems = useCurrentUserDropdownMenuItems();

  return (
    <div onClick={onClick}>
      {menuItems.map(({ Component, props = {} }, index) => {
        return <Component {...props} key={index} />;
      })}
    </div>
  );
};

export default UserDropdownItems;
