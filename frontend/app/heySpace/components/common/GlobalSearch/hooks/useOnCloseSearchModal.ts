import { useDispatch } from 'react-redux';

import { onCloseModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';

export const useOnCloseSearchModal = () => {
  const dispatch = useDispatch();

  return () => dispatch(onCloseModal(ModalType.GLOBAL_SEARCH_MODAL));
};
