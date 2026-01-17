import { FC } from 'react';

import { Button } from '@mui/material';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import { i18mark, useTranslation } from 'common/i18n';
import { Id } from 'common/utils/identifier';
import ColoredProjectIcon from 'commonComponents/ColoredProjectIcon';
import DueDate from 'commonComponents/DueDate';
import { useOnCloseSearchModal } from 'commonComponents/GlobalSearch/hooks/useOnCloseSearchModal';
import ProjectName from 'components/projects/projectName/ProjectName';
import ListNameOutput from 'components/taskList/ListNameOutput';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { TaskStatus } from 'models/domain/TasksModel/types';

import { ItemLayout } from './ItemLayout';

export interface TaskItemInterface {
  id: Id;
  projectId: Id;
  taskListId: Id;
  name: string;
  isArchived: boolean;
  dueDate?: number;
  status: TaskStatus;
}

const TASK_STATUS_TRANSLATION_MAP = {
  [TaskStatus.ACTIVE]: i18mark('In progress'),
  [TaskStatus.COMPLETED]: i18mark('Done'),
};

const format = 'DD/MM/YYYY';

export const TaskItem: FC<TaskItemInterface> = ({ id, projectId, isArchived, name, taskListId, dueDate, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onCloseSearchModal = useOnCloseSearchModal();

  const onClick = () => {
    dispatch(AppModelActions.onSetOpenedCardDetailsModalId(id));
    onCloseSearchModal();
  };

  return (
    <ItemLayout
      isArchived={isArchived}
      img={<ColoredProjectIcon projectId={projectId} />}
      title={name}
      subtitle={
        <>
          <span>{get(TASK_STATUS_TRANSLATION_MAP, status)}</span> •
          <ProjectName projectId={projectId} /> &gt; <ListNameOutput listId={taskListId} />
          {dueDate && (
            <>
              • {t('Due:')}
              <DueDate dueDate={dueDate} format={format} />
            </>
          )}
        </>
      }
      actionButtons={<Button onClick={onClick}>{t('Open')}</Button>}
    />
  );
};
