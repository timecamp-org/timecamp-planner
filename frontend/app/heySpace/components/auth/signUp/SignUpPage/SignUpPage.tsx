import { Link } from 'react-router-dom';

import { PlannerLogo } from 'commonComponents/PlannerLogo';
import { useSetPageTitle } from 'hooks/useSetPageTitle';
import { i18n, useTranslation } from 'i18n';

import CredentialsPage from '../../CredentialsPage';
import SignUpForm from '../SignUpForm';

import styles from './styles.css';

const SignUpPage = () => {
  const { t } = useTranslation();
  useSetPageTitle(t('Register to the only truly Free Task Management Tool - Planner'));

  return <CredentialsPage rightSideRenderer={renderSignUpPage} />;
};

function renderSignUpPage() {
  return (
    <div className={styles.signUpPage}>
      <div className={styles.topSection}>
        <PlannerLogo />
        <Link className={styles.logIn} to="/login">
          {i18n.t('Log in').toString()}
        </Link>
      </div>

      <div className={styles.content}>
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpPage;
