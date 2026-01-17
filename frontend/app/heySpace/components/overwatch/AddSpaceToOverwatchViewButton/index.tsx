import React from 'react';
import styles from './styles.css';
import { XIcon } from '../../common/Icons';
import { useTranslation } from 'i18n';
import useComponent from './hook';

const AddSpaceToOverwatchViewButton: React.FC = () => {
  const { t } = useTranslation();
  const { onClick } = useComponent();
  return (
    <div className={styles.Component} onClick={onClick}>
      <span className={styles.iconWrapper}>
        <XIcon className={styles.plusIcon} />
      </span>
      <span className={styles.buttonText}>{t('Add a project')}</span>
    </div>
  );
};

export default AddSpaceToOverwatchViewButton;
