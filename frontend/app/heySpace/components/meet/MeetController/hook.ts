import { useCallback } from 'react'
import { MeetControllerInterface } from '.'
import { useDispatch, useSelector } from 'react-redux'
import { onOpenModal } from 'models/component/ModalsModel/actions'
import { ModalType } from 'models/component/ModalsModel/types'
import { selectModalProperty } from 'models/component/ModalsModel/selectors'
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors'
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types'

type MeetControllerHookInterface = {
  isMeetsEnabled: boolean,
  onClick: VoidFunction,
}

export default function useComponent(props: MeetControllerInterface): MeetControllerHookInterface {
  const openedMeetModalId = useSelector(state => selectModalProperty(state, { modalType: ModalType.HEYSPACE_MEET, property: 'objectId' }))
  const isMeetsEnabled = useSelector(state => selectHasAccessToExtension(state, { extensionNamespace: ExtensionNamespace.HEYSPACE_MEETS }))

  const dispatch = useDispatch()
  const onClick = useCallback(() => {
    if (!openedMeetModalId) {
      dispatch(onOpenModal(ModalType.HEYSPACE_MEET, { objectId: props.objectId }))
    }
  }, [dispatch, props.objectId, openedMeetModalId])

  return {
    isMeetsEnabled,
    onClick
  }
}
