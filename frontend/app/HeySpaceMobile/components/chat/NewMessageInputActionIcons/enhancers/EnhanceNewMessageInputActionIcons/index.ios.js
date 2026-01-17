import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isImage } from 'models/domain/FilesModel/helpers'
import ImagePicker from 'react-native-image-crop-picker'

import BaseComponent from 'BaseComponent'
import { Image } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { onCreateMessagesWithFiles } from 'models/domain/MessagesModel/actions'
import normalizeFile from 'common/utils/normalizeFile'
import normalizeIOSFileFromCameraRoll from '../../../../../utils/normalizeIOSFileFromCameraRoll'

export const optionTypes = {
  OPEN_FILES: 'Saved files',
  OPEN_CAMERA_ROLL: 'Camera roll',
  OPEN_CAMERA: 'Take a photo',
  OPEN_VIDEO_CAMERA: 'Record a video',
}

const listOptions = [optionTypes.OPEN_FILES, optionTypes.OPEN_CAMERA_ROLL, optionTypes.OPEN_CAMERA, optionTypes.OPEN_VIDEO_CAMERA]

function enhance(ComposedComponent) {
  class EnhanceNewMessageInputActionIcons extends BaseComponent {

    static propTypes = {
      objectId: PropTypes.string.isRequired,
      onUploadFiles: PropTypes.func.isRequired,
    }

    state = {
      isActionSheetOpen: false,
      isCameraRollPickerOpen: false,
    }

    render() {
      return (
        <ComposedComponent
          objectId={this.props.objectId}
          isActionSheetOpen={this.state.isActionSheetOpen}
          isCameraRollPickerOpen={this.state.isCameraRollPickerOpen}
          listOptions={listOptions}
          onOpenActionSheet={this.onOpenActionSheet}
          onCloseActionSheet={this.onCloseActionSheet}
          onSelectOption={this.onSelectOption}
          onCloseCameraRollPicker={this.onCloseCameraRollPicker}
        />
      )
    }

    onOpenActionSheet() {
      this.setState({
        isActionSheetOpen: true,
      })
    }

    onCloseActionSheet() {
      this.setState({
        isActionSheetOpen: false,
      })
    }

    onOpenCameraRollPicker() {
      // don't ask me why we need to set timeout here. Without timeout picker immediately closes
      // fix from: https://github.com/ivpusic/react-native-image-crop-picker/issues/1104#issuecomment-573271779
      // related issue: https://github.com/ivpusic/react-native-image-crop-picker/issues/1257
      setTimeout(() => {
        ImagePicker.openPicker({
          multiple: true,
        }).then(files => {
          const normalizedFiles = files.map(image => normalizeIOSFileFromCameraRoll(image))
          this.props.onUploadFiles(normalizedFiles)
        }).catch(error => {
          // do nothing, user closed picker
        })
      }, 500)
    }

    onOpenCamera() {
      setTimeout(() => {
        ImagePicker.openCamera({
          mediaType: 'photo',
        }).then(image => {
          const normalizedImage = normalizeIOSFileFromCameraRoll(image)
          this.props.onUploadFiles([normalizedImage])
        }).catch(error => {
          // do nothing, user closed camera
        })
      }, 500)
    }

    onOpenVideoCamera() {
      setTimeout(() => {
        ImagePicker.openCamera({
          mediaType: 'video',
        }).then(video => {
          const normalizedVideo = normalizeIOSFileFromCameraRoll(video)
          this.props.onUploadFiles([normalizedVideo])
        }).catch(error => {
          // do nothing, user closed camera
        })
      }, 500)
    }

    onCloseCameraRollPicker() {
      this.setState({
        isCameraRollPickerOpen: false,
      })
    }

    onSelectOption(index) {
      const option = listOptions[index]

      switch (option) {
        case optionTypes.OPEN_FILES: {
          this.openFilePicker()
          break
        }

        case optionTypes.OPEN_CAMERA_ROLL: {
          this.setState({
            isActionSheetOpen: false,
          }, this.onOpenCameraRollPicker)
          break
        }

        case optionTypes.OPEN_CAMERA: {
          this.setState({
            isActionSheetOpen: false,
          }, this.onOpenCamera)
          break
        }

        case optionTypes.OPEN_VIDEO_CAMERA: {
          this.setState({
            isActionSheetOpen: false,
          }, this.onOpenVideoCamera)
          break
        }

        default:
          break
      }
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
          this.onCloseActionSheet()
        })
        .catch(error => {
          this.onCloseActionSheet()
          if (DocumentPicker.isCancel(error)) {
            console.log('user canceled file upload')
          } else {
            throw error
          }
        })
    }


  }

  const mapDispatchToProps = (dispatch, props) => ({
    onUploadFiles: (files) => dispatch(onCreateMessagesWithFiles(files, props.objectId)),
  })

  return connect(null, mapDispatchToProps)(EnhanceNewMessageInputActionIcons)
}

export default enhance
