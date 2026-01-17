import { Link } from 'react-router-dom';

import { PlannerLogo } from 'commonComponents/PlannerLogo';
import CredentialsPage from 'components/auth/CredentialsPage';
import ForgottenPasswordForm from 'components/auth/forgottenPassword/ForgottenPasswordForm';
import { i18n } from 'i18n';

import styles from './styles.css';

const ForgottenPasswordPage = () => <CredentialsPage rightSideRenderer={renderForgottenPasswordPage} />;

function renderForgottenPasswordPage() {
  return (
    <div className={styles.forgottenPasswordPage}>
      <div className={styles.topSection}>
        <PlannerLogo />
        <div className={styles.signUp}>
          {i18n.t(`Don’t have an account?`)}
          <Link to="/register" className={styles.link}>
            {i18n.t('Sign up').toString()}
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        <ForgottenPasswordForm />
      </div>
    </div>
  );
}

export default ForgottenPasswordPage;
