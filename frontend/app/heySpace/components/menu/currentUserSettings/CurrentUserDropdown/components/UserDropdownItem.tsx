import { Check as IconPlaceholder } from 'commonComponents/Icons/fontawesome/Check';
import SecondaryButton from 'components/buttons/SecondaryButton';

import styles from '../styles.css';
import { UserDropdownItemProps } from '../types';

import UserDropdownLink from './UserDropdownLink';

const UserDropdownItem = (props: UserDropdownItemProps) => {
  const { Icon, url, label, onClick, className, isDisabled } = props;

  return (
    <UserDropdownLink url={url}>
      <SecondaryButton onClick={onClick} className={className || styles.menuItem} isDisabled={isDisabled}>
        <div className={styles.iconWrapper}>
          {Icon ? <Icon className={styles.menuItemIcon} /> : <IconPlaceholder className={styles.iconPlaceholder} />}
        </div>

        <div>{label}</div>
      </SecondaryButton>
    </UserDropdownLink>
  );
};

export default UserDropdownItem;

export const getUserDropdownItem =
  (Icon: UserDropdownItemProps['Icon']) => (props: Omit<UserDropdownItemProps, 'Icon'>) =>
    <UserDropdownItem Icon={Icon} {...props} />;
