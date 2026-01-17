import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import UserAvatarEmailBadge from 'commonComponents/UserAvatarEmailBadge';

import UserDropdownItems from './components/UserDropdownItems';
import styles from './styles.css';

type CurrentUserDropdownProps = {
  onClose: () => void;
};

const CurrentUserDropdown = ({ onClose }: CurrentUserDropdownProps) => (
  <div className={styles.newDropdownContent}>
    <Xmark className={styles.xMark} onClick={onClose} />
    <UserAvatarEmailBadge
      className={styles.userDetails}
      personFullNameClassName={styles.userNameWrapper}
      userMaxNameLength={22}
      userEmailMaxLength={30}
    />
    <UserDropdownItems onClick={onClose} />
  </div>
);

export default CurrentUserDropdown;
