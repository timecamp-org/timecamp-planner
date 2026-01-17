import * as C from './constants'
import { action } from 'typesafe-actions'
import { Id } from '../../../utils/identifier';
import { PayloadAction } from 'common/types'


export const onJoinChat = (invitationToken: string, isSigningUp: boolean, isAuthenticatingWithGoogle: boolean = false, token: string) =>
  action(C.onJoinChat, { invitationToken, isSigningUp, isAuthenticatingWithGoogle, token })

export const onFetchInvitationToken = () =>
  action(C.onFetchInvitationToken)

export const onFetchInvitationTokenSuccess = (token: string): PayloadAction<OnFetchInvitationTokenSuccessPayload> =>
  action(C.onFetchInvitationTokenSuccess, {
    token,
  })

export const onGenerateInvitationToken = (showAlert: boolean = true,) =>
  action(C.onGenerateInvitationToken, { showAlert })

export const onSetInvitationToken = (token: string) =>
  action(C.onSetInvitationToken, { token })

export const onFetchInvitationData = (invitationToken: string) =>
  action(C.onFetchInvitationData, { invitationToken })

export const onFetchInvitationDataSuccess = (userId: Id, organizationId: Id, organizationName: string) =>
  action(C.onFetchInvitationDataSuccess, { userId, organizationId, organizationName })