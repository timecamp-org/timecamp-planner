import React from 'react'
import PropTypes from 'prop-types'
import { doNothing } from 'common/utils'
import styles from './styles.css'

import ProgressiveFileImage from 'commonComponents/ProgressiveFileImage'
import FileMessage from 'components/chat/FileMessage'
import Player from 'commonComponents/Player'
import { isImage, isVideo, isAudio } from 'models/domain/FilesModel/helpers'
import { ImageSize } from 'models/domain/FilesModel/types'

export const messageImageMaxSize = ImageSize.MEDIUM

MessageAttachment.propTypes = {
  id: PropTypes.string.isRequired,
  fileContentType: PropTypes.string.isRequired,
  fileUrl: PropTypes.string,
  onOpenImageGallery: PropTypes.func.isRequired,
}

MessageAttachment.defaultProps = {
  fileContentType: '',
  fileUrl: '',
  onOpenImageGallery: doNothing,
}

function MessageAttachment(props) {
  const isImageContent = isImage(props.fileContentType)
  const isVideoContent = isVideo(props.fileContentType)
  const isAudioContent = isAudio(props.fileContentType)
  if (isImageContent) {
    return (
      <ProgressiveFileImage
        id={props.id}
        onClick={props.onOpenImageGallery}
        className={styles.image}
        maxSize={messageImageMaxSize}
        allowOriginalDimensions={true}
      />
    )
  } else if (isVideoContent || isAudioContent) {
    return (
      <>
        <FileMessage
          id={props.id}
        />
        <Player
          url={props.fileUrl}
          height={isAudioContent ? 50 : undefined}
          placeholderClassName={isAudioContent ? styles.audioPlaceholder : undefined}
        />
      </>
    )
  } else {
    return (
      <FileMessage
        id={props.id}
      />
    )
  }

}

export default MessageAttachment
