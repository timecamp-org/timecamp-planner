import { createSelector } from 'reselect';
import { Map } from 'immutable';
import * as Constants from './constants';
import createImmutableEqualSelector from '../../../utils/createImmutableEqualSelector';
import createCachedSelector from 're-reselect';
import generateSelectorName from '../../../utils/generateSelectorName';
import { ApplicationState } from 'common/types';
import {
  FileRecordInterface,
  FilesState,
  ImageGalleryRecordInterface,
  ImageGalleryType,
} from 'models/domain/FilesModel/types';
import { Id } from 'common/utils/identifier';
import { selectCurrentUserId } from '../UsersModel/selectors/domain';

const emptyMap = Map();

export const filesDomain = (state: ApplicationState): FilesState => state.get(Constants.domain);

export const selectFilesData = createImmutableEqualSelector(
  filesDomain,
  (domain): Map<Id, FileRecordInterface> => domain.get('filesData')
);

// args: fileId
export const selectFile = createCachedSelector(
  selectFilesData,
  (_, args) => args.fileId,
  (files, fileId): FileRecordInterface => files.get(fileId)
)((_, args) => generateSelectorName(args, ['fileId']));

// args: fileIds
export const selectFiles = createCachedSelector(
  selectFilesData,
  (_, args) => args.fileIds,
  (files, fileIds): FileRecordInterface[] => files.toArray().filter((file) => fileIds.includes(file.id))
)((_, args) => generateSelectorName(args, ['fileIds']));

// args: fileId
export const selectFileContentType = createCachedSelector(selectFile, (file): string =>
  file ? file.get('contentType') : null
)((_, args) => generateSelectorName(args, ['fileId']));

// args: fileId
export const selectFileName = createCachedSelector(selectFile, (file): string => (file ? file.name : null))((_, args) =>
  generateSelectorName(args, ['fileId'])
);

// args: fileId
export const selectFileWidth = createCachedSelector(selectFile, (file): number => (file ? file.width : null))(
  (_, args) => generateSelectorName(args, ['fileId'])
);

// args: fileId
export const selectFileHeight = createCachedSelector(selectFile, (file): number => (file ? file.height : null))(
  (_, args) => generateSelectorName(args, ['fileId'])
);

// args: fileId
export const selectFileUrl = createCachedSelector(selectFile, (file): string => (file ? file.url : null))((_, args) =>
  generateSelectorName(args, ['fileId'])
);

// args: fileId
export const selectFileTimestamp = createCachedSelector(selectFile, (file): number => (file ? file.timestamp : null))(
  (_, args) => generateSelectorName(args, ['fileId'])
);

// args: fileId
export const selectFileUserId = createCachedSelector(
  selectFile,
  (file): Id => (file ? file.userId : null)
)((_, args) => generateSelectorName(args, ['fileId']));

export const selectImageGallery = createSelector(
  filesDomain,
  (domain): ImageGalleryRecordInterface => domain.get('imageGallery')
);

export const selectImageGalleryObjectId = createSelector(
  selectImageGallery,
  (imageGallery): Id => imageGallery.get('objectId')
);

export const selectImageGalleryStartImageId = createSelector(
  selectImageGallery,
  (imageGallery): Id => imageGallery.get('startImageId')
);

export const selectImageGalleryType = createSelector(
  selectImageGallery,
  (imageGallery): ImageGalleryType => imageGallery.get('imageGalleryType')
);

export const selectFilesContentTypes = createSelector(selectFilesData, (filesData): Map<Id, string> => {
  let result = emptyMap;

  filesData.forEach((file) => {
    result = result.set(file.id, file.contentType);
  });

  return result as Map<Id, string>;
});

export const selectFileInUploadName = createSelector(filesDomain, (filesModelDomain): string =>
  filesModelDomain.get('fileInUploadName')
);

export const selectFileUploadProgress = createSelector(filesDomain, (filesModelDomain): number =>
  filesModelDomain.get('fileUploadProgress')
);

// args: fileId
export const selectIsCurrentUserFile = createSelector(
  selectCurrentUserId,
  selectFileUserId,
  (currentUserId, userId) => currentUserId === userId
);
