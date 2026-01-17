import { fromJS, List } from 'immutable'

import * as FilesModelConstants from './constants'
import * as CurrentUserConstants from '../CurrentUserModel/constants'
import * as AppModelConstants from '../AppModel/constants'
import { FilesState } from 'models/domain/FilesModel/types'
import { Reducer } from 'redux'

// export initial state for testing
export const initialState: FilesState = fromJS({
  filesData: {

  },
  imageGallery: {
    objectId: null,
    startImageId: null,
    imageGalleryType: null,
  },
  fileInUploadName: null,
  fileUploadProgress: 0,
})

const reducer: Reducer<FilesState> = (state = initialState, action) => {
  switch (action.type) {
    case FilesModelConstants.onUploadFileSuccess: {
      const { file } = action.payload
      return state.setIn(['filesData', file.id], file)
    }

    case FilesModelConstants.onDeleteFileSuccess: {
      const { id } = action.payload.actionResult.data
      return state.deleteIn(['filesData', id])
    }

    case FilesModelConstants.onCreateFileData: {
      const { file } = action.payload
      return state.setIn(['filesData', file.id], file)
    }

    case FilesModelConstants.onRemoveFileData: {
      const { fileId } = action.payload
      return state
        .deleteIn(['filesData', fileId])
    }

    case FilesModelConstants.onBatchFilesData: {
      return state.set('filesData', state.get('filesData').merge(action.payload.files))
    }

    case FilesModelConstants.onOpenImageGallery: {
      const { objectId, startImageId, imageGalleryType } = action.payload
      return state
        .setIn(['imageGallery', 'objectId'], objectId)
        .setIn(['imageGallery', 'startImageId'], startImageId)
        .setIn(['imageGallery', 'imageGalleryType'], imageGalleryType)
    }

    case FilesModelConstants.onCloseImageGallery: {
      return state
        .setIn(['imageGallery', 'objectId'], null)
        .setIn(['imageGallery', 'startImageId'], null)
        .setIn(['imageGallery', 'imageGalleryType'], null)
    }

    case FilesModelConstants.onStartUpload:
      return state
        .set('fileInUploadName', action.payload.name)
        .set('fileUploadProgress', 0)

    case FilesModelConstants.onSetUploadProgress:
      return state.set('fileUploadProgress', action.payload.progress)

    case FilesModelConstants.onFinishUpload:
      return state
        .set('fileInUploadName', null)
        .set('fileUploadProgress', 0)

    case AppModelConstants.onCleanModels:
    case CurrentUserConstants.onSignOutSuccess:
      return initialState

    default:
      return state
  }
}

export default reducer
