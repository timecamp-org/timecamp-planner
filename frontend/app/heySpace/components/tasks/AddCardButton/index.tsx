import React from 'react';

import { useTranslation } from 'i18n';

import { XIcon } from '../../common/Icons';
import { AddTask, AddTaskInterface } from '../AddTask';

import styles from './styles.css';

const AddCardButton: React.FC<AddTaskInterface> = (props) => {
  const { t } = useTranslation();

  return (
    <AddTask {...props} className={props.className || styles.Component}>
      <span className={styles.iconWrapper}>
        <XIcon className={styles.plusIcon} />
      </span>
      <span className={styles.buttonText}>{t('Add a Task')}</span>
    </AddTask>
  );
};

export default AddCardButton;
