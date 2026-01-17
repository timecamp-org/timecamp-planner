import React from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { PermissionsAndroid } from 'react-native';
import BaseComponent from 'BaseComponent';

import handleError from 'common/utils/handleError';

function Enhance(ComposedComponent) {
  class EnhanceWithFileDownload extends BaseComponent {
    // eslint-disable-line react/prefer-stateless-function

    render() {
      return <ComposedComponent {...this.props} onDownloadFile={this.onDownloadFile} />;
    }

    requestSaveFilePermission(callback) {
      try {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          title: 'Save File Permission',
          message: 'Planner needs access to your folders to save file there',
        }).then((granted) => callback(granted === PermissionsAndroid.RESULTS.GRANTED));
      } catch (error) {
        handleError(error);
      }
    }

    onDownloadFile(fileName, fileUrl) {
      try {
        this.requestSaveFilePermission((isGranted) => {
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
    }
  }

  return EnhanceWithFileDownload;
}

export default Enhance;
