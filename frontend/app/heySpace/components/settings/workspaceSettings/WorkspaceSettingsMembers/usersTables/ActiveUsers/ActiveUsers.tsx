import { FC, ReactNode } from 'react';

import { useSelector } from 'common/hooks/useSelector';

import { selectCurrentOrganizationMemberUserIdsSortedByRole } from 'models/domain/OrganizationsModel/selectors';

import WorkspaceGroupsDropdown from '../../../WorkspaceGroupsDropdown';
import WorkspaceMemberOptionsButton from '../../../WorkspaceMemberOptionsButton';
import WorkspaceRolesDropdown from '../../../WorkspaceRolesDropdown';

import styles from '../../styles.css';
import { useTranslation } from 'i18n';
import CollapsableTable from 'commonComponents/CollapsableTable';
import UserLabel from 'commonComponents/UserLabel';
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain';
import { extractKey } from '../utils';

interface ActiveUsersInterface {
  isOpen: boolean;
  onToggle: () => void;
  count?: ReactNode;
}

const ActiveUsers: FC<ActiveUsersInterface> = (props) => {
  const { t } = useTranslation();
  const userIdList = useSelector(selectCurrentOrganizationMemberUserIdsSortedByRole);
  const currentUserId = useSelector(selectCurrentUserId);

  return (
    <CollapsableTable
      extractKey={extractKey}
      records={userIdList}
      {...props}
      columns={[
        {
          label: <>{t('Active users')}</>,
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
          label: t('System role'),
          width: '22%',
          renderCell: (userId) => <WorkspaceRolesDropdown userId={userId} />,
        },
        {
          label: t('Job title'),
          width: '22%',
          renderCell: (userId) => <WorkspaceGroupsDropdown userId={userId} />,
        },
        {
          label: '',
          width: '6%',
          renderCell: (userId) => (userId === currentUserId ? null : <WorkspaceMemberOptionsButton userId={userId} />),
          props: { align: 'right' },
        },
      ]}
    />
  );
};

export default ActiveUsers;
