

import CredentialsPage from 'components/auth/CredentialsPage';
import GoogleSignUpForm from 'components/auth/googleSignUp/GoogleSignUpForm';

import styles from './styles.css';

const GoogleSignUpPage = () => <CredentialsPage rightSideRenderer={renderSignInPage} />;

function renderSignInPage() {
  return (
    <div className={styles.signUpPage}>
      <div className={styles.content}>
        <GoogleSignUpForm />
      </div>
    </div>
  );
}

export default GoogleSignUpPage;
