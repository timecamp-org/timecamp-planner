import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import TermsAndConditions from 'commonComponents/TermsAndConditions';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';

import styles from './styles.css';

export const HONEYPOT_FIELD_NAME = 'name';
export const FORM_ID = 'sign_up_form';

SignUpForm.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  fullName: PropTypes.string,
  isRegistering: PropTypes.bool,
  isEmailInputDisabled: PropTypes.bool,
  isAcceptingTerms: PropTypes.bool,

  emailHumanMessageModel: PropTypes.object,
  passwordHumanMessageModel: PropTypes.object,
  genericHumanMessageModel: PropTypes.object,
  termsHumanMessageModel: PropTypes.object,
  fullNameHumanMessageModel: PropTypes.object,
  showHeader: PropTypes.bool,

  innerRefEmail: PropTypes.func,
  innerRefPassword: PropTypes.func,
  onEmailChange: PropTypes.func,
  onPasswordChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onSetIsAcceptingTerms: PropTypes.func,
  submitButtonRenderer: PropTypes.func,
  innerRefFullName: PropTypes.func,
  onFullNameChange: PropTypes.func,
};

SignUpForm.defaultProps = {
  email: '',
  password: '',
  fullName: '',
  isRegistering: false,
  isEmailInputDisabled: false,
  isAcceptingTerms: false,
  showHeader: true,

  emailHumanMessageModel: null,
  passwordHumanMessageModel: null,
  genericHumanMessageModel: null,
  termsHumanMessageModel: null,
  fullNameHumanMessageModel: null,

  innerRefEmail: doNothing,
  innerRefPassword: doNothing,
  onEmailChange: doNothing,
  onPasswordChange: doNothing,
  onSubmit: doNothing,
  onSetIsAcceptingTerms: doNothing,
  onFullNameChange: doNothing,
};

function SignUpForm(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component}>
      {props.showHeader && (
        <div className={styles.header}>
          {t('Get started')}
          <p className={styles.subheader}>
            {t('with Planner')}
          </p>
        </div>
      )}
      {renderForm()}
    </div>
  );

  function renderForm() {
    return (
      <form name={FORM_ID} onSubmit={props.onSubmit} className={styles.form} noValidate>
        <div className={styles.inputWrapper}>
          {renderFullName()}
          {renderEmailInput()}
          {renderPasswordInput()}
          {renderHoneypot()}
          <div className={styles.termsWrapper}>
            <TermsAndConditions />
          </div>
        </div>
        {props.submitButtonRenderer ? props.submitButtonRenderer() : renderSubmitButton()}
      </form>
    );
  }

  function renderFullName() {
    return (
      <>
        <label>{t('Name')}</label>
        <UserInput
          className={styles.input}
          onSetInnerRef={props.innerRefFullName}
          isDisabled={props.isRegistering}
          placeholder={t('John Doe')}
          type="text"
          name="field1"
          autoComplete={'off'}
          autoCorrect={'off'}
          autoCapitalize={'off'}
          value={props.fullName}
          onChange={props.onFullNameChange}
          humanMessage={props.fullNameHumanMessageModel}
        />
      </>
    );
  }

  function renderEmailInput() {
    return (
      <>
        <label>{t('Email')}</label>
        <UserInput
          className={styles.input}
          onSetInnerRef={props.innerRefEmail}
          isDisabled={props.isRegistering || props.isEmailInputDisabled}
          placeholder={t('jon.doe@company.com')}
          type="email"
          name="field2"
          autoComplete={'off'}
          autoCorrect={'off'}
          autoCapitalize={'off'}
          value={props.email}
          onChange={onEmailChange}
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
          onSetInnerRef={props.innerRefPassword}
          isDisabled={props.isRegistering}
          placeholder={t('Password')}
          type="password"
          name="field3"
          autoComplete={'off'}
          autoCorrect={'off'}
          autoCapitalize={'off'}
          value={props.password}
          onChange={onPasswordChange}
          humanMessage={props.passwordHumanMessageModel || props.genericHumanMessageModel}
        />
      </>
    );
  }

  function renderHoneypot() {
    return (
      <label htmlFor="name" aria-hidden="true" className={styles.extraField}>
        <input
          type="text"
          name={HONEYPOT_FIELD_NAME}
          id={HONEYPOT_FIELD_NAME}
          className={styles.extraField}
          tabIndex="-1"
          autoComplete="off"
        ></input>
      </label>
    );
  }

  function renderSubmitButton() {
    return (
      <Button type="submit" disabled={props.isRegistering} className={styles.submitButton}>
        {props.isRegistering ? t('Signing up...') : t('Get started now')}
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

export default SignUpForm;
