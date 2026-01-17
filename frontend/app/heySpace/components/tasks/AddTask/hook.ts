import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';

import { AddCardButtonInterface } from '../AddCardIcon/AddCardIcon';

export type AddCardButtonHookInterface = {
  onClick: VoidFunction;
};

const useComponent = (props: AddCardButtonInterface): AddCardButtonHookInterface => {
  const dispatch = useDispatch();

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
  };
};
export default useComponent;
