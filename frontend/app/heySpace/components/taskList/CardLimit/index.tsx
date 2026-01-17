import React from 'react';

import { Id } from 'common/utils/identifier';
import UserInput from 'commonComponents/UserInput';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import { useTranslation } from 'i18n';

import { useComponent } from './hook';
import styles from './styles.css';

export interface CardLimitInterface {
  objectId: Id;
  sectionId: Id;
  onCardLimitCancelled: VoidFunction;
  onCardLimitSaved: VoidFunction;
}

const CardLimit: React.FC<CardLimitInterface> = (props) => {
  const { t } = useTranslation();
  const { color, limit, onKeyDown, onLimitChange, onSaveLimit, onRemoveLimit } = useComponent(props);

  return (
    <div className={styles.Component}>
      <div className={styles.row}>
        <UserInput
          className={styles.positionInput}
          label={t('Task Limit:')}
          type={'number'}
          autoFocus
          min={0}
          value={limit}
          onChange={onLimitChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className={styles.buttons}>
        <SecondaryButton color={color} onClick={onRemoveLimit} className={styles.removeLimitButton}>
          {t('Remove')}
        </SecondaryButton>
        <SecondaryButton color={color} onClick={props.onCardLimitCancelled}>
          {t('Cancel')}
        </SecondaryButton>
        <PrimaryButton color={color} onClick={onSaveLimit}>
          {t('Set Limit')}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default CardLimit;
