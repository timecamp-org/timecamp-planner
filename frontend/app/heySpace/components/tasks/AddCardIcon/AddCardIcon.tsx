import React from 'react';

import { Id } from 'common/utils/identifier';
import { useTranslation } from 'i18n';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

import { Add } from 'commonComponents/Icons/fontawesome/Add';
import SecondaryButton from 'components/buttons/SecondaryButton';
import useComponent from './hook';
import styles from './styles.css';

const colorPrimary500 = 'var(--color-primary-500)';

export type AddCardButtonInterface = {
  projectId?: Id;
  shouldAutoAssign?: boolean;
  taskCreateSource: TaskCreateSource;
  className?: string;
};

const AddCardButton: React.FC<AddCardButtonInterface> = (props) => {
  const { t } = useTranslation();
  const { onClick, isModalOpen } = useComponent(props);

  return (
    <SecondaryButton className={props.className || styles.Component} color={colorPrimary500} onClick={onClick}>
      <Add color={isModalOpen ? colorPrimary500 : ''} />
    </SecondaryButton>
  );
};

export default AddCardButton;
