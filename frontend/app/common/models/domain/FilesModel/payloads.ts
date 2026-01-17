import { Id } from 'common/utils/identifier'
import { PayloadAction } from 'common/types'
import {
  FileUploaded,
  FileInterface,
  FileRecordInterface,
  ImageGalleryType
} from 'models/domain/FilesModel/types'
import { ActionResult } from 'models/domain/ActionResultModel'
import { Map } from 'immutable'

export interface OnQueueFilesAndStartUploadingPayload {
  files: FileUploaded[],
  objectId: Id,
  containerId: Id,
  onFileUploaded: (...args) => PayloadAction,
}

export interface OnUploadFileSuccessPayload {
  file: FileRecordInterface,
}

export interface OnDeleteFilePayload {
  id: Id,
  objectId: Id,
}

export interface OnDeleteFileSuccessPayload {
  actionResult: ActionResult,
}

export interface OnCreateFileDataPayload {
  file: FileRecordInterface,
}

export interface OnRemoveFileDataPayload {
  fileId: Id,
}

export interface OnBatchFilesDataPayload {
  files: Map<Id, FileInterface>,
}

export interface OnOpenImageGalleryPayload {
  objectId: Id,
  startImageId: Id,
  imageGalleryType: ImageGalleryType,
}

export interface OnStartUploadPayload {
  name: string,
}

export interface OnSetUploadProgressPayload {
  progress: number,
}

