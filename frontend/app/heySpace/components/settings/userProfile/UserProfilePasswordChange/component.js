import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { doNothing } from 'common/utils';
import UserInput from 'commonComponents/UserInput';
import { useTranslation } from 'i18n';

import styles from './styles.css';

UserProfilePasswordChange.propTypes = {
  onChangePassword: PropTypes.func,
  onShowForm: PropTypes.func,
  onCurrentPasswordBlur: PropTypes.func,
  onNewPasswordBlur: PropTypes.func,
  onConfirmPasswordBlur: PropTypes.func,
  onFormKeyDown: PropTypes.func,

  currentPasswordRef: PropTypes.func,
  newPasswordRef: PropTypes.func,
  confirmPasswordRef: PropTypes.func,
};

UserProfilePasswordChange.defaultProps = {
  onChangePassword: doNothing,
  onShowForm: doNothing,
  onCurrentPasswordBlur: doNothing,
  onNewPasswordBlur: doNothing,
  onConfirmPasswordBlur: doNothing,
  onFormKeyDown: doNothing,

  currentPasswordRef: doNothing,
  newPasswordRef: doNothing,
  confirmPasswordRef: doNothing,
};

function UserProfilePasswordChange(props) {
  const { t } = useTranslation();

  return <div className={styles.Component}>{props.isFormVisible ? renderForm() : renderShowFormButton()}</div>;

  function renderShowFormButton() {
    return (
      <Button variant="text" onClick={props.onShowForm}>
        {t('CHANGE PASSWORD')}
      </Button>
    );
  }

  function renderForm() {
    return (
      <div onKeyDown={props.onFormKeyDown} className={styles.form}>
        <UserInput
          className={styles.input}
          onSetInnerRef={props.currentPasswordRef}
          label={t('Current password:')}
          type="password"
          onBlur={props.onCurrentPasswordBlur}
          onFocus={props.onCurrentPasswordFocus}
          humanMessage={props.currentPasswordHumanMessage}
        />
        <UserInput
          className={styles.input}
          onSetInnerRef={props.newPasswordRef}
          label={t('New password:')}
          type="password"
          onBlur={props.onNewPasswordBlur}
          onFocus={props.onNewPasswordFocus}
          humanMessage={props.newPasswordHumanMessage}
        />
        <UserInput
          className={styles.input}
          onSetInnerRef={props.confirmPasswordRef}
          label={t('Confirm password:')}
          type="password"
          onBlur={props.onConfirmPasswordBlur}
          onFocus={props.onConfirmPasswordFocus}
          humanMessage={props.confirmPasswordHumanMessage}
        />
        <Button
          className={props.isLoading ? styles.saveButtonLoading : styles.saveButton}
          onClick={props.onChangePassword}
          disabled={props.isLoading}
        >
          {props.isLoading ? t('CHANGING...') : t('CHANGE')}
        </Button>
      </div>
    );
  }
}

export default UserProfilePasswordChange;
