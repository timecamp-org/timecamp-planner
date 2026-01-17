import RNFetchBlob from 'rn-fetch-blob'
import handleError from 'common/utils/handleError'
import CameraRoll from '@react-native-community/cameraroll'
import { isFileAnImage } from '../../utils/fileUtils'
import { UseFileDownloadHookInterface } from './useFileDownload'

export const useFileDownload = (): UseFileDownloadHookInterface => {
  const saveFile = async (fileName: string, fileUrl: string): Promise<void> => {
    try {
      const { config, fs, ios } = RNFetchBlob
      const response = await config({
        fileCache: true,
      }).fetch('GET', fileUrl)
      const filePath = `${fs.dirs.DocumentDir}/${fileName}`
      await fs.writeFile(
        filePath,
        response.path(),
        'base64',
      )
      ios.previewDocument(filePath)

    } catch (error) {
      handleError(error, { fileName, fileUrl })
    }
  }

  const onDownloadFile = async (fileName: string, fileUrl: string): Promise<void> => {
    if (isFileAnImage(fileName)) {
      await CameraRoll.saveToCameraRoll(fileUrl)
    } else {
      await saveFile(fileName, fileUrl)
    }
    return null
  }

  return { onDownloadFile }
}

export default useFileDownload
