import useFileDownloadIOS from './useFileDownload.ios'
import useFileDownloadAndroid from './useFileDownload.android'
import { getPlatformSpecificModule } from '../../utils/isIOS'

export type UseFileDownloadHookInterface = {
  onDownloadFile: (fileName: string, fileUrl: string) => Promise<void>
}

type UseFileDownload = () => UseFileDownloadHookInterface

export const useFileDownload = getPlatformSpecificModule<UseFileDownload>(useFileDownloadIOS, useFileDownloadAndroid)

export default useFileDownload