import { MouseEventHandler } from 'react';

import { ArrowDownLong } from 'commonComponents/Icons/fontawesome/ArrowDownLong';
import { ArrowUpLong } from 'commonComponents/Icons/fontawesome/ArrowUpLong';
import { useTranslation } from 'i18n';

import styles from './styles.css';

interface LeftMenuUnreadsInterface {
  position: 'top' | 'bottom';
  isUpgradeButtonVisible: boolean;
  onClick: MouseEventHandler<HTMLDivElement> | (() => void);
}

const ICON_SIZE = 'sm';

function LeftMenuUnreads({ isUpgradeButtonVisible = true, onClick, position = 'top' }: LeftMenuUnreadsInterface) {
  const isTop = position === 'top';
  const { t } = useTranslation();

  return (
    <div
      className={`${styles.Component} 
      ${getClassName(isTop, isUpgradeButtonVisible)}`}
      onClick={onClick}
    >
      <span className={styles.text}>{t('More unreads')}</span>
      {isTop ? <ArrowUpLong size={ICON_SIZE} /> : <ArrowDownLong size={ICON_SIZE} />}
    </div>
  );
}

function getClassName(isTop: boolean, isUpgradeButtonVisible: boolean) {
  if (isTop) {
    return isUpgradeButtonVisible ? styles.topWithUpgradeButton : styles.topWithoutUpgradeButton;
  } else {
    return styles.bottom;
  }
}

export default LeftMenuUnreads;
