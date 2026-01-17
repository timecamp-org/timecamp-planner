import { OneTimeUserDisposableModalInterface } from 'commonComponents/OneTimeUserDisposableModal/index'
import { useSelector } from 'common/hooks/useSelector'
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors'
import { getDidUserCloseModalUltimately } from 'models/domain/RequestModel/constants/requestTypes'
import { selectDidUserCloseModalUltimately } from 'models/component/ModalsModel/selectors'
import { useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { onSaveDidUserCloseModalUltimately, onGetDidUserCloseModalUltimately } from 'models/component/ModalsModel/actions'


export type OneTimeUserDisposableModalHookInterface = {
  isModalOpen: boolean,
  onCloseModal: VoidFunction,
}

export const useComponent = (props: OneTimeUserDisposableModalInterface): OneTimeUserDisposableModalHookInterface => {
  const { modalType } = props
  const isGetDidUserCloseModalRequestSuccess = useSelector(state => selectRequestIsSuccess(state, {
    requestType: getDidUserCloseModalUltimately,
    objectId: modalType,
  }))
  const didUserCloseModal = useSelector(state => selectDidUserCloseModalUltimately(state, { modalType }))

  const dispatch = useDispatch()
  const onCloseModal = useCallback(() => {
    dispatch(onSaveDidUserCloseModalUltimately(modalType, true))
  }, [dispatch, modalType])

  const onFetchDidUserCloseModal = useCallback(() => {
    dispatch(onGetDidUserCloseModalUltimately(modalType))
  }, [dispatch, modalType])

  useEffect(() => {
    onFetchDidUserCloseModal()
  }, [])

  return {
    isModalOpen: isGetDidUserCloseModalRequestSuccess && !didUserCloseModal,
    onCloseModal,
  }
}
