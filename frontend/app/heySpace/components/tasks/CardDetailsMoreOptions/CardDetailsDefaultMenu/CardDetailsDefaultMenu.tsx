import { FC } from 'react';

import { BoxArchive } from 'commonComponents/Icons/fontawesome/BoxArchive';
import { Clone } from 'commonComponents/Icons/fontawesome/Clone';
import { Link } from 'commonComponents/Icons/fontawesome/Link';
import SecondaryButton from 'components/buttons/SecondaryButton';
import ExtensionVisibilityWrapper from 'components/extensions/ExtensionVisibilityWrapper';
import CardDetailsRecurrencyController from 'components/tasks/CardDetailsRecurrencyController';
import { useTranslation } from 'i18n';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';

import { useTaskArchive } from '../ArchiveCardModal/useTaskArchive';
import { usePopperContext } from '../CardDetailsPopperContext';
import styles from '../styles.css';
import { WithColorInterface } from '../types';

import { useAlertNotification } from 'common/hooks/useAlertNotification';
import { useCopyCardLink } from './hooks/useCopyCardLink';
import { useTaskDetails } from './hooks/useTaskDetails';

export const CardDetailsDefaultMenu: FC<WithColorInterface> = ({ color, onClosePopover }) => {
  const { t } = useTranslation();
  const { isTaskArchived, onToggleTaskArchive } = useTaskArchive();
  const { navigateToCopyCard } = usePopperContext();
  const { projectId, taskId } = useTaskDetails();
  const copyCardLink = useCopyCardLink();

  const onAlert = useAlertNotification({ id: `task-${taskId}-clipboard-link-copied` });

  const onClick = () => {
    onToggleTaskArchive();
    onClosePopover();
  };

  return (
    <ul className={styles.optionsList}>
      <li className={styles.optionsListItem}>
        <SecondaryButton color={color} className={styles.optionButton} onClick={navigateToCopyCard}>
          <Clone className={styles.icon} />
          <span className={styles.buttonCaption}>{t('Duplicate task')}</span>
        </SecondaryButton>
      </li>

      <li className={styles.optionsListItem}>
        <SecondaryButton
          color={color}
          className={styles.optionButton}
          onClick={() => {
            onAlert(t('You succesfully copied task link to clipboard'));
            copyCardLink();
            onClosePopover();
          }}
        >
          <Link className={styles.icon} />
          <span className={styles.buttonCaption}>{t('Copy task link')}</span>
        </SecondaryButton>
      </li>

      <li className={styles.optionsListItem}>
        <ExtensionVisibilityWrapper extensionNamespace={ExtensionNamespace.TASK_RECURRENCE} projectId={projectId}>
          <CardDetailsRecurrencyController taskId={taskId} className={styles.optionButton} />
        </ExtensionVisibilityWrapper>
      </li>

      <li className={styles.optionsListItem}>
        <SecondaryButton color={color} className={styles.optionButton} onClick={onClick}>
          <BoxArchive className={styles.icon} />
          <span className={styles.buttonCaption}>{isTaskArchived ? t('Unarchive task') : t('Archive task')}</span>
        </SecondaryButton>
      </li>
    </ul>
  );
};
