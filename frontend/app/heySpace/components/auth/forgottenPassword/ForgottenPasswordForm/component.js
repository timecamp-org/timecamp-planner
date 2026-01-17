import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import UserInput from 'commonComponents/UserInput';
import ForgottenPasswordSendLinkSuccessMessage from 'components/auth/forgottenPassword/ForgottenPasswordSendLinkSuccessMessage';
import { useTranslation } from 'i18n';

import styles from './styles.css';

ForgottenPasswordForm.propTypes = {
  email: PropTypes.string,
  isLoading: PropTypes.bool,

  emailHumanMessageModel: PropTypes.object,
  genericHumanMessageModel: PropTypes.object,
  sendLinkSuccess: PropTypes.bool,

  onEmailChange: PropTypes.func,
  onEmailInputBlur: PropTypes.func,
  onSubmit: PropTypes.func,
};

ForgottenPasswordForm.defaultProps = {
  email: '',
  isLoading: false,

  genericHumanMessageModel: null,
  sendLinkSuccess: false,

  onEmailChange: doNothing,
  onEmailInputBlur: doNothing,
  onSubmit: doNothing,
};

function ForgottenPasswordForm(props) {
  const { t } = useTranslation();

  return <div className={styles.Component}>{props.sendLinkSuccess ? renderSuccessMessage() : renderForm()}</div>;

  function renderForm() {
    return (
      <form onSubmit={props.onSubmit} className={styles.form}>
        <div className={styles.header}>{t('Forgotten password?')}</div>
        {renderEmailInput()}
        {renderSubmitButton()}
      </form>
    );
  }

  function renderEmailInput() {
    return (
      <UserInput
        className={styles.input}
        innerClassName={styles.credentialsInputInner}
        isDisabled={props.isLoading}
        placeholder="Email"
        type="email"
        name="email"
        autoComplete={'email'}
        value={props.email}
        onChange={onEmailChange}
        onBlur={props.onEmailInputBlur}
        humanMessage={props.emailHumanMessageModel || props.genericHumanMessageModel}
      />
    );
  }

  function renderSubmitButton() {
    return (
      <Button type="submit" className={styles.submitButton} disabled={props.isLoading}>
        {`${props.isLoading ? t('Submitting') : t('Submit')}`}
      </Button>
    );
  }

  function renderSuccessMessage() {
    return <ForgottenPasswordSendLinkSuccessMessage userEmail={props.email} />;
  }

  function onEmailChange(event) {
    props.onEmailChange(event.target.value);
  }
}

export default ForgottenPasswordForm;
