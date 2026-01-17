import { FC } from 'react';

import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { selectGroupByUserId } from 'models/domain/OrganizationGroupsModel/selectors';

import styles from './styles.css';

export interface PersonGroupInterface {
  userId: Id | string;
  className?: string;
}
export const PersonGroup: FC<PersonGroupInterface> = ({ userId, className }) => {
  const userGroup = useSelector((state) => selectGroupByUserId(state, { userId }));

  return <span className={`${styles.userGroup} ${className}`}>{userGroup?.name}</span>;
};
