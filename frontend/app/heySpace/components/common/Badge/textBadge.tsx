import React, { FC } from 'react';

import styles from './styles.css';

interface PropsInterface {
  className?: string;
  text?: string;
}

export const TextBadge: FC<PropsInterface> = ({ className, text = 'BETA' }) => (
  <div className={`${styles.defaultStyle} ${styles.beta} ${className}`}>
    {text}
  </div>
);
