import { Id } from "common/utils/identifier"
import { useSelector, useDispatch } from "react-redux"
import { selectMessageContainerId } from "common/models/domain/MessagesModel/selectors/domain"
import { onSetRespondedMessageId } from "common/models/domain/MessagesModel/actions"
import { useCallback } from "react"

type MessageResponsePreviewHookInterface = {
  objectId: Id,
  onStopResponse: VoidFunction
}

export default function useComponent(messageId: Id): MessageResponsePreviewHookInterface {

  // @ts-ignore
  const objectId = useSelector((state) => selectMessageContainerId(state, { messageId }))

  const dispatch = useDispatch()
  const onStopResponse = useCallback(
    () => dispatch(onSetRespondedMessageId(null)),
    [dispatch]
  )

  return {
    objectId,
    onStopResponse,
  }
}
