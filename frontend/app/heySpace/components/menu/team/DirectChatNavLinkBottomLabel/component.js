import PropTypes from 'prop-types';

import { ellipsizeInTheEnd } from 'common/utils';
import { useTranslation } from 'i18n';

import { Send as SendIcon } from '../../../common/Icons';
import ResendInvitationButton from '../../../common/ResendInvitationButton';

import styles from './styles.css';

DirectChatNavLinkBottomLabel.propTypes = {
  isConversationUserInvitationPending: PropTypes.bool,
  isUserActive: PropTypes.bool,
  isUserGuest: PropTypes.bool,
  isInvitedByLink: PropTypes.bool,
  userStatusTitle: PropTypes.string,
  conversationUserId: PropTypes.string,
  className: PropTypes.string,
  statusMaxLength: PropTypes.number,
};

function DirectChatNavLinkBottomLabel(props) {
  const { t } = useTranslation();
  const shouldRenderResendInvitationButton = props.isConversationUserInvitationPending && props.isUserActive;
  const shouldRenderGuestHint = props.isUserGuest && props.isUserActive && !props.isInvitedByLink;
  const shouldRenderUserStatus = props.isUserActive && props.userStatusTitle;
  const shouldRenderInvitedByLink =
    props.isInvitedByLink && props.isUserActive && props.isUserGuest && !props.userStatusTitle;

  if (shouldRenderResendInvitationButton) {
    return (
      <ResendInvitationButton conversationUserId={props.conversationUserId} shouldShowConfirmation>
        {(onClick) => (
          <span className={styles.resendInvitationButton} onClick={onClick}>
            <SendIcon className={styles.icon} />
            <span>{t('Resend invitation')}</span>
          </span>
        )}
      </ResendInvitationButton>
    );
  }

  return (
    <>
      {!props.isUserActive && <span className={styles.userHint}>{t('(Disabled)')}</span>}
      {shouldRenderInvitedByLink && <span className={styles.userHint}>{t('invited by link')}</span>}
      {shouldRenderGuestHint && <span className={styles.userHint}>{t('Guest')}</span>}
      {shouldRenderUserStatus && (
        <span className={props.className || styles.userHint}>
          {ellipsizeInTheEnd(props.userStatusTitle, props.statusMaxLength)}
        </span>
      )}
    </>
  );
}

export default DirectChatNavLinkBottomLabel;
