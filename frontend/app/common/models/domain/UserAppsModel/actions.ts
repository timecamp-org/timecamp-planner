import * as C from './constants'
import { action } from 'typesafe-actions'
import { UserAppInterface, AppUserRole, UserInAppEntity, UserInAppInterface } from './types'
import { Id } from '../../../utils/identifier'
import { Map, List } from 'immutable'
import { OAuth2ClientInterfacfe } from '../OAuthModel/types'
import { OAuth2Client } from '../OAuthModel/model'
import { EntityInterface } from '../EntityModel/types'
import { User } from '../UsersModel/models'
import { FileUploaded } from 'models/domain/FilesModel/types'

const emptyMap = Map()
const emptyList = List()

export const onCreateUserApp = (app: UserAppInterface) =>
  action(C.onCreateUserApp, app)

export const onCreateUserAppSuccess = (appId: Id, oAuthClient: OAuth2ClientInterfacfe, currentUserId: Id) =>
  action(C.onCreateUserAppSuccess, { appId, oAuthClient: new OAuth2Client(oAuthClient), currentUserId })

export const onUpdateUserApp = (appId: Id, app: UserAppInterface) =>
  action(C.onUpdateUserApp, { appId, app })

export const onUpdateUserAppSuccess = (appId: Id, oAuthClient: OAuth2ClientInterfacfe) =>
  action(C.onUpdateUserAppSuccess, { appId, oAuthClient: new OAuth2Client(oAuthClient) })

export const onDeleteUserApp = (appId: Id) =>
  action(C.onDeleteUserApp, { appId })

export const onDeleteUserAppSuccess = (appId: Id, oAuthClientId: Id) =>
  action(C.onDeleteUserAppSuccess, { appId, oAuthClientId })

export const onFetchUserApps = () =>
  action(C.onFetchUserApps)

export const onBatchOAuthClientIdByAppId = (oAuthClientIdByAppId: Map<Id, Id>) =>
  action(C.onBatchOAuthClientIdByAppId, { oAuthClientIdByAppId })

export const onFetchUserAppsSuccess = (apps: UserAppInterface[]) =>
  action(C.onFetchUserAppsSuccess, apps)

export const onRegenerateClientSecret = (oAuthClientId: Id) =>
  action(C.onRegenerateClientSecret, { oAuthClientId })

export const onRegenerateClientSecretSuccess = (oAuthClientId: Id, oAuthClientSecret: string) =>
  action(C.onRegenerateClientSecretSuccess, { oAuthClientId, oAuthClientSecret })

export const onUploadClientThumbnail = (appId: Id, file: FileUploaded) =>
  action(C.onUploadClientThumbnail, { appId, file })

export const onBatchAppUserIds = (appUserIds: Map<Id, List<Id>>) =>
  action(C.onBatchAppUserIds, { appUserIds })

export const onBatchAppUsersRole = (appUsersRole: Map<Id, Map<Id, AppUserRole>>) =>
  action(C.onBatchAppUsersRole, { appUsersRole })

export const onAddCollaborator = (appId: Id, userId: Id, role: AppUserRole = AppUserRole.COLLABORATOR) =>
  action(C.onAddCollaborator, { appId, userId, role })

export const onRemoveCollaborator = (appId: Id, userId: Id) =>
  action(C.onRemoveCollaborator, { appId, userId })

export const onInviteCollaborator = (appId: Id, email: string, role: AppUserRole = AppUserRole.COLLABORATOR) =>
  action(C.onInviteCollaborator, { appId, email, role })

export const onInviteCollaboratorSuccess = (appId: Id, userId: Id, role: AppUserRole) =>
  action(C.onInviteCollaboratorSuccess, { appId, userId, role })

export const onCreateUserInApp = (userInAppEntity: UserInAppEntity) => {
  let usersData = emptyMap
  let appUserIds = emptyList
  let appUsersRole = emptyMap
  userInAppEntity.users.forEach(entity => {
    const userRecord = new User(entity)
    usersData = usersData.set(userRecord.id, userRecord)
  })
  userInAppEntity.appMembers.forEach((member: UserInAppInterface) => {
    appUserIds = appUserIds.push(member.userId)
    appUsersRole = appUsersRole.set(member.userId, member.role)
  })

  return action(C.onCreateUserInApp, {
    appId: userInAppEntity.appId,
    app: userInAppEntity.app,
    usersData,
    appUserIds,
    appUsersRole,
    oAuthClient: new OAuth2Client(userInAppEntity.oAuthClient)
  })
}

export const onDeleteUserInApp = (userInAppEntity: UserInAppEntity) =>
  action(C.onDeleteUserInApp, userInAppEntity)

export const onCreateUserAppData = (entity: EntityInterface) =>
  action(C.onCreateUserAppData, {
    app: entity.body.app,
    oAuthClient: entity.body.oAuthClient,
  })

export const onDeleteUserAppData = (entity: EntityInterface) =>
  action(C.onDeleteUserAppData, { appId: entity.body.app.id })

