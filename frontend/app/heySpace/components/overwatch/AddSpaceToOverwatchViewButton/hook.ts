import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { onOpenModal } from 'models/component/ModalsModel/actions'
import { ModalType } from 'models/component/ModalsModel/types'

export type AddSpaceToOverwatchButtonHookInterface = {
  onClick: VoidFunction,
}

const useComponent = (): AddSpaceToOverwatchButtonHookInterface => {
  const dispatch = useDispatch()

  const onClick = useCallback(() => {
    dispatch(onOpenModal(ModalType.MANAGE_OVERWATCH_MODAL))
  }, [dispatch])

  return {
    onClick,
  }
}

export default useComponent
