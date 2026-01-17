import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { Linking } from 'react-native'

import * as FilesModelSelectors from 'models/domain/FilesModel/selectors'
import handleError from 'common/utils/handleError'

export const actionSheetOptionsTypes = {
  DOWNLOAD: 'Download',
  DELETE: 'Delete',
  VIEW: 'View attachment',
}

export const actionSheetOptions = [
  actionSheetOptionsTypes.DOWNLOAD,
  actionSheetOptionsTypes.VIEW,
  actionSheetOptionsTypes.DELETE,
]

export const destructiveOptions = [
  actionSheetOptionsTypes.DELETE,
]

function Enhance(ComposedComponent) {
  class EnhanceCardAttachment extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      id: PropTypes.string.isRequired,
      isModalOpen: PropTypes.bool,
      color: PropTypes.string,
      fileUrl: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      fileTimestamp: PropTypes.number.isRequired,
      fileUserId: PropTypes.string.isRequired,
      fileContentType: PropTypes.string.isRequired,

      onDeleteFile: PropTypes.func.isRequired,
    }

    state = {
      isActionSheetOpen: false,
    }

    render() {
      return (
        <ComposedComponent
          id={this.props.id}
          fileUrl={this.props.fileUrl}
          fileContentType={this.props.fileContentType}
          fileName={this.props.fileName}
          fileUserId={this.props.fileUserId}
          fileTimestamp={this.props.fileTimestamp}
          color={this.props.color}

          isActionSheetOpen={this.state.isActionSheetOpen}
          actionSheetOptions={actionSheetOptions}
          destructiveOptions={destructiveOptions}
          canUserDeleteMessage={this.props.canUserDeleteMessage}
          onSelectActionSheetOption={this.onSelectActionSheetOption}
          onCloseActionSheet={this.onCloseActionSheet}

          onPress={this.onOpenActionSheet}
          onDeleteFile={this.props.onDeleteFile}
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

    onSelectActionSheetOption(index) {
      const option = actionSheetOptions[index]

      switch (option) {
        case actionSheetOptionsTypes.DOWNLOAD: {
          const {
            onDownloadFile,
            fileName,
            fileUrl,
          } = this.props
          onDownloadFile(fileName, fileUrl)
          this.onCloseActionSheet()
          break
        }
        case actionSheetOptionsTypes.VIEW: {
          Linking.openURL(this.props.fileUrl)
            .catch(error => handleError(error, { fileUrl: this.props.fileUrl }))
          this.onCloseActionSheet()
          break
        }
        case actionSheetOptionsTypes.DELETE: {
          this.props.onDeleteFile(this.props.id)
          this.onCloseActionSheet()
          break
        }
        default: {
          console.warn('No action implemented for chosen option')
          break
        }
      }
    }


  }

  const mapStateToProps = (state, props) => ({
    fileUrl: FilesModelSelectors.selectFileUrl(state, { fileId: props.id }),
    fileName: FilesModelSelectors.selectFileName(state, { fileId: props.id }),
    fileContentType: FilesModelSelectors.selectFileContentType(state, { fileId: props.id }),
    fileTimestamp: FilesModelSelectors.selectFileTimestamp(state, { fileId: props.id }),
    fileUserId: FilesModelSelectors.selectFileUserId(state, { fileId: props.id }),
  })

  return connect(mapStateToProps)(EnhanceCardAttachment)
}

export default Enhance
