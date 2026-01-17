import React from 'react';
import styles from './styles.css';
import { Link } from 'react-router-dom';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { useTranslation } from 'i18n';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>
      <div className={styles.top}>
        <div className={styles.background}>{'404'}</div>
        <div className={styles.mascot} />
      </div>
      <div className={styles.title}>{t(`Ooops! It seems you are lost in space…`)}</div>
      <div className={styles.subTitle}>
        {t(`The page you are looking for doesn’t exist. You may have mistype the address or the page may have moved. `)}
      </div>
      <Link to={'/'}>
        <PrimaryButton>{t('Go back to project')}</PrimaryButton>
      </Link>
    </div>
  );
};

export default NotFoundPage;
