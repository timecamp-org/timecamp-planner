import {
  FileInterface,
  FileRecordInterface,
  ImageGalleryInterface,
} from 'models/domain/FilesModel/types'
import { makeTypedFactory } from 'typed-immutable-record'

export const defaultFile: FileInterface = {
  id: null,
  userId: null,
  timestamp: null,
  url: null,
  name: null,
  contentType: null,
  height: null,
  width: null,
}

export const File = makeTypedFactory<
  FileInterface | FileRecordInterface, FileRecordInterface
>(defaultFile)

export const defaultImageGallery: ImageGalleryInterface = {
  objectId: null,
  startImageId: null,
  imageGalleryType: null,
}