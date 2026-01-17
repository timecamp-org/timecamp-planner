import { doNothing } from 'common/utils';
import { PaperPlane } from 'commonComponents/Icons/fontawesome/PaperPlane';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';
import PropTypes from 'prop-types';
import styles from './styles.css';

ResendInvitationSettingsButtonContent.propTypes = {
  className: PropTypes.string,
  onResendInvitation: PropTypes.func,
};

ResendInvitationSettingsButtonContent.defaultProps = {
  onResendInvitation: doNothing,
};

function ResendInvitationSettingsButtonContent(props) {
  const { t } = useTranslation();

  return (
    <SecondaryButton className={props.className} onClick={props.onResendInvitation}>
      <PaperPlane className={styles.icon} />
      {t('Resend invitation')}
    </SecondaryButton>
  );
}

export default ResendInvitationSettingsButtonContent;
