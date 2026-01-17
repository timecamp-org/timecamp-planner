import React from 'react'
import RNFetchBlob from 'rn-fetch-blob'
import BaseComponent from 'BaseComponent'

import handleError from 'common/utils/handleError'
import CameraRoll from '@react-native-community/cameraroll'
import { isFileAnImage } from 'utils/fileUtils'

function Enhance(ComposedComponent) {
  class EnhanceWithFileDownload extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onDownloadFile={this.onDownloadFile}
        />
      )
    }

    onDownloadFile(fileName, fileUrl) {
      if (isFileAnImage(fileName)) {
        CameraRoll.saveToCameraRoll(fileUrl)
      } else {
        this.saveFile(fileName, fileUrl)
      }
      return null
    }

    saveFile(fileName, fileUrl) {
      try {
        const { config, fs, ios } = RNFetchBlob
        config({
          fileCache: true,
        })
          .fetch('GET', fileUrl)
          .then(res => {
            const filePath = `${fs.dirs.DocumentDir}/${fileName}`
            fs.writeFile(
              filePath,
              res.path(),
              'base64',
            )
            ios.previewDocument(filePath)
          })
      } catch (error) {
        handleError(error, { fileName, fileUrl })
      }
    }

  }

  return (EnhanceWithFileDownload)
}

export default Enhance
