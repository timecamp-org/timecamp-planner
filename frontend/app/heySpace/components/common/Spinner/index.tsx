import { FC } from 'react';

import styles from './styles.css';

export const Spinner: FC<{ className?: string }> = ({ className }) => (
  <span className={`${className} ${styles.loader}`}></span>
);
