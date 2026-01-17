import NoAccessToFeatureModal from 'commonComponents/NoAccessToFeatureModal';
import { useTranslation } from 'i18n';
import React, { memo } from 'react';
import ManageOverwatchModal from '../ManageOverwatchModal';
import OverwatchHeader from '../OverwatchHeader';
import OverwatchPageContent from './OverwatchPageContent';
import OverwatchSkeletonLoader from './OverwatchSkeletonPage';
import useComponent from './hook';
import styles from './styles.css';

const OverwatchPage: React.FC = () => {
  const { isOverwatchLoading, hasAccessToOverwatch, viewIds } = useComponent();
  const { t } = useTranslation();

  return (
    <div className={styles.component}>
      <ManageOverwatchModal />
      {!hasAccessToOverwatch && (
        <NoAccessToFeatureModal
          featureName={'Overwatch'}
          title={t('Overwatch is not available in your current plan.')}
        />
      )}
      <OverwatchHeader />

      <div className={styles.container}>
        {isOverwatchLoading ? <OverwatchSkeletonLoader /> : <OverwatchPageContent viewIds={viewIds} />}
      </div>
    </div>
  );
};

export default memo(OverwatchPage, () => true);
