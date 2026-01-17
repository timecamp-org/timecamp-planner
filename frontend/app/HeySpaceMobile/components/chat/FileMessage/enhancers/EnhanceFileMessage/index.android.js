import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import * as FilesModelSelectors from 'models/domain/FilesModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceFileMessage extends BaseComponent {

    static propTypes = {
      // needs
      attachmentId: PropTypes.string.isRequired,
      messageId: PropTypes.string.isRequired,
      onDownloadFile: PropTypes.func.isRequired,
      onLongPress: PropTypes.func,
      // injects
      fileUrl: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
    }


    render() {
      return (
        <ComposedComponent
          fileUrl={this.props.fileUrl}
          fileName={this.props.fileName}
          onClick={this.onDownloadFile}
          onLongPress={this.onLongPress}
        />
      )
    }

    onLongPress() {
      this.props.onLongPress(this.props.messageId)
    }

    onDownloadFile() {
      this.props.onDownloadFile(this.props.fileName, this.props.fileUrl)
    }

  }

  function mapStateToProps(state, props) {
    return {
      fileUrl: FilesModelSelectors.selectFileUrl(state, { fileId: props.attachmentId }),
      fileName: FilesModelSelectors.selectFileName(state, { fileId: props.attachmentId }),
    }
  }

  return connect(mapStateToProps)(EnhanceFileMessage)
}

export default Enhance
