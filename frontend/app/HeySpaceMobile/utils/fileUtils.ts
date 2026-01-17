import { Maybe } from '../../common/types';
import imageExtensions from 'image-extensions';

export function getExtension(url: string): Maybe<string> {
  let extension = url.split('.').pop();
  if (extension) {
    extension = extension.toLowerCase();
  } else {
    return null;
  }
  return extension;
}

export function isFileAnImage(fileName: string): Maybe<boolean> {
  const extension = getExtension(fileName);
  if (extension) {
    return imageExtensions.includes(extension);
  }
  return null;
}
