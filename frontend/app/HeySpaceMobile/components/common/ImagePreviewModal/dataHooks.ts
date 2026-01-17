import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import * as ModalsModel from 'models/component/ModalsModel/actions'
import { ModalType } from '../../../../common/models/component/ModalsModel/types'
import { useSelector } from '../../../../common/hooks/useSelector'
import {
  selectIsModalOpen,
  selectModalProperty
} from '../../../../common/models/component/ModalsModel/selectors'

interface DataProviderInterface {
  isOpen: boolean,
  fileUrl: string,
}

export const useDataProvider = (): DataProviderInterface => ({
  isOpen: useSelector(state => selectIsModalOpen(state, {
    modalType: ModalType.MOBILE_IMAGE_VIEW_MODAL
  })),
  fileUrl: useSelector(state => selectModalProperty(state, {
    modalType: ModalType.MOBILE_IMAGE_VIEW_MODAL,
    property: 'fileUrl',
  })),
})

interface DataPersisterInterface {
  onCloseModal: VoidFunction,
}

export const useDataPersister = (): DataPersisterInterface => {
  const dispatch = useDispatch()

  return {
    onCloseModal: useCallback(() => (
      dispatch(ModalsModel.onCloseModal(ModalType.MOBILE_IMAGE_VIEW_MODAL))
    ), [dispatch])
  }
}