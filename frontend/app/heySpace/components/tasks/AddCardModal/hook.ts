import { useCallback } from 'react';

import { List } from 'immutable';
import { useDispatch, useSelector } from 'react-redux';

import { Id } from 'common/utils/identifier';
import { onCloseModal } from 'models/component/ModalsModel/actions';
import { selectIsModalOpen, selectModal, selectModalProperty } from 'models/component/ModalsModel/selectors';
import { ModalType } from 'models/component/ModalsModel/types';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

export type AddCardModalHookInterface = {
  isModalOpen: boolean;
  projectId: Id;
  shouldAutoAssign: boolean;
  taskCreateSource: TaskCreateSource;
  assignees?: List<Id>;
  startDate?: number;
  dueDate?: number;
  listId: Id;
  onClose(): void;
};

export default function (): AddCardModalHookInterface {
  const isModalOpen = useSelector((state) => selectIsModalOpen(state, { modalType: ModalType.ADD_NEW_CARD_MODAL }));
  const projectId = useSelector((state) =>
    selectModalProperty(state, { modalType: ModalType.ADD_NEW_CARD_MODAL, property: 'projectId' })
  ) as Id;
  const shouldAutoAssign = useSelector((state) =>
    selectModalProperty(state, { modalType: ModalType.ADD_NEW_CARD_MODAL, property: 'shouldAutoAssign' })
  ) as boolean;
  const taskCreateSource = useSelector((state) =>
    selectModalProperty(state, { modalType: ModalType.ADD_NEW_CARD_MODAL, property: 'taskCreateSource' })
  ) as TaskCreateSource;

  const modalData = useSelector((state) => selectModal(state, { modalType: ModalType.ADD_NEW_CARD_MODAL }));

  const startDate = modalData?.get('startDate') as number | undefined;
  const dueDate = modalData?.get('dueDate') as number | undefined;
  const assignees = List<Id>(modalData?.get('assignees'));
  const listId = modalData?.get('list') as Id | undefined;

  const dispatch = useDispatch();
  const onClose = useCallback(() => dispatch(onCloseModal(ModalType.ADD_NEW_CARD_MODAL)), [dispatch]);

  return {
    isModalOpen,
    projectId,
    shouldAutoAssign,
    taskCreateSource,
    assignees,
    startDate,
    dueDate,
    listId,
    onClose,
  };
}
