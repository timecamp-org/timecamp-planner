import React from 'react'
import PropTypes from 'prop-types'
import DocumentPicker from 'react-native-document-picker'

import { Image } from 'react-native'
import BaseComponent from 'BaseComponent'
import { isImage } from 'models/domain/FilesModel/helpers'
import normalizeFile from 'common/utils/normalizeFile'

function enhance(ComposedComponent) {
  class EnhanceFileUpload extends BaseComponent {

    static propTypes = {
      onUploadFiles: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          children={this.props.children}
          openFilePicker={this.openFilePicker}
        />
      )
    }

    openFilePicker() {
      DocumentPicker.pickMultiple({ type: DocumentPicker.types.allFiles })
        .then(files => {
          const normalizedFiles = files.map(file => {
            const normalizedFile = normalizeFile(file)
            if (isImage(normalizedFile.type)) {
              Image.getSize(normalizedFile.uri, (width, height) => {
                normalizedFile.width = width
                normalizedFile.height = height
              })
            }
            return normalizedFile
          })
          this.props.onUploadFiles(normalizedFiles)
        })
        .catch(error => {
          if (DocumentPicker.isCancel(error)) {
            console.log('user canceled file upload')
          } else {
            throw error
          }
        })
    }

  }

  return EnhanceFileUpload
}

export default enhance
