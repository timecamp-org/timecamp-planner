import { FC } from 'react';

import { NavSidebarButtonLayout } from 'commonComponents/Layouts/Navigation';
import NavButton from 'components/buttons/NavButton/NavButton';
import { useTranslation } from 'i18n';

import styles from './styles.css';

const ChatWithMeButton: FC = () => {
  const { t } = useTranslation();

  return (
    <NavButton to="/chatWithMe">
      <NavSidebarButtonLayout
        icon={
          <span className={styles.mascotWrapper}>
            <span className={styles.mascot} />
          </span>
        }
        text={t('Get a Chat link')}
      />
    </NavButton>
  );
};

export default ChatWithMeButton;
