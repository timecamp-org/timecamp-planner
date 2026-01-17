import CollapsableTable from 'commonComponents/CollapsableTable';
import UserLabel from 'commonComponents/UserLabel';
import { useTranslation } from 'i18n';
import { FC, ReactNode } from 'react';
import ReactivateUserButton from '../../../ReactivateUserButton';
import styles from '../../styles.css';
import { extractKey } from '../utils';

interface DisabledUsersInterface {
  isOpen: boolean;
  onToggle: () => void;
  records: any;
  count?: ReactNode;
}

const DisabledUsers: FC<DisabledUsersInterface> = (props) => {
  const { t } = useTranslation();

  return (
    <CollapsableTable
      {...props}
      extractKey={extractKey}
      columns={[
        {
          label: t('Inactive users'),
          width: '90%',
          renderCell: (userId) => (
            <UserLabel
              className={styles.userRow}
              innerClassName={styles.userRowInner}
              personIconClassName={styles.personIcon}
              shouldRenderInvitationStatus={false}
              shouldRenderProjectStatus={false}
              shouldRenderCurrentUserHint={true}
              userId={userId}
              ellipsizeMinLength={35}
            />
          ),
        },
        {
          label: '',
          width: '10%',
          renderCell: (userId) => (
            <div className={styles.rowRight}>
              <ReactivateUserButton userId={userId} />
            </div>
          ),
        },
      ]}
    />
  );
};

export default DisabledUsers;
