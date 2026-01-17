import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import BaseComponent from 'BaseComponent'
import { onCreateMessagesWithFiles } from 'models/domain/MessagesModel/actions'

function enhance(ComposedComponent) {
  class EnhanceNewMessageInputActionIcons extends BaseComponent {

    static propTypes = {
      onUploadFiles: PropTypes.func.isRequired,
    }

    render() {
      return (
        <ComposedComponent
          onUploadFiles={this.props.onUploadFiles}
        />
      )
    }

  }

  const mapDispatchToProps = (dispatch, props) => ({
    onUploadFiles: (files) => dispatch(onCreateMessagesWithFiles(files, props.objectId)),
  })

  return connect(null, mapDispatchToProps)(EnhanceNewMessageInputActionIcons)
}

export default enhance
