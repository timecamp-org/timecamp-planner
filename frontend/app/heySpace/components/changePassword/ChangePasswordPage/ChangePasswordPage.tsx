
import { Link } from 'react-router-dom';

import CredentialsPage from 'components/auth/CredentialsPage';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ChangePasswordForm from 'components/changePassword/ChangePasswordForm';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const ChangePasswordPage = () => {
  const { t } = useTranslation();

  return <CredentialsPage rightSideRenderer={renderChangePasswordPage} />;
  function renderChangePasswordPage() {
    return (
      <div className={styles.changePasswordPage}>
        <div className={styles.signUp}>
          {t(`Go back to`)}
          <Link to="/login">
            <SecondaryButton className={styles.signUpButton}>{t('Sign in')}</SecondaryButton>
          </Link>
        </div>
        <div className={styles.content}>
          <ChangePasswordForm />
        </div>
      </div>
    );
  }
};

export default ChangePasswordPage;
