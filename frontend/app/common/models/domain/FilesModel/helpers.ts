import { Id } from 'client/src/types';
import { ImageSize, DimensionsInterface } from './types';
import { Config } from 'common/services';

export enum CropRule {
  FILL_CONTENT = '_b',
  CROP_TO_SIZE = '',
}

export const isImage = (contentType: string): boolean =>
  contentType && contentType.startsWith('image') && contentType !== 'image/vnd.adobe.photoshop';

export const isVideo = (contentType: string): boolean => contentType && contentType.startsWith('video');

export const isAudio = (contentType: string): boolean => contentType && contentType.startsWith('audio');

export const isGif = (contentType: string): boolean => contentType && contentType === 'image/gif';

export function getImageDimensions(x: number, y: number = x): string {
  return `${x}x${y}`;
}

/*
 * Generates url for thumbnail with specified dimension
 * _b part is for image crop rule to fill specified space
 */
export function getThumbnailUrl(
  url: string,
  size: number = ImageSize.MEDIUM,
  cropRule: CropRule = CropRule.FILL_CONTENT
): string {
  if (!url) {
    return '';
  }
  // Without a resize service (the default for self-hosted installations) there
  // are no thumbnails, so the original file is the only valid image URL.
  if (!Config.amazonResizeUrl) {
    return url;
  }
  const dimensions = getImageDimensions(size);
  const urlParts = url.split('/');
  return `${Config.amazonResizeUrl}${dimensions}${cropRule}/${urlParts[urlParts.length - 1]}`;
}

export function getThumbnailDimensions(
  fileWidth: number,
  fileHeight: number,
  maxSize: number,
  allowOriginalDimensions = false
): DimensionsInterface {
  if (!isPhotoDimesionsNotNull({ height: fileHeight, width: fileWidth })) {
    return { height: maxSize, width: maxSize };
  }

  if (allowOriginalDimensions && isPhotoSmallerThanSize({ height: fileHeight, width: fileWidth }, ImageSize.MEDIUM)) {
    return { height: fileHeight, width: fileWidth };
  }

  if (fileHeight > fileWidth) {
    return { height: maxSize, width: (maxSize * fileWidth) / fileHeight };
  } else {
    return { height: (maxSize * fileHeight) / fileWidth, width: maxSize };
  }
}

export function isPhotoSmallerThanSize(dimensions: DimensionsInterface, size: number): boolean {
  return dimensions.width < size && dimensions.height < size;
}

export function isPhotoDimesionsNotNull(dimensions: DimensionsInterface): boolean {
  return dimensions.width !== null && dimensions.height !== null;
}

export function getScaledThumbnailDimension(
  fileWidth: number,
  fileHeight: number,
  maxWidth: number,
  maxHeight: number
): DimensionsInterface {
  let scaledWidth = maxWidth;
  let scaledHeight = maxHeight;

  let currentDimensions: DimensionsInterface = {
    width: fileWidth,
    height: fileHeight,
  };
  let ratio = 0;

  if (!isPhotoDimesionsNotNull({ width: fileWidth, height: fileHeight })) {
    return { width: maxWidth, height: maxHeight };
  }

  if (currentDimensions.width > maxWidth) {
    ratio = maxWidth / currentDimensions.width;
    scaledWidth = maxWidth;
    scaledHeight = currentDimensions.height * ratio;
    currentDimensions = resetDimensionsToMatchScale(currentDimensions, ratio);
  } else {
    scaledWidth = currentDimensions.width;
  }

  if (currentDimensions.height > maxHeight) {
    ratio = maxHeight / currentDimensions.height;
    scaledWidth = currentDimensions.width * ratio;
    scaledHeight = maxHeight;
    currentDimensions = resetDimensionsToMatchScale(currentDimensions, ratio);
  } else {
    scaledHeight = currentDimensions.height;
  }

  return {
    width: scaledWidth,
    height: scaledHeight,
  };
}

function resetDimensionsToMatchScale(currentDimensions: DimensionsInterface, ratio: number): DimensionsInterface {
  return {
    width: currentDimensions.width * ratio,
    height: currentDimensions.height * ratio,
  };
}

export function getFilesQueryId(projectId: Id): [string, string] {
  return ['files', projectId];
}
