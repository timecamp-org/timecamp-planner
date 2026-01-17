/* eslint-disable @typescript-eslint/naming-convention */
import { Check as IconPlaceholder } from 'commonComponents/Icons/fontawesome/Check';
import SecondaryButton from 'components/buttons/SecondaryButton';

import { isFunctionComponent } from '../../../projects/ProjectViewHeader/utils/isFunctionComponent';

import UserDropdownLink from './components/UserDropdownLink';
import styles from './styles.css';
import { useCurrentUserDropdownMenuItems } from './useCurrentUserDropdownMenuItems';

const UserDropdownLinks = () => {
  const menuItems = useCurrentUserDropdownMenuItems();

  return (
    <>
      {menuItems.map((MenuItem, index) => {
        // @ts-ignore
        if (isFunctionComponent(MenuItem)) {
          return <MenuItem key={index} />;
        }

        // @ts-ignore
        const { label, Icon, onClick, url, className, isDisabled } = MenuItem;

        return (
          <UserDropdownLink url={url} key={index}>
            <SecondaryButton onClick={onClick} className={className || styles.menuItem} isDisabled={isDisabled}>
              {Icon ? <Icon className={styles.menuItemIcon} /> : <IconPlaceholder className={styles.iconPlaceholder} />}
              <div>{label}</div>
            </SecondaryButton>
          </UserDropdownLink>
        );
      })}
    </>
  );
};

export default UserDropdownLinks;
