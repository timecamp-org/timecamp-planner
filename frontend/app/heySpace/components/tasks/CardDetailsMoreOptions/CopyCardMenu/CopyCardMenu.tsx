import Checkbox from 'commonComponents/Checkbox';
import UserInput from 'commonComponents/UserInput';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import { FC } from 'react';
import { useCopyCard } from '../CardDetailsDefaultMenu/hooks/useCopyCard';
import { usePopperContext } from '../CardDetailsPopperContext';
import styles from '../styles.css';
import { WithColorInterface } from '../types';

export const CopyCardMenu: FC<WithColorInterface> = ({ color }) => {
  const {
    newCardNameValue,
    onChangeCardName,
    onKeyDownCardNameInput,
    onToggleIsCopyAttachmentsChecked,
    isCopyAttachmentsChecked,
    onCopyCard: handleCopyCard,
  } = useCopyCard();
  const { resetContent } = usePopperContext();
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.title}>{t('Copy Task')}</div>
      <UserInput
        className={styles.sectionInput}
        label={t(`Task name:`)}
        value={newCardNameValue}
        autoFocus
        onChange={onChangeCardName}
        onKeyDown={onKeyDownCardNameInput}
      />
      <div className={styles.checkboxRow} onClick={onToggleIsCopyAttachmentsChecked}>
        <Checkbox className={styles.checkbox} color={color} isChecked={isCopyAttachmentsChecked} />
        <span>{t('Copy attachments')}</span>
      </div>
      <div className={styles.buttons}>
        <SecondaryButton color={color} onClick={resetContent}>
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton color={color} onClick={handleCopyCard}>
          {t('Copy task')}
        </PrimaryButton>
      </div>
    </>
  );
};
