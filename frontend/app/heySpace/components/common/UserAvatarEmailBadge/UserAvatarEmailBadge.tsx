import { useSelector } from 'react-redux';

import { ellipsizeInTheEnd } from 'common/utils';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import { selectCurrentUser } from 'models/domain/UsersModel/selectors/domain';
import commonStyles from 'styles/common.css';

import styles from './styles.css';

const avatarSize = 6 * parseInt(commonStyles.gridCellSize, 10);

type UserAvatarEmailBadgeProps = {
  className?: string;
  iconWrapperClassName?: string;
  personFullNameClassName?: string;
  userMaxNameLength?: number;
  userEmailMaxLength?: number;
};

const UserAvatarEmailBadge = ({
  className,
  iconWrapperClassName,
  personFullNameClassName,
  userMaxNameLength,
  userEmailMaxLength,
}: UserAvatarEmailBadgeProps) => {
  const { id, email } = useSelector(selectCurrentUser) || {};

  return (
    <div className={className}>
      <div className={iconWrapperClassName || styles.userAvatarEmailBadgeWrapper}>
        <PersonIcon userId={id} width={avatarSize} height={avatarSize} />
        <div className={personFullNameClassName || styles.userNameEmailWrapper}>
          <PersonFullName userId={id} className={styles.personFullName} maxNameLength={userMaxNameLength} />
          <span className={styles.email}>{ellipsizeInTheEnd(email, userEmailMaxLength)}</span>
        </div>
      </div>
    </div>
  );
};

export default UserAvatarEmailBadge;
