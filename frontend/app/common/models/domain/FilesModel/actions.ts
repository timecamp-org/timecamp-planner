import { List, Map } from 'immutable'
import * as constants from './constants'
import { action } from 'typesafe-actions'
import { getFileRecordFromRestResponse } from 'common/utils/fetchResultToRecord'
import * as payloads from './payloads'
import { PayloadAction } from 'common/types'
import { Action } from 'redux'
import {
  FileUploaded,
  FileInterface,
  FileRecordInterface,
  FileRestResponse,
  ImageGalleryType
} from 'models/domain/FilesModel/types'
import { Id } from 'common/utils/identifier'
import { ActionResult } from 'models/domain/ActionResultModel'

export const onQueueFilesAndStartUploading = (
  files: FileUploaded[], objectId: Id, containerId: Id, onFileUploaded: (...args) => PayloadAction,
): PayloadAction<payloads.OnQueueFilesAndStartUploadingPayload> =>
  action(constants.onQueueFilesAndStartUploading, {
    files,
    objectId,
    containerId,
    onFileUploaded,
  })

export const onUploadFileSuccess = (file: FileRecordInterface): PayloadAction<payloads.OnUploadFileSuccessPayload> =>
  action(constants.onUploadFileSuccess, { file })

export const onDeleteFile = (id: Id, objectId: Id): PayloadAction<payloads.OnDeleteFilePayload> =>
  action(constants.onDeleteFile, {
    id,
    objectId,
  })

export const onDeleteFileSuccess = (actionResult: ActionResult): PayloadAction<payloads.OnDeleteFileSuccessPayload> =>
  action(constants.onDeleteFileSuccess, {
    actionResult
  })

export const onBatchFilesData = (filesData: List<FileRestResponse>): PayloadAction<payloads.OnBatchFilesDataPayload> => {
  let files = Map<Id, FileInterface>()

  filesData.forEach(file => {
    files = files.set(file.id, getFileRecordFromRestResponse(file))
  })

  return action(constants.onBatchFilesData, { files })
}

export const onCreateFileData = (fileData: FileRestResponse): PayloadAction<payloads.OnCreateFileDataPayload> => {
  const file = getFileRecordFromRestResponse(fileData)
  return action(constants.onCreateFileData, { file })
}

export const onRemoveFileData = (fileData: FileInterface): PayloadAction<payloads.OnRemoveFileDataPayload> => action(
  constants.onRemoveFileData, {
    fileId: fileData.id
  })

export const onOpenImageGallery = (objectId: Id, startImageId: Id, imageGalleryType: ImageGalleryType): PayloadAction<payloads.OnOpenImageGalleryPayload> =>
  action(constants.onOpenImageGallery, {
    objectId,
    startImageId,
    imageGalleryType,
  })

export const onCloseImageGallery = (): Action => action(constants.onCloseImageGallery)

export const onStartUpload = (name: string): PayloadAction<payloads.OnStartUploadPayload> => action(
  constants.onStartUpload, { name }
)

export const onSetUploadProgress = (progress: number): PayloadAction<payloads.OnSetUploadProgressPayload> => action(
  constants.onSetUploadProgress, { progress }
)

export const onFinishUpload = (): Action => action(constants.onFinishUpload)
