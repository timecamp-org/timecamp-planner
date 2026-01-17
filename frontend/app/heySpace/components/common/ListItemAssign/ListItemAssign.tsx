import SecondaryButton from 'components/buttons/SecondaryButton';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import { useTranslation } from 'i18n';

import styles from './styles.css';

interface ListItemAssignInterface {
  userId?: string;
  onClick: () => void;
  objectColor?: string;
  label?: React.ReactNode;
}

const ListItemAssign = ({
  userId = null,
  onClick = () => { },
  objectColor = '',
  label = <></>,
}: ListItemAssignInterface) => {
  const { t } = useTranslation();

  return (
    <div className={styles.userRow} onClick={onClick}>
      <div className={styles.userRowLeft}>
        {userId && <PersonIcon wrapperClassName={styles.searchRowPersonIcon} userId={userId} />}
        {userId ? <PersonFullName userId={userId} /> : label}
      </div>
      <div
        className={styles.notAssignedUserRowLabel}
        style={{
          color: objectColor,
        }}
      >
        <SecondaryButton className={styles.notAssignedUserRowLabelButton}>
          <span>{t(userId ? 'Assign' : 'Move')}</span>
        </SecondaryButton>
      </div>
    </div>
  );
};

export default ListItemAssign;
