import { SortOrder } from 'common/types';
import { ArrowDownLong } from 'commonComponents/Icons/fontawesome/ArrowDownLong';
import { ArrowUpLong } from 'commonComponents/Icons/fontawesome/ArrowUpLong';
import { ReactNode } from 'react';
import styles from './styles.css';

interface SortLabelInterface {
  className?: string;
  onToggleSortOrder: (sortOrder: SortOrder | null) => void;
  targetRenderer: () => ReactNode | Element | string;
  order: SortOrder | null;
}

const getNexOrder = (order: SortOrder): SortOrder => {
  switch (order) {
    case 'asc':
      return 'desc';

    case 'desc':
      return null;

    default:
      return 'asc';
  }
};

export const SortLabel = ({ className, onToggleSortOrder, targetRenderer, order }: SortLabelInterface) => {
  const onClick = () => {
    onToggleSortOrder(getNexOrder(order));
  };

  return (
    <div className={className || styles.Component} onClick={onClick}>
      {targetRenderer?.()}
      <div className={styles.chevronWrapper}>
        {order === 'asc' && <ArrowUpLong />}
        {order === 'desc' && <ArrowDownLong />}
      </div>
    </div>
  );
};
