import { Link } from 'react-router-dom';

// import Character from 'commonComponents/Mascot/assets/character_31.png';
import CredentialsPage from 'components/auth/CredentialsPage';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { Trans, useTranslation } from 'i18n';

import styles from './styles.css';

const ChangePasswordLinkExpiredPage = () => {
  const { t } = useTranslation();

  return <CredentialsPage rightSideRenderer={renderSighUpPage} />;

  function renderSighUpPage() {
    return (
      <div className={styles.signInPage}>
        <div className={styles.signUp}>
          {t(`Don't have an account?`)}
          <Link to="/register">
            <SecondaryButton className={styles.signUpButton}>{t('Sign up')}</SecondaryButton>
          </Link>
        </div>
        <div className={styles.content}>
          <div className={styles.messageWrapper}>
            {/* <img src={Character} className={styles.character} /> */}
            <div className={styles.title}>{t('The link has expired')}</div>
            <div className={styles.message}>
              <Trans i18nKey="linkExpireReason">
                {t('For security reasons, your password link has expired. Use ')}
                <Link to="/forgottenPassword" className={styles.link}>
                  {t('forgot password')}
                </Link>
                {t(' to generate new one or try to ')}
                <Link to="/login" className={styles.link}>
                  {t('log in')}
                </Link>
                .
              </Trans>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ChangePasswordLinkExpiredPage;
