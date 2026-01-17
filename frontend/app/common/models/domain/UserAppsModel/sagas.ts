import { put, fork, takeLatest, cps, select, call } from 'redux-saga/effects'
import handleError from '../../../utils/handleError'
import { HeySpaceClient as client } from '../../../services'
import { Map } from 'immutable'

import { onSetRequestStatus } from '../RequestModel/actions'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import { RequestStatus } from '../RequestModel/types'

import * as Constants from './constants'
import generateId from '../../../utils/generate-pushid'
import { PartialPayloadAction, AnyDict } from '../../../types'
import { selectCurrentUserId } from '../UsersModel/selectors/domain'
import { onBatchClientsData } from '../OAuthModel/actions'
import {
  onBatchOAuthClientIdByAppId,
  onCreateUserAppSuccess,
  onDeleteUserAppSuccess,
  onRegenerateClientSecretSuccess,
  onBatchAppUserIds,
  onBatchAppUsersRole,
  onInviteCollaboratorSuccess,
  onUpdateUserAppSuccess
} from './actions'
import { Id } from '../../../utils/identifier'
import { batchActions } from 'redux-batched-actions'
import { UserAppInterface, AppUserRole } from './types'
import { selectOAuthClientIdByAppId } from './selectors'
import isEmpty from 'lodash/isEmpty'
import { parseObjectPeople } from '../RequestModel/dataParsers'
import { onCreateUser, onBatchUsersData } from '../UsersModel/actions'
import { FileUploadContext, UploadStep } from '../FilesModel/types'
import { handleUploadChannel } from '../FilesModel/sagas'
import { getThumbnailUrl } from '../FilesModel/helpers'

const emptyMap = Map()

export default [
  function* () {
    yield fork(function* () {
      yield takeLatest(Constants.onCreateUserApp, onCreateUserApp)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onUpdateUserApp, onUpdateUserApp)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onDeleteUserApp, onDeleteUserApp)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onUploadClientThumbnail, onUploadClientThumbnail)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onRegenerateClientSecret, onRegenerateClientSecret)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onFetchUserApps, onFetchUserApps)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onAddCollaborator, onAddCollaborator)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onInviteCollaborator, onInviteCollaborator)
    })
    yield fork(function* () {
      yield takeLatest(Constants.onRemoveCollaborator, onRemoveCollaborator)
    })
  },
]

export function* onCreateUserApp({ payload }: PartialPayloadAction<UserAppInterface>) {
  const appId = generateId()
  const currentUserId = yield select(selectCurrentUserId)
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.createUserApp, appId, RequestStatus.LOADING))

    const result = yield cps(client.restApiClient.createUserApp, appId, payload)

    if (result.oAuthClient) {
      yield put(onCreateUserAppSuccess(appId, result.oAuthClient, currentUserId))
    }

    yield put(onSetRequestStatus(RequestTypesConstants.createUserApp, appId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.createUserApp, appId, RequestStatus.FAILURE, error))
  }
}

export function* onUpdateUserApp({ payload: { appId, app } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserApp, appId, RequestStatus.LOADING))


    const result = yield cps(client.restApiClient.updateUserApp, appId, app)

    if (result.oAuthClient) {
      yield put(onUpdateUserAppSuccess(appId, result.oAuthClient))
    }

    yield put(onSetRequestStatus(RequestTypesConstants.updateUserApp, appId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.updateUserApp, appId, RequestStatus.FAILURE, error))
  }
}

export function* onDeleteUserApp({ payload: { appId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserApp, appId, RequestStatus.LOADING))
    const oAuthClientId = yield select(selectOAuthClientIdByAppId, { appId })

    const result = yield cps(client.restApiClient.deleteUserApp, appId)

    yield put(onDeleteUserAppSuccess(appId, oAuthClientId))

    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserApp, appId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.deleteUserApp, appId, RequestStatus.FAILURE, error))
  }
}

export function* onUploadClientThumbnail({ payload: { appId, file } }: PartialPayloadAction) {
  try {
    if (!file) {
      return
    }
    yield call(handleUploadChannel, file, handleThumbnailUploadStep, { appId })
  } catch (error) {
    handleError(error)
  }
}

