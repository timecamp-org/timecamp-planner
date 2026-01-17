import React from 'react';
import styles from './styles.css';
import PropTypes from 'prop-types';
import { doNothing } from 'common/utils';

import SubmitButton from 'commonComponents/SubmitButton';
import TermsAndConditionsCheckbox from 'commonComponents/TermsAndConditionsCheckbox';
import { useTranslation } from 'i18n';

GoogleSignUpForm.propTypes = {
  fullName: PropTypes.string,
  avatar: PropTypes.string,
  isRegistering: PropTypes.bool,
  isRegisteringWithGoogleAccount: PropTypes.bool,
  isAcceptingTerms: PropTypes.bool,

  termsHumanMessageModel: PropTypes.object,

  onSubmit: PropTypes.func,
  onSetIsAcceptingTerms: PropTypes.func,
};

GoogleSignUpForm.defaultProps = {
  isRegistering: false,
  isAcceptingTerms: false,

  termsHumanMessageModel: null,

  onSubmit: doNothing,
  onSetIsAcceptingTerms: doNothing,
};

function GoogleSignUpForm(props) {
  const { t } = useTranslation();
  return (
    <div className={styles.Component}>
      <div className={styles.header}>
        <img src={props.avatar} role="presentation" className={styles.avatar} />
        {`${t('Hello')} ${props.fullName}`}
      </div>
      <div className={styles.hint}>
        {t(
          `You're almost ready to explore Planner. Confirm that you agree to our terms and conditions and privacy policy and you're ready to go.`
        )}
      </div>
      {renderForm()}
    </div>
  );

  function renderForm() {
    return (
      <form onSubmit={props.onSubmit} className={styles.form} noValidate>
        {renderTermsAndConditionsCheckbox()}
        {renderSubmitButton()}
      </form>
    );
  }

  function renderSubmitButton() {
    return (
      <SubmitButton
        innerClassName={`${props.isRegistering ? styles.submitButtonLoading : styles.submitButton}`}
        name={`${props.isRegistering ? t('Signing up...') : t('Sign up')}`}
        type={'submit'}
        isDisabled={props.isRegistering}
      />
    );
  }

  function renderTermsAndConditionsCheckbox() {
    return (
      <TermsAndConditionsCheckbox
        isAcceptingTerms={props.isAcceptingTerms}
        termsHumanMessageModel={props.termsHumanMessageModel}
        onSetIsAcceptingTerms={props.onSetIsAcceptingTerms}
      />
    );
  }
}

export default GoogleSignUpForm;
