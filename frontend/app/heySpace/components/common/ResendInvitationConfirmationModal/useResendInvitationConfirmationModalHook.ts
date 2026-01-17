import { useCallback } from 'react'
import { Id } from 'common/utils/identifier'
import { useDispatch, useSelector } from 'react-redux'
import { selectModalProperty, selectIsModalOpen } from 'models/component/ModalsModel/selectors'
import { onCloseModal } from 'models/component/ModalsModel/actions'

import { ModalType } from 'models/component/ModalsModel/types'
import { onResendInvitation as onResendInvitationAction } from 'models/domain/OrganizationsModel/actions'

export type UseResendInvitationConfirmationModalHook = {
  userId: Id,
  isModalOpen: boolean,
  onResendInvitation(): void,
  onClose(): void,
}

export default function (): UseResendInvitationConfirmationModalHook {
  const selectedUserIdToResendInvitation: Id = useSelector(state => selectModalProperty(state, {
    modalType: ModalType.RESEND_INVITATION_MODAL,
    property: 'userId'
  }))
  const isModalOpen = useSelector(state => selectIsModalOpen(state, { modalType: ModalType.RESEND_INVITATION_MODAL }))

  const dispatch = useDispatch()
  const onClose = useCallback(
    () => dispatch(onCloseModal(ModalType.RESEND_INVITATION_MODAL)),
    [dispatch]
  )
  const onResendInvitation = useCallback(
    () => dispatch(onResendInvitationAction(selectedUserIdToResendInvitation)),
    [dispatch, selectedUserIdToResendInvitation]
  )

  return {
    userId: selectedUserIdToResendInvitation,
    isModalOpen,
    onClose,
    onResendInvitation,
  }
}
