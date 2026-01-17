import React from 'react'
import styles from './styles'

import ProgressiveFileImage from '../../common/ProgressiveFileImage'
import { useComponent } from './hook'
import { Id } from 'common/utils/identifier'

export interface ImageMessageInterface {
  attachmentId: string,
  messageId: string,
  onLongPress: (messageId: Id) => void,
}

export const ImageMessage: React.FC<ImageMessageInterface> = (
  props: ImageMessageInterface
): JSX.Element => {

  const hook = useComponent(props)
  return (
    <ProgressiveFileImage
      fileId={props.attachmentId}
      style={styles.image}
      canUserDeleteMessage={hook.canUserDeleteMessage}
      onLongPress={hook.onLongPress}
      onDelete={hook.onMessageDelete}
      isPreviewable={true}
    />
  )
}

export default ImageMessage