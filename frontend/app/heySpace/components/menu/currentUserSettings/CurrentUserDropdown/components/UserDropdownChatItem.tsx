import { useTranslation } from 'common/i18n';
import { CustomerMessagingPlatform } from 'common/services';
import { Messages } from 'commonComponents/Icons/fontawesome/Messages';
import SecondaryButton from 'components/buttons/SecondaryButton';

import styles from '../styles.css';

export const UserDropdownChatItem = () => {
  const { t } = useTranslation();

  const onClick = () => {
    CustomerMessagingPlatform.startChat();
  };

  return (
    <SecondaryButton onClick={onClick} className={styles.menuItem}>
      <div className={styles.iconWrapper}>
        <Messages />
      </div>
      <div> {t('Chat with us')}</div>
    </SecondaryButton>
  );
};

export default UserDropdownChatItem;
