import { put, call, takeEvery, select, cps, take } from 'redux-saga/effects'
import makeActionResult from '../../../utils/makeActionResult'
import handleError from '../../../utils/handleError'
import { FileUpload, HeySpaceClient as client } from '../../../services'
import { File as FileModel } from './models'
import generatePushId from '../../../utils/generate-pushid'
import get from 'lodash/get'

import * as FilesModelConstants from './constants'
import * as FilesModelActions from './actions'
import * as UsersModelSelectors from '../UsersModel/selectors/domain'
import { selectCurrentOrganizationId } from '../OrganizationsModel/selectors/domain'
import * as FilesModelSelectors from '../FilesModel/selectors'

import { onSetRequestStatus } from '../RequestModel/actions'
import * as RequestTypesConstants from '../RequestModel/constants/requestTypes'
import { RequestStatus } from '../RequestModel/types'
import * as SubscriptionLimitsSagas from '../SubscriptionLimitsModel/sagas'
import {
  OnDeleteFilePayload,
  OnQueueFilesAndStartUploadingPayload,
} from 'models/domain/FilesModel/payloads'
import {
  FileUploaded,
  FileUploadContext,
  FileUploadStep,
  UploadStep
} from 'models/domain/FilesModel/types'
import { AnyDict, PayloadAction } from 'common/types'
import { Id } from 'common/utils/identifier'

const fileUploadQueue = FileUploadQueue()

export default [
  function* () {
    yield takeEvery(FilesModelConstants.onQueueFilesAndStartUploading, onQueueFilesAndStartUploading)
    yield takeEvery(FilesModelConstants.onDeleteFile, onDeleteFile)
  },
]

export function* onQueueFilesAndStartUploading(
  action: PayloadAction<OnQueueFilesAndStartUploadingPayload>
) {
  const { files, objectId, containerId, onFileUploaded } = action.payload;
  try {
    const filesPermittedToUpload = yield call(SubscriptionLimitsSagas.filterFilesBySubscriptionLimits, files)
    const filesNotPermittedToUpload = files.filter(file => !filesPermittedToUpload.includes(file))
    yield call(SubscriptionLimitsSagas.handleFilesThatCantUpload, filesNotPermittedToUpload)

    const uploadQueueItems = filesPermittedToUpload.map(file => ({
      file,
      onFileUploaded,
      containerId,
      objectId,
    }))
    fileUploadQueue.push(uploadQueueItems)
    const fileInUploadName = yield select(FilesModelSelectors.selectFileInUploadName)
    if (fileInUploadName) {
      return
    }

    yield call(onUploadFile)
    yield put(FilesModelActions.onFinishUpload())
  } catch (error) {
    handleError(error, { files, objectId, containerId, onFileUploaded })
  }
}

export function* onUploadFile() {
  const id = generatePushId()
  const fileUploadQueueItem = fileUploadQueue.get()
  if (!fileUploadQueueItem) {
    return
  }

  try {
    const { file } = fileUploadQueueItem

    yield put(FilesModelActions.onStartUpload(file.name))
    file.id = id

    yield put(onSetRequestStatus(RequestTypesConstants.createFile, id, RequestStatus.LOADING))

    yield call(handleUploadChannel, file, handleFileUploadStep, fileUploadQueueItem)
  } catch (error) {
    handleError(error, fileUploadQueueItem)
    yield put(onSetRequestStatus(RequestTypesConstants.createFile, id, RequestStatus.FAILURE, error))
  }

  yield call(onUploadFile)
}

export function* handleUploadChannel(
  file: FileUploaded,
  onUploadStep: (uploadStep: UploadStep, context?: AnyDict) => Generator,
  context?: FileUploadContext
) {
  file.id = file.id || generatePushId()
  const organizationId = yield select(selectCurrentOrganizationId)
  const channel = yield call(FileUpload.createUploadFileChannel, file, organizationId)

  while (true) {
    const uploadStep = yield take(channel)
    const shoudBreak = yield call(onUploadStep, uploadStep, context)
    if (shoudBreak) {
      break
    }
  }
}

export function* handleFileUploadStep(step: FileUploadStep, context: FileUploadContext) {
  const { progress, error, url } = step
  const { file, onFileUploaded, containerId, objectId } = context

  if (error) {
    if (get(error, 'params.statusCode', null) !== 403) {
      handleError(error)
    }
    yield put(onSetRequestStatus(RequestTypesConstants.createFile, file.id, RequestStatus.FAILURE, error))
    return true
  }
  if (url) {
    yield call(onUploadSuccess, file, onFileUploaded, containerId, objectId, url)
    return true
  }
  if (progress) {
    yield put(FilesModelActions.onSetUploadProgress(progress))
  }
  return false
}

export function* onUploadSuccess(
  file: FileUploaded,
  onFileUploaded: (...args) => PayloadAction,
  containerId: Id,
  objectId: Id,
  url: string,
) {
  try {
    const fileResult = {
      url,
      id: file.id,
      name: file.name,
      contentType: file.type,
      userId: yield select(UsersModelSelectors.selectCurrentUserId),
      organizationId: yield select(selectCurrentOrganizationId),
      width: file.width,
      height: file.height,
      size: file.size,
    }

    yield put(FilesModelActions.onUploadFileSuccess(FileModel({
      ...fileResult,
      timestamp: null,
    })))

    yield cps(client.restApiClient.createFile, fileResult.id, fileResult)

    yield put(onFileUploaded(file.id, objectId, containerId))

    yield put(onSetRequestStatus(RequestTypesConstants.createFile, file.id, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error, { file, onFileUploaded, containerId, objectId, url })
    yield put(onSetRequestStatus(RequestTypesConstants.createFile, file.id, RequestStatus.FAILURE, error))
  }
}

export function* onDeleteFile({ payload: { id }}: PayloadAction<OnDeleteFilePayload>) {
  try {
    yield put(onSetRequestStatus(RequestTypesConstants.removeFile, id, RequestStatus.LOADING))

    yield put(FilesModelActions.onDeleteFileSuccess(makeActionResult({
      isOk: true,
      code: 'onDeleteFileSuccess',
      data: {
        id,
      },
    })))
    yield cps(client.restApiClient.removeFile, id)

    yield put(onSetRequestStatus(RequestTypesConstants.removeFile, id, RequestStatus.SUCCESS))
  } catch (error) {
    handleError(error)
    yield put(onSetRequestStatus(RequestTypesConstants.removeFile, id, RequestStatus.FAILURE, error))
  }
}

function FileUploadQueue() {
  let queue = []

  return {
    push(uploadQueueItems) {
      queue = queue.concat(uploadQueueItems)
    },
    get() {
      return queue.shift()
    },
  }
}
