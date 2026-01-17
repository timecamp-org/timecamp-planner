import { Link } from 'react-router-dom';

import { PlannerLogo } from 'commonComponents/PlannerLogo';
import CredentialsPage from 'components/auth/CredentialsPage';
import SignInForm from 'components/auth/signIn/SignInForm';
import { useSetPageTitle } from 'hooks/useSetPageTitle';
import { i18n, useTranslation } from 'i18n';

import styles from './styles.css';

const SignInPage = () => {
  const { t } = useTranslation();
  useSetPageTitle(t(`Login to Free Collaboration Tool with Chat - Planner`));

  return <CredentialsPage rightSideRenderer={renderSighInPage} />;
};

function renderSighInPage() {
  return (
    <div className={styles.signInPage}>
      <div className={styles.topSection}>
        <PlannerLogo />
        <div className={styles.signUp}>
          {i18n.t(`Don't have an account?`)}
          <Link className={styles.link} to="/register">
            {i18n.t('Sign up').toString()}
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        <SignInForm />
      </div>
    </div>
  );
}

export default SignInPage;
