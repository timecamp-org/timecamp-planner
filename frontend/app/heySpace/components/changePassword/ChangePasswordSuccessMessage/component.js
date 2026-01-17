import PropTypes from 'prop-types';

import EmptyState from 'commonAssets/emptyState/Empty_State_26.png';
import NavLink from 'commonComponents/NavLink';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { useTranslation } from 'i18n';
import { FIRST_PROJECT_NAME } from 'models/domain/ProjectsModel/constants';
import colorStyles from 'styles/colors.css';

import styles from './styles.css';

ChangePasswordSuccessMessage.propTypes = {
  userEmail: PropTypes.string.isRequired,
};

function ChangePasswordSuccessMessage(props) {
  const { t } = useTranslation();

  return (
    <div className={styles.Component}>
      <img src={EmptyState} className={styles.character} />
      <div className={styles.title}>{t(`You've got a new password!`)}</div>
      <div className={styles.message}>
        {t('Password for')}
        <b> {` ${props.userEmail} `} </b>
        {t('has been successfully changed.')}
      </div>
      <NavLink className={styles.navLink} to={`/projects/${FIRST_PROJECT_NAME}`}>
        <PrimaryButton color={colorStyles.wisteriaColor} className={styles.button}>
          {t('Sign in')}
        </PrimaryButton>
      </NavLink>
    </div>
  );
}

export default ChangePasswordSuccessMessage;
