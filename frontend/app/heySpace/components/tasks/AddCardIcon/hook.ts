import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { AddCardButtonInterface } from './AddCardIcon';
import { selectIsModalOpen } from 'models/component/ModalsModel/selectors';

export type AddCardButtonHookInterface = {
  onClick: VoidFunction;
  isModalOpen: boolean;
};

const useComponent = (props: AddCardButtonInterface): AddCardButtonHookInterface => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state) =>
    selectIsModalOpen(state, {
      modalType: ModalType.ADD_NEW_CARD_MODAL,
    })
  );

  const options = {
    projectId: props.projectId,
    shouldAutoAssign: props.shouldAutoAssign,
    taskCreateSource: props.taskCreateSource,
  };

  const onClick = useCallback(() => {
    dispatch(onOpenModal(ModalType.ADD_NEW_CARD_MODAL, options));
  }, [dispatch, options]);

  return {
    onClick,
    isModalOpen,
  };
};
export default useComponent;
