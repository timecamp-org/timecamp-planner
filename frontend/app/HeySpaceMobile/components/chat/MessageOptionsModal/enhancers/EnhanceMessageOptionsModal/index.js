import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import RouteName from '../../../../AppNavigation/routeNames'
import { onMessageDelete, onMessageReactionAdd } from 'models/domain/MessagesModel/actions'
import { selectMessageContainerId, selectMessageUser } from 'models/domain/MessagesModel/selectors/domain'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import contentTypes from '../../contentTypes'
import { selectMessageFirstAttachmentId } from 'models/domain/MessagesModel/selectors'
import EnhanceWithFileDownload from '../../../../../enhancers/EnhanceWithFileDownload'
import { selectFileName, selectFileUrl } from 'models/domain/FilesModel/selectors'
import { NavigationService } from 'common/services'

function enhance(ComposedComponent) {
  @EnhanceWithFileDownload
  class EnhanceMessageOptionsModal extends BaseComponent {

    static propTypes = {
      messageId: PropTypes.string,
      currentUserId: PropTypes.string.isRequired,
      messageAuthorId: PropTypes.string,
      messageFirstAttachmentId: PropTypes.string,
      fileUrl: PropTypes.string,
      fileName: PropTypes.string,

      messageContainerId: PropTypes.string,
      onMessageDelete: PropTypes.func.isRequired,
      onDownloadFile: PropTypes.func.isRequired,
    }

    state = {
      visibleContent: this.isFileMessage() ? contentTypes.FILE : contentTypes.TEXT,
      prevIsOpen: this.props.isOpen,
    }

    static getDerivedStateFromProps(props, state) {
      if (props.isOpen !== state.prevIsOpen) {
        if (!state.prevIsOpen && (state.visibleContent !== contentTypes.TEXT || state.visibleContent !== contentTypes.FILE)) {
          return {
            prevIsOpen: props.isOpen,
            visibleContent: props.messageFirstAttachmentId ? contentTypes.FILE : contentTypes.TEXT,
          }
        }

        return {
          prevIsOpen: props.isOpen,
        }
      }

      return null
    }

    render() {
      return (
        <ComposedComponent
          visibleContent={this.state.visibleContent}
          isOpen={this.props.isOpen}
          canUserDeleteMessage={this.canUserDeleteMessage()}

          onNavigateToConvertMessageToTask={this.onNavigateToConvertMessageToTask}
          onClose={this.props.onClose}
          onSetVisibleContentType={this.onSetVisibleContentType}
          onCancelDeleteMessage={this.onCancelDeleteMessage}
          onMessageDelete={this.onMessageDelete}
          onDownloadFile={this.onDownloadFile}
          onCopyMessage={this.props.onCopyMessage}
          onChooseEmoji={this.onChooseEmoji}
        />
      )
    }

    onChooseEmoji(emojiCode) {
      this.props.onAddReaction(emojiCode)
      this.props.onClose()
    }

    canUserDeleteMessage() {
      return this.props.currentUserId === this.props.messageAuthorId
    }

    onSetVisibleContentType(contentType) {
      this.setState({
        visibleContent: contentType,
      })
    }

    onCancelDeleteMessage() {
      this.props.onClose()
    }

    onDownloadFile() {
      if (this.props.fileName && this.props.fileUrl) {
        this.props.onDownloadFile(this.props.fileName, this.props.fileUrl)
        this.props.onClose()
      }
    }

    onNavigateToConvertMessageToTask() {
      this.props.onClose()
      NavigationService.navigate(RouteName.CONVERT_MESSAGE_TO_CARD, {
        messageId: this.props.messageId,
        projectId: this.props.messageContainerId,
      })
    }

    onMessageDelete() {
      if (this.canUserDeleteMessage()) {
        this.props.onMessageDelete(this.props.messageContainerId)
        this.props.onClose()
      }
    }

    isFileMessage() {
      return !!this.props.messageFirstAttachmentId
    }

  }

  const mapStateToProps = (state, props) => {
    const messageFirstAttachmentId = selectMessageFirstAttachmentId(state, { messageId: props.messageId })
    return {
      currentUserId: selectCurrentUserId(state),
      messageContainerId: selectMessageContainerId(state, { messageId: props.messageId }),
      messageAuthorId: selectMessageUser(state, { messageId: props.messageId }),
      messageFirstAttachmentId,
      fileName: selectFileName(state, { fileId: messageFirstAttachmentId }),
      fileUrl: selectFileUrl(state, { fileId: messageFirstAttachmentId }),
    }
  }

  const mapDispatchToProps = (dispatch, props) => ({
    onMessageDelete: (messageContainerId) => (
      dispatch(onMessageDelete(messageContainerId, props.messageId))
    ),
    onAddReaction: (emojiCode) => dispatch(onMessageReactionAdd(props.messageId, emojiCode)),
  })

  return connect(mapStateToProps, mapDispatchToProps)(EnhanceMessageOptionsModal)
}

export default enhance
