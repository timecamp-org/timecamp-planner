import styles from '../styles.css';
import { RenderChevronInterface } from '../types';
import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';

export const renderChevron = ({ direction, size }: RenderChevronInterface) => {
  const chevrons = {
    up: <ChevronUp className={styles.chevron} size={size} />,
    down: <ChevronDown className={styles.chevron} size={size} />,
    left: <ChevronUp className={styles.chevronLeft} size={size} />,
    right: <ChevronUp className={styles.chevronRight} size={size} />,
  };
  return chevrons[direction];
};
