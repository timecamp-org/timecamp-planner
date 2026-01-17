import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import { doNothing } from 'common/utils';

import UserInput from 'commonComponents/UserInput';
import SubmitButton from 'commonComponents/SubmitButton';
import ChangePasswordSuccessMessage from 'components/changePassword/ChangePasswordSuccessMessage';
import { useTranslation } from 'i18n';

ChangePasswordForm.propTypes = {
  password: PropTypes.string,
  confirmPassword: PropTypes.string,
  isChanging: PropTypes.bool,
  genericHumanMessageModel: PropTypes.object,
  passwordChanged: PropTypes.bool,
  userEmail: PropTypes.string,

  onChangePassword: PropTypes.func,
  onChangeConfirmPassword: PropTypes.func,
  onSubmit: PropTypes.func,
};

ChangePasswordForm.defaultProps = {
  password: '',
  confirmPassword: '',
  userEmail: '',
  isChanging: false,
  passwordChanged: false,

  genericHumanMessageModel: null,

  onChangePassword: doNothing,
  onChangeConfirmPassword: doNothing,
  onSubmit: doNothing,
};

function ChangePasswordForm(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>{props.passwordChanged ? renderPassswordChangedMessage() : renderForm()}</div>
  );

  function renderForm() {
    return (
      <form onSubmit={props.onSubmit} className={styles.form}>
        <div className={styles.header}>{t('Change password')}</div>
        <div className={styles.infoText}>{t('Please enter your new password to Planner account.')}</div>
        {renderPasswordInput()}
        {renderConfirmPasswordInput()}
        {renderSubmitButton()}
      </form>
    );
  }

  function renderPasswordInput() {
    return (
      <UserInput
        className={styles.passwordUserInput}
        innerClassName={``}
        isDisabled={props.isLoading}
        label={t('Password:')}
        placeholder={t('password')}
        type="password"
        name="password"
        autoComplete={'new-password'}
        value={props.password}
        onChange={onChangePassword}
        humanMessage={props.passwordHumanMessageModel}
      />
    );
  }

  function renderConfirmPasswordInput() {
    return (
      <UserInput
        className={styles.passwordUserInput}
        innerClassName={``}
        isDisabled={props.isLoading}
        label={t('Confirm password:')}
        placeholder={t('password')}
        type="password"
        name="password"
        autoComplete={'new-password'}
        value={props.confirmPassword}
        onChange={onChangeConfirmPassword}
        humanMessage={props.confirmPasswordHumanMessageModel}
      />
    );
  }

  function renderSubmitButton() {
    return (
      <SubmitButton
        innerClassName={`${styles.submitButton} ${props.isChanging ? styles.activeSubmitButton : undefined}`}
        name={`${props.isChanging ? t('Changing password...') : t('Change password')}`}
        type={'submit'}
        isDisabled={props.isChanging}
      />
    );
  }

  function renderPassswordChangedMessage() {
    return <ChangePasswordSuccessMessage userEmail={props.userEmail} />;
  }

  function onChangePassword(event) {
    props.onChangePassword(event.target.value);
  }

  function onChangeConfirmPassword(event) {
    props.onChangeConfirmPassword(event.target.value);
  }
}

export default ChangePasswordForm;
