import { IconButton } from '@mui/material';
import * as taskActions from 'common/models/domain/TasksModel/actions';
import { Id } from 'common/utils/identifier';
import { Xmark } from 'commonComponents/Icons/fontawesome/Xmark';
import { useTranslation } from 'i18n';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { TASK_PRIORITY_LIST } from '../const';
import TaskPrioritiesListItem from './TaskPrioritiesListItem';
import { TitleLabel, TitleWrapper } from './styled';

interface TaskPrioritiesListInterface {
  taskId: Id;
  onClose: VoidFunction;
}

const TaskPrioritiesList: FC<TaskPrioritiesListInterface> = ({ taskId, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onChangePriorityFlag = (value) => () => {
    dispatch(taskActions.onSetTaskPriority(taskId, value));
    onClose();
  };
  const onClear = onChangePriorityFlag(null);

  return (
    <div>
      <TitleWrapper>
        <TitleLabel>{t('Set priority')}</TitleLabel>
        <IconButton onClick={onClose}>
          <Xmark />
        </IconButton>
      </TitleWrapper>

      <div>
        {TASK_PRIORITY_LIST.map(([key, value]) => {
          const onClick = onChangePriorityFlag(value);

          return <TaskPrioritiesListItem key={key} onClick={onClick} priorityType={key} label={t(key)} />;
        })}

        <TaskPrioritiesListItem isCrossed onClick={onClear} grayscale={true} priorityType={null} label={t('clear')} />
      </div>
    </div>
  );
};

export default TaskPrioritiesList;
