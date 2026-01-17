import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { doNothing } from 'common/utils';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';

import styles from './styles.css';

SignInForm.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  isLoggingIn: PropTypes.bool,
  shouldRenderForgotPasswordLink: PropTypes.bool,
  showHeader: PropTypes.bool,

  emailHumanMessageModel: PropTypes.object,
  passwordHumanMessageModel: PropTypes.object,
  genericHumanMessageModel: PropTypes.object,

  innerRefEmail: PropTypes.func,
  innerRefPassword: PropTypes.func,
  onEmailChange: PropTypes.func,
  onEmailInputBlur: PropTypes.func,
  onPasswordChange: PropTypes.func,
  onPasswordInputBlur: PropTypes.func,
  onSubmit: PropTypes.func,
  submitButtonRenderer: PropTypes.func,
};

SignInForm.defaultProps = {
  email: '',
  password: '',
  isLoggingIn: false,
  shouldRenderForgotPasswordLink: true,
  showHeader: true,

  emailHumanMessageModel: null,
  passwordHumanMessageModel: null,
  genericHumanMessageModel: null,

  innerRefEmail: doNothing,
  innerRefPassword: doNothing,
  onEmailChange: doNothing,
  onEmailInputBlur: doNothing,
  onPasswordChange: doNothing,
  onPasswordInputBlur: doNothing,
  onSubmit: doNothing,
};

function SignInForm(props) {
  const { t } = useTranslation();

  return (
    <div className={props.className || styles.Component}>
      {props.showHeader && <div className={styles.header}>{t('Log in to Planner')}</div>}
      {renderForm(t)}
    </div>
  );

  function renderForm() {
    return (
      <form className={styles.form} onSubmit={props.onSubmit} noValidate>
        <section className={styles.inputSection}>
          <div className={styles.inputWrapper}>{renderEmailInput()}</div>
          <div className={styles.inputWrapper}>{renderPasswordInput()}</div>
          <div className={styles.inputWrapper}>{props.shouldRenderForgotPasswordLink && renderForgotPassword()}</div>
        </section>

        {props.submitButtonRenderer ? props.submitButtonRenderer() : renderSubmitButton()}
        <Link to="/register" className={`${styles.link} ${styles.noAccount}`}>
          {t('No account? Sign up')}
        </Link>
      </form>
    );
  }

  function renderEmailInput() {
    return (
      <>
        <label>{t('Email')}</label>
        <UserInput
          className={styles.input}
          innerClassName=""
          onSetInnerRef={props.innerRefEmail}
          isDisabled={props.isLoggingIn}
          placeholder={t('jon.doe@company.com')}
          type="email"
          name="email"
          autoComplete={'email'}
          value={props.email}
          onChange={onEmailChange}
          onBlur={props.onEmailInputBlur}
          humanMessage={props.emailHumanMessageModel}
        />
      </>
    );
  }

  function renderPasswordInput() {
    return (
      <>
        <label>{t('Password')}</label>
        <UserInput
          className={styles.input}
          innerClassName=""
          onSetInnerRef={props.innerRefPassword}
          isDisabled={props.isLoggingIn}
          placeholder={t('Password')}
          type="password"
          name="password"
          autoComplete={'current-password'}
          value={props.password}
          onChange={onPasswordChange}
          onBlur={props.onPasswordInputBlur}
          humanMessage={props.passwordHumanMessageModel || props.genericHumanMessageModel}
        />
      </>
    );
  }

  function renderForgotPassword() {
    return (
      <Link tabIndex="-1" to="/forgottenPassword" className={`${styles.forgottenPassword} ${styles.link}`}>
        {t('Forgotten Password?')}
      </Link>
    );
  }

  function renderSubmitButton() {
    return (
      <Button className={styles.submitButton} onClick={props.onSubmit} disabled={props.isLoggingIn} type="submit">
        {props.isLoggingIn ? t('Logging in...') : t('Log in')}
      </Button>
    );
  }

  function onEmailChange(event) {
    props.onEmailChange(event.target.value);
  }

  function onPasswordChange(event) {
    props.onPasswordChange(event.target.value);
  }
}

export default SignInForm;
