import React from 'react'
import PropTypes from 'prop-types'

import FileMessage from '../FileMessage'
import ImageMessage from '../ImageMessage'
import { isImage } from 'models/domain/FilesModel/helpers'
import { doNothing } from 'common/utils'

MessageAttachment.propTypes = {
  attachmentId: PropTypes.string.isRequired,
  messageId: PropTypes.string.isRequired,
  fileContentType: PropTypes.string.isRequired,
  onLongPress: PropTypes.func,
}

MessageAttachment.defaultProps = {
  onLongPress: doNothing,
}

export default function MessageAttachment(props) {
  return isImage(props.fileContentType)
    ? <ImageMessage attachmentId={props.attachmentId} messageId={props.messageId} onLongPress={props.onLongPress} />
    : <FileMessage attachmentId={props.attachmentId} messageId={props.messageId} onLongPress={props.onLongPress} />
}
