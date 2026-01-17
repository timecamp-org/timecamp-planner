import PropTypes from 'prop-types';

import EmptyState from 'commonAssets/emptyState/Empty_State_30.png';
import { useTranslation } from 'i18n';

import styles from './styles.css';

ForgottenPasswordSendLinkSuccessMessage.propTypes = {
  userEmail: PropTypes.string.isRequired,
};

function ForgottenPasswordSendLinkSuccessMessage(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component}>
      <img src={EmptyState} className={styles.character} />
      <div className={styles.title}>{t('Check your inbox!')}</div>
      <div className={styles.message}>
        {t('A link to change your password has been sent to')}
        <b>{` ${props.userEmail}`}</b>
      </div>
    </div>
  );
}

export default ForgottenPasswordSendLinkSuccessMessage;
