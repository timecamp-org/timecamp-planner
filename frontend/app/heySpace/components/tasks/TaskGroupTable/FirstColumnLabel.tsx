import { FC } from 'react';

import { ButtonBase } from '@mui/material';

import { ChevronDown } from 'commonComponents/Icons/fontawesome/ChevronDown';
import { ChevronUp } from 'commonComponents/Icons/fontawesome/ChevronUp';
import StopClickEventPropagation from 'commonComponents/StopClickEventPropagation/component';
import { useTranslation } from 'i18n';
import { TaskGroupBy } from 'models/domain/TasksModel/types';

import { getGroupHeader } from './helpers';
import styles from './styles.css';

interface FirstColumnLabelInterface {
  disableCollapse: boolean;
  isOpen: boolean;
  groupBy: TaskGroupBy;
  groupId: string;
  itemsTotal: number;
  onClick: () => void;
}
export const FirstColumnLabel: FC<FirstColumnLabelInterface> = ({
  disableCollapse,
  isOpen,
  groupBy,
  groupId,
  itemsTotal,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.nameColumn}>
      {!disableCollapse && (
        <StopClickEventPropagation>
          <ButtonBase className={styles.openButton} onClick={onClick}>
            {isOpen ? <ChevronDown /> : <ChevronUp />}
          </ButtonBase>
        </StopClickEventPropagation>
      )}
      {getGroupHeader({ groupBy, groupId })}
      {!!itemsTotal && (
        <span className={styles.itemsTotal}>
          {itemsTotal} {t(itemsTotal > 1 ? 'TASKS' : 'TASK')}
        </span>
      )}
    </div>
  );
};
