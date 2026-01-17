import { Id } from "../../../utils/identifier";
import { EntityStatus } from 'models/domain/EntityModel/types'
import { TypedRecord } from 'typed-immutable-record'
import { ImmutableMap, PayloadAction } from 'common/types'
import { Record } from 'immutable'

export interface FilesState extends ImmutableMap<string, any> {
  filesData: Map<Id, FileRecordInterface>,
  imageGallery: ImageGalleryRecordInterface,
  fileInUploadName: string,
  fileUploadProgress: number,
}

export interface ImageGalleryInterface {
  objectId: Id,
  startImageId: Id,
  imageGalleryType: ImageGalleryType,
}

export interface ImageGalleryRecordInterface extends TypedRecord<ImageGalleryRecordInterface>, ImageGalleryInterface { }

export interface FileInterface {
  id: Id,
  userId: Id
  timestamp: number,
  url: string,
  name: string,
  contentType: string,
  height: number,
  width: number,
}

export interface FileRecordInterface extends TypedRecord<FileRecordInterface>, FileInterface { }

export interface FileRestResponse {
  contentType: string,
  id: Id,
  organizationId: Id,
  userId: Id,
  status: EntityStatus,
  createdAt: number,
  size: number,
  height: number,
  width: number,
  name: string,
  url: string,
}

export interface FileUploaded extends File {
  height: number,
  id: Id,
  lastModifiedDate: Date,
  path: string,
  webkitRelativePath: string,
  width: number,
}

export interface UploadStep {
  progress?: number,
  url?: string,
  error?: Error,
}

export enum ImageSize {
  TINY = 20,
  SMALL = 95,
  MEDIUM = 360,
}

export interface DimensionsInterface {
  width: number,
  height: number,
}

export enum ImageGalleryType {
  TASK_ATTACHMENT = 'TaskAttachmentsGallery',
  TASK_MESSAGE_ATTACHMENT = 'TaskMessageAttachmentsGallery',
  PROJECT_MESSAGE_ATTACHMENT = 'ProjectMessageAttachmentsGallery',
}

export interface FileUploadContext {
  objectId?: Id,
  containerId?: Id,
  file?: FileUploaded,
  onFileUploaded?: (...args) => PayloadAction
  organizationId?: Id,
  appId?: Id,
}

export interface FileUploadStep {
  progress: number,
  url: string,
  error: Error,
}