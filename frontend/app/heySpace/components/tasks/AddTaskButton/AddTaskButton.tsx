import { FC } from 'react';

import { Button, SxProps } from '@mui/material';
import { useDispatch } from 'react-redux';

import { Plus } from 'commonComponents/Icons/fontawesome/Plus';
import { useTranslation } from 'i18n';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { TaskCreateSource, TaskPriorityTypes } from 'models/domain/TasksModel/types';

const buttonStyles: SxProps = {
  fontSize: 'var(--fontSize-xxs)',
  fontWeight: 'var(--fontWeight-regular)',
  color: 'var(--color-gray-700)',
  display: 'flex',
  gap: '.8rem',
};

export interface AddTaskButtonInterface {
  projectId: string;
  taskCreateSource: TaskCreateSource;
  assignees?: string[];
  dueDate?: number;
  priority?: TaskPriorityTypes;
}

export const AddTaskButton: FC<AddTaskButtonInterface> = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onClick = () => {
    dispatch(onOpenModal(ModalType.ADD_NEW_CARD_MODAL, props));
  };

  return (
    <Button variant="text-reversed" onClick={onClick} sx={buttonStyles}>
      <Plus />
      {t('Add task')}
    </Button>
  );
};
