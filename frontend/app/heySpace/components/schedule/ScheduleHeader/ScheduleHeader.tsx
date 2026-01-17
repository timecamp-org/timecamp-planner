import { FC } from 'react';

import { Id } from 'common/utils/identifier';
import { MyTasks } from 'commonComponents/Icons/index-NEW';
import { useTranslation } from 'i18n';

import { ScheduleFilters } from '../ScheduleFilters/ScheduleFilters';

import styles from './styles.css';
import { OpenMobileSidebarButton } from 'components/responsive/OpenMobileSidebarButton';

interface ScheduleHeaderInterface {
  className?: string;
  filterId?: Id;
}
export const ScheduleHeader: FC<ScheduleHeaderInterface> = ({ className, filterId }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.component} ${className} `}>
      <OpenMobileSidebarButton className={styles.icon} />

      <div className={styles.icon}>
        <MyTasks />
      </div>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{t('Planner')}</span>
        <ScheduleFilters filterId={filterId} />
      </div>
    </div>
  );
};
