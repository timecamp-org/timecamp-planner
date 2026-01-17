import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BaseComponent from 'BaseComponent'

import * as FilesModelSelectors from 'models/domain/FilesModel/selectors'

function Enhance(ComposedComponent) {
  class EnhanceMessageAttachment extends BaseComponent { // eslint-disable-line react/prefer-stateless-function

    static propTypes = {
      attachmentId: PropTypes.string.isRequired,
      messageId: PropTypes.string.isRequired,
      fileContentType: PropTypes.string.isRequired,
    };


    render() {
      return (
        <ComposedComponent
          attachmentId={this.props.attachmentId}
          messageId={this.props.messageId}
          fileContentType={this.props.fileContentType}
          onLongPress={this.props.onLongPress}
        />
      )
    }

  }

  function mapStateToProps(state, props) {
    return {
      fileContentType: FilesModelSelectors.selectFileContentType(state, { fileId: props.attachmentId }),
    }
  }

  return connect(mapStateToProps)(EnhanceMessageAttachment)
}

export default Enhance
