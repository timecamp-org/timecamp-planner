import { useTranslation } from 'i18n';

import styles from './styles.css';

function TermsAndConditions() {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      {t('By signing up you agree to our ')}
      <a href="https://www.timecamp.com/planner/terms-conditions/" target="_blank" className={styles.link}>
        {'Terms and Service'}
      </a>
      {t(' and ')}
      <a href="https://www.timecamp.com/planner/privacy-policy/" target="_blank" className={styles.link}>
        {t('Privacy Policy.')}
      </a>
    </div>
  );
}

export default TermsAndConditions;
