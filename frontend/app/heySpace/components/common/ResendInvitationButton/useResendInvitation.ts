import { useCallback, SyntheticEvent } from 'react'
import { useDispatch } from 'react-redux'

import { Id } from '../../../../common/utils/identifier'
import { onResendInvitation as onResendInvitationAction } from '../../../../common/models/domain/OrganizationsModel/actions'
import { onOpenModal } from '../../../../common/models/component/ModalsModel/actions'
import { ModalType } from '../../../../common/models/component/ModalsModel/types'

export type UseResendInvitationConfig = {
  conversationUserId: Id,
  shouldShowConfirmation?: boolean,
}

export type UseResendInvitationHook = (event: SyntheticEvent) => void

export default function ({ conversationUserId, shouldShowConfirmation = false }: UseResendInvitationConfig): UseResendInvitationHook {
  const dispatch = useDispatch()
  const onResendInvitation = useCallback(
    () => dispatch(onResendInvitationAction(conversationUserId)),
    [conversationUserId, dispatch]
  )
  const onOpenResendInvitationModal = useCallback((event) => {
    event.stopPropagation()
    dispatch(onOpenModal(ModalType.RESEND_INVITATION_MODAL, { userId: conversationUserId }))
  }, [conversationUserId, dispatch])

  const onClick = useCallback((event) => (shouldShowConfirmation
    ? onOpenResendInvitationModal(event)
    : onResendInvitation()),
  [
    shouldShowConfirmation,
    onOpenResendInvitationModal,
    onResendInvitation,
  ])

  return onClick
}
