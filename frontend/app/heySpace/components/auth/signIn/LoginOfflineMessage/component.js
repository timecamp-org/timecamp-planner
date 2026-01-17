import React from 'react';
import styles from './styles.css';

import PrimaryButton from 'components/buttons/PrimaryButton';
import { useTranslation } from 'i18n';

const LoginOfflineMessage = (props) => {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>
      <div className={styles.mascot} />
      <div className={styles.title}>{t('Ooops, you are offline')}</div>
      <div className={styles.subTitle}>
        {t(
          `Something has gone wrong with the internet connection. Let's try again!`
        )}
      </div>
      <PrimaryButton onClick={props.onRetry}>{t('Retry')}</PrimaryButton>
    </div>
  );
};

export default LoginOfflineMessage;
