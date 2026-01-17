import { useDispatch, useSelector } from 'react-redux';
import { Id } from 'common/utils/identifier';
import { selectIsMessageDeleteConfirmationVisible, selectMessageContainerId } from 'models/domain/MessagesModel/selectors/domain';
import {
  onSetMessageDeleteConfirmationVisibility,
  onMessageDelete,
  onDeleteUndeliveredMessage
} from 'models/domain/MessagesModel/actions';
import { useCallback } from 'react';

export type MessageDeleteConfirmationHookInterface = {
  isOpen: boolean,
  onToggleOpen: (isOpen: boolean) => void,
  onDeleteMessage: VoidFunction,
};

export default function useComponentHook(messageId: Id, hasMessageErrors: boolean): MessageDeleteConfirmationHookInterface {
  // @ts-ignore
  const isOpen = useSelector((state) => selectIsMessageDeleteConfirmationVisible(state, { messageId }))
  // @ts-ignore
  const objectId = useSelector((state) => selectMessageContainerId(state, { messageId }))

  const dispatch = useDispatch()
  const onDeleteMessage = useCallback(
    () => dispatch(hasMessageErrors? onDeleteUndeliveredMessage({objectId,messageId}) : onMessageDelete(objectId, messageId)),
    [dispatch, objectId, messageId]
  )
  const onToggleOpen = useCallback(
    () => dispatch(onSetMessageDeleteConfirmationVisibility(messageId, !isOpen)),
    [dispatch, messageId, isOpen]
  )

  return {
    isOpen,
    onToggleOpen,
    onDeleteMessage,
  };
}
