import RNFetchBlob from 'rn-fetch-blob';
import { PermissionsAndroid } from 'react-native';
import handleError from 'common/utils/handleError';
import { UseFileDownloadHookInterface } from './useFileDownload';

type RequestSaveFilePermissionCallback = (isGranted: boolean) => void;

export const useFileDownload = (): UseFileDownloadHookInterface => {
  const requestSaveFilePermission = async (callback: RequestSaveFilePermissionCallback): Promise<void> => {
    try {
      const permissionStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        title: 'Save File Permission',
        message: 'Planner needs access to your folders to save file there',
        buttonPositive: 'OK',
      });
      callback(permissionStatus === PermissionsAndroid.RESULTS.GRANTED);
    } catch (error) {
      handleError(error);
    }
  };

  const onDownloadFile = async (fileName: string, fileUrl: string): Promise<void> => {
    try {
      await requestSaveFilePermission((isGranted) => {
        if (!isGranted) {
          return;
        }

        const { config, fs } = RNFetchBlob;
        const { PictureDir } = fs.dirs;
        const options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${PictureDir}/${fileName}`,
            description: 'Downloading file...',
          },
        };
        config(options).fetch('GET', fileUrl);
      });
    } catch (error) {
      handleError(error, { fileName, fileUrl });
    }
  };

  return { onDownloadFile };
};

export default useFileDownload;
