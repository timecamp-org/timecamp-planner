import { FC } from 'react';

import { useSelector } from 'common/hooks/useSelector';
import { ellipsizeInTheEnd } from 'common/utils';
import { Id } from 'common/utils/identifier';
import { selectGroupById } from 'models/domain/OrganizationGroupsModel/selectors';

import styles from './styles.css';

const MAX_TEXT_LENGTH = 25;
export interface UserGroupInterface {
  userGroupId: Id | string;
  className?: string;
}
export const UserGroup: FC<UserGroupInterface> = ({ userGroupId, className }) => {
  const group = useSelector((state) => selectGroupById(state, { groupId: userGroupId }));

  return <span className={`${styles.userGroup || className}`}>{ellipsizeInTheEnd(group?.name, MAX_TEXT_LENGTH)}</span>;
};
