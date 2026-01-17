import styles from './styles.css';
import Button from 'components/buttons/Button';
import { ButtonKind } from 'components/buttons/Button/types';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { XIcon } from 'commonComponents/Icons';
import React from 'react';
import { useTranslation } from 'i18n';
import { useOnDeleteView } from '../hooks';
import { Id } from 'common/utils/identifier';

type NoAccessContentInterface = {
  viewId: Id;
};

function NoAccessContent(props: NoAccessContentInterface) {
  const { t } = useTranslation();
  const onDeleteView = useOnDeleteView(props.viewId);
  return (
    <div className={styles.noAccessContent}>
      <span className={styles.noAccessTitle}>{t(`It looks like you don't have access to some data`)}</span>
      <span className={styles.contactInfo}>
        {t(`Contact the Project Admin from your organization for more details`)}
      </span>
      <Button onClick={onDeleteView} kind={ButtonKind.DANGER}>
        {t('UNDERSTOOD')}
      </Button>
      <SecondaryButton className={styles.closeButton} onClick={onDeleteView}>
        <XIcon height={10} width={10} />
      </SecondaryButton>
    </div>
  );
}

export default NoAccessContent;
