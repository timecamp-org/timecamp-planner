import { ImageMessageInterface } from './index'
import { useDataPersister, useDataProvider } from './dataHooks'
import { useCallback } from 'react'

type ImageMessageHookInterface = {
  fileUrl: string,
  canUserDeleteMessage: boolean,

  onMessageDelete: VoidFunction,
  onLongPress: VoidFunction,
}

export const useComponent = (
  props: ImageMessageInterface
): ImageMessageHookInterface => {
  const {
    fileUrl,
    objectId,
    currentUserId,
    messageAuthorId,
  } = useDataProvider(props)

  const { onMessageDelete } = useDataPersister(props, objectId)

  const canUserDeleteMessage = currentUserId === messageAuthorId

  const onLongPress = useCallback(
    () => props.onLongPress(props.messageId),
      [props.messageId]
    )

  return {
    fileUrl,
    canUserDeleteMessage,
    onMessageDelete,
    onLongPress
  }
}