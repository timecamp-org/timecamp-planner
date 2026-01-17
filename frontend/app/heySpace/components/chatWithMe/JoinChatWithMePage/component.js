import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import LoadingDots from 'commonComponents/LoadingDots';
import CredentialsPage from 'components/auth/CredentialsPage';
import GoogleSignUpForm from 'components/auth/googleSignUp/GoogleSignUpForm';
import SignInForm from 'components/auth/signIn/SignInForm';
import SignUpForm from 'components/auth/signUp/SignUpForm';
import TopBar from 'components/auth/TopBar';
import PrimaryButton from 'components/buttons/PrimaryButton';
import PersonFullName from 'components/person/PersonFullName';
import UserAvatar from 'components/settings/userProfile/UserAvatar';

import { useTranslation } from '../../../../common/i18n';

import styles from './styles.css';

JoinChatWithMePage.propTypes = {
  userId: PropTypes.string,
  organizationName: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  isSigningUp: PropTypes.bool,
  isJoinButtonDisabled: PropTypes.bool,
  isLoaded: PropTypes.bool,
  onJoinChat: PropTypes.func,
  onSwitchToSignUp: PropTypes.func,
  onJoinAfterGoogleSignIn: PropTypes.func,
  onJoinAfterGoogleSignUp: PropTypes.func,
};

JoinChatWithMePage.defaultProps = {
  organizationName: '',
  isSigningUp: false,
  isJoinButtonDisabled: false,
  isLoaded: false,
  onJoinChat: doNothing,
  onSwitchToSignUp: doNothing,
  onJoinAfterGoogleSignIn: doNothing,
  onJoinAfterGoogleSignUp: doNothing,
};

function JoinChatWithMePage(props) {
  const { t } = useTranslation();

  return <CredentialsPage rightSideRenderer={props.isLoaded ? renderPage : renderLoadingDots} />;

  function renderPage() {
    const shouldRenderAuthenticationInfo = props.isAuthenticated && !props.isSigningUp && !props.isJoining;

    return (
      <div className={styles.page}>
        {renderTopBar(props, t)}
        <div className={styles.content}>
          {props.userId && renderInviterInfo(props, t)}
          <div className={styles.formContent}>
            {shouldRenderAuthenticationInfo && renderAuthenticationInfo(props, t)}
            {props.showGoogleSignUpConfirmation ? renderGoogleSignUpConfirmation(props) : renderCredentialsForm()}
          </div>
        </div>
      </div>
    );
  }

  function renderCredentialsForm() {
    return props.isSigningUp ? renderSighUpForm() : props.isAuthenticated ? renderJoinButton() : renderSignInForm();
  }

  function renderSignInForm() {
    return (
      <SignInForm
        shouldRenderForgotPasswordLink={false}
        submitButtonRenderer={renderJoinButton}
        showHeader={false}
        onSubmit={props.onJoinChat}
        onCustomSignInWithGoogle={props.onJoinAfterGoogleSignIn}
      />
    );
  }

  function renderSighUpForm() {
    return (
      <SignUpForm
        shouldRenderForgotPasswordLink={false}
        submitButtonRenderer={renderJoinButton}
        showHeader={false}
        onSubmit={props.onJoinChat}
        onCustomSignInWithGoogle={props.onJoinAfterGoogleSignIn}
      />
    );
  }

  function renderJoinButton() {
    return (
      <div className={styles.form}>
        <PrimaryButton className={styles.joinButton} isDisabled={props.isJoinButtonDisabled} onClick={props.onJoinChat}>
          {t(`Join "{{workspaceName}}" team`, {
            workspaceName: props.organizationName,
          })}
        </PrimaryButton>
        <span className={styles.formHint}>
          {t('You will join another workspace! Don’t worry you can leave it anytime you want :)')}
        </span>
      </div>
    );
  }
}

function renderTopBar(props, t) {
  if (props.isSigningUp) {
    return (
      <TopBar text={t(`Already have an account?`)} buttonText={t(`Sign in`)} onButtonClick={props.onSwitchToSignIn} />
    );
  } else {
    return (
      <TopBar
        text={t(`Want to set up new account?`)}
        buttonText={t(`Sign up`)}
        onButtonClick={props.onSwitchToSignUp}
      />
    );
  }
}

function renderInviterInfo(props, t) {
  return (
    <div className={styles.inviterInfoWrapper}>
      <div className={styles.inviterInfo}>
        <UserAvatar userId={props.userId} className={styles.userAvatar} />
        <div className={styles.userInfoContent}>
          <span className={styles.header}>{t('Chat with me!')}</span>
          <PersonFullName className={styles.personFullName} userId={props.userId} />
        </div>
      </div>
      <span className={styles.hint}>{t('Get started with Planner and get your own free Workspace')}</span>
    </div>
  );
}

function renderAuthenticationInfo(props, t) {
  return (
    <div className={styles.authenticationInfo}>
      {t('Logged in as: ')}
      <span className={styles.email}>{props.userEmail}</span>
    </div>
  );
}

function renderLoadingDots() {
  return (
    <div className={styles.loaderWrapper}>
      <LoadingDots className={styles.loadingDots} />
    </div>
  );
}

function renderGoogleSignUpConfirmation(props) {
  return <GoogleSignUpForm onCustomSignUpWithGoogleAccount={props.onJoinAfterGoogleSignUp} />;
}

export default JoinChatWithMePage;
