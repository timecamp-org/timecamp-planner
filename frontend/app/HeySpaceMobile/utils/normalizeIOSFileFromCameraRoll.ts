import { Image } from 'react-native-image-crop-picker'

export interface NormalizedFileInterface {
  width: number,
  height: number,
  filePath: string,
  uri: string,
  size: number,
  name: string,
  type: string,
  mime: string,
}

const normalizeIOSFileFromCameraRoll = (file: Image): NormalizedFileInterface => {
  const { path, size, width, height, filename, mime } = file
  const name = filename
    ? filename
    : path.split('/').pop()
  return {
    width: width,
    height: height,
    filePath: path,
    uri: path,
    size: size,
    name,
    type: mime,
    mime,
  }
}

export default normalizeIOSFileFromCameraRoll