export function* handleThumbnailUploadStep(step: UploadStep, context: AnyDict) {
  const { error, url } = step
  const { appId } = context

  if (error) {
    throw error
  }
  if (url) {
    const clientThumbnailUrl = getThumbnailUrl(url)
    const app: Partial<UserAppInterface> = {
      clientThumbnailUrl
    }
    yield call(onUpdateUserApp, { payload: { appId, app } })
    return true
  }
  return false
}

export function* onRegenerateClientSecret({ payload: { oAuthClientId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.regenerateOauthClientSecret, oAuthClientId, RequestStatus.LOADING))


    const result = yield cps(client.restApiClient.regenerateOauthClientSecret, oAuthClientId)

    if (result.clientSecret) {
      yield put(onRegenerateClientSecretSuccess(oAuthClientId, result.clientSecret))
    } else {
      throw new Error('Client secret not present')
    }

    yield put(onSetRequestStatus(RequestTypesConstants.regenerateOauthClientSecret, oAuthClientId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.regenerateOauthClientSecret, oAuthClientId, RequestStatus.FAILURE, error))
  }
}

export function* onFetchUserApps() {
  const currentUserId = yield select(selectCurrentUserId)
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.getUserApps, currentUserId, RequestStatus.LOADING))

    const result = yield cps(client.restApiClient.getUserApps)
    const actionsBatch = []
    const appIds = []

    if (!isEmpty(result.apps)) {
      let oAuthClientIdByAppId = emptyMap as Map<Id, Id>
      const clients = result.apps.map(app => {
        appIds.push(app.id)
        oAuthClientIdByAppId = oAuthClientIdByAppId.set(app.id, app.oAuthClient.id)
        return app.oAuthClient
      })

      actionsBatch.push(onBatchClientsData(clients))
      actionsBatch.push(onBatchOAuthClientIdByAppId(oAuthClientIdByAppId))
    }

    if (!isEmpty(result.usersInApps)) {
      const { peopleIds, peopleRole } = parseObjectPeople<AppUserRole>(result.usersInApps, appIds)
      actionsBatch.push(onBatchAppUserIds(peopleIds))
      actionsBatch.push(onBatchAppUsersRole(peopleRole))
    }

    if (!isEmpty(result.users)) {
      actionsBatch.push(onBatchUsersData(result.users))
    }

    yield put(batchActions(actionsBatch))

    yield put(onSetRequestStatus(RequestTypesConstants.getUserApps, currentUserId, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.getUserApps, currentUserId, RequestStatus.FAILURE, error))
  }
}


export function* onAddCollaborator({ payload: { appId, userId, role } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.addUserAppCollaborator, [appId, userId], RequestStatus.LOADING))


    const result = yield cps(client.restApiClient.addUserAppCollaborator, appId, userId, role)


    yield put(onSetRequestStatus(RequestTypesConstants.addUserAppCollaborator, [appId, userId], RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.addUserAppCollaborator, [appId, userId], RequestStatus.FAILURE, error))
  }
}

export function* onInviteCollaborator({ payload: { appId, email, role } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.inviteUserAppCollaborator, [appId, email], RequestStatus.LOADING))


    const result = yield cps(client.restApiClient.inviteUserAppCollaborator, appId, email, role)

    if (result.user) {
      const actionsBatch = []
      actionsBatch.push(onCreateUser(result.user))
      actionsBatch.push(onInviteCollaboratorSuccess(appId, result.user.id, role))
      yield put(batchActions(actionsBatch))
    } else {
      throw new Error('User not invited')
    }


    yield put(onSetRequestStatus(RequestTypesConstants.inviteUserAppCollaborator, [appId, email], RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.inviteUserAppCollaborator, [appId, email], RequestStatus.FAILURE, error))
  }
}


export function* onRemoveCollaborator({ payload: { appId, userId } }: PartialPayloadAction) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeUserAppCollaborator, [appId, userId], RequestStatus.LOADING))


    const result = yield cps(client.restApiClient.removeUserAppCollaborator, appId, userId)


    yield put(onSetRequestStatus(RequestTypesConstants.removeUserAppCollaborator, [appId, userId], RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.removeUserAppCollaborator, [appId, userId], RequestStatus.FAILURE, error))
  }
}
