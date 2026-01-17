import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Linking } from 'react-native'
import handleError from 'common/utils/handleError'
import BaseComponent from 'BaseComponent'

import * as FilesModelSelectors from 'models/domain/FilesModel/selectors'
import * as MessagesModelActions from 'models/domain/MessagesModel/actions'
import { selectMessageContainerId } from 'models/domain/MessagesModel/selectors/domain'
import EnhanceWithCanCurrentUserDeleteMessage from '../../../../../enhancers/EnhanceWithCanCurrentUserDeleteMessage'

export const actionSheetOptionsTypes = {
  DELETE: 'Delete',
  VIEW: 'View attachment',
  DOWNLOAD: 'Download'
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
  @EnhanceWithCanCurrentUserDeleteMessage
  class EnhanceFileMessage extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      attachmentId: PropTypes.string.isRequired,
      messageId: PropTypes.string.isRequired,
      // injects
      fileUrl: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      objectId: PropTypes.string.isRequired,
      canCurrentUserDeleteMessage: PropTypes.bool.isRequired,
    }

    state = {
      isActionSheetOpen: false,
    }

    render() {
      return (
        <ComposedComponent
          fileUrl={this.props.fileUrl}
          fileName={this.props.fileName}
          isActionSheetOpen={this.state.isActionSheetOpen}
          actionSheetOptions={actionSheetOptions}
          destructiveOptions={destructiveOptions}
          canUserDeleteMessage={this.props.canUserDeleteMessage}
          onSelectActionSheetOption={this.onSelectActionSheetOption}
          onCloseActionSheet={this.onCloseActionSheet}

          onPress={this.onOpenActionSheet}
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
          this.props.onMessageDelete(this.props.objectId)
          this.onCloseActionSheet()
          break
        }
        default: {
          console.warn('No action implemented for chosen option')
          break
        }
      }
    }


    onMessageDelete() {
      this.props.onMessageDelete(this.props.objectId)
    }

  }

  function mapStateToProps(state, props) {
    return {
      fileUrl: FilesModelSelectors.selectFileUrl(state, { fileId: props.attachmentId }),
      fileName: FilesModelSelectors.selectFileName(state, { fileId: props.attachmentId }),
      objectId: selectMessageContainerId(state, { messageId: props.messageId }),
    }
  }

  function mapDispatchToProps(dispatch, props) {
    return {
      onMessageDelete: (objectId) => (
        dispatch(MessagesModelActions.onMessageDelete(objectId, props.messageId))
      ),
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceFileMessage)
}

export default Enhance
