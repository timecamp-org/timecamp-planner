import PrimaryButton from 'components/buttons/PrimaryButton';
import { useTranslation } from 'i18n';

import styles from './styles.css';

function NotSupportedBrowser(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.component}>
      <div className={styles.mascot} />
      <div className={styles.title}>{t('Planner works best on Google Chrome. ')}</div>
      <div className={styles.subTitle}>{t(`Don’t worry, more browsers coming soon! `)}</div>
      <PrimaryButton
        onClick={() => {
          window.open('https://timecamp.com/planner', '_self');
        }}
      >
        {t('Go back to main page')}
      </PrimaryButton>
      <div className={styles.title}>{t('or')}</div>
      <div className={styles.subTitleClickable} onClick={props.onSetDoUserWantToUseNotSupportedBrowser}>
        {t('Use Planner in your browser nonetheless')}
      </div>
    </div>
  );
}

export default NotSupportedBrowser;
