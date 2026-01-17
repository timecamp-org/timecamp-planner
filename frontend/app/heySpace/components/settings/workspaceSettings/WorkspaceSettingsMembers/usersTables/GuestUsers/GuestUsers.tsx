import { FC, ReactNode } from 'react';
import CollapsableTable from 'commonComponents/CollapsableTable';
import { useTranslation } from 'i18n';
import UserLabel from 'commonComponents/UserLabel';
import styles from '../../styles.css';
import GuestSpacesButton from '../../../GuestSpacesButton';
import WorkspaceMemberOptionsButton from '../../../WorkspaceMemberOptionsButton';
import { extractKey } from '../utils';
interface GuestUsersInterface {
  isOpen: boolean;
  onToggle: () => void;
  records: any;
  count?: ReactNode;
}

const GuestUsers: FC<GuestUsersInterface> = (props) => {
  const { t } = useTranslation();

  return (
    <CollapsableTable
      {...props}
      extractKey={extractKey}
      columns={[
        {
          label: t('Guests'),
          width: '50%',
          renderCell: (userId) => (
            <UserLabel
              key={userId}
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
          label: t('Projects'),
          width: '44%',
          renderCell: (userId) => <GuestSpacesButton className={styles.guestSpacesButton} userId={userId} />,
        },
        {
          label: '',
          width: '6%',
          renderCell: (userId) => <WorkspaceMemberOptionsButton userId={userId} className={styles.userOptionsButton} />,
        },
      ]}
    />
  );
};

export default GuestUsers;
