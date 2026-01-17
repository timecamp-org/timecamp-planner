import { ImageMessageInterface } from './index'
import { useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { useSelector } from 'common/hooks/useSelector'
import * as FilesModelSelectors from 'models/domain/FilesModel/selectors'
import * as MessagesModelActions from 'models/domain/MessagesModel/actions'
import { selectMessageContainerId, selectMessageUser } from 'models/domain/MessagesModel/selectors/domain'
import { Id } from 'common/utils/identifier'

type DataProviderHook = {
  fileUrl: string,
  fileName: string,
  objectId: Id,
  currentUserId: Id,
  messageAuthorId: Id,
}

export const useDataProvider = (props: ImageMessageInterface): DataProviderHook => {
  return {
    // @ts-ignore
    fileUrl: useSelector(state => FilesModelSelectors.selectFileUrl(state, { fileId: props.attachmentId })),
    // @ts-ignore
    fileName: useSelector(state => FilesModelSelectors.selectFileName(state, { fileId: props.attachmentId })),
    // @ts-ignore
    objectId: useSelector(state => selectMessageContainerId(state, { messageId: props.messageId })),
    currentUserId: useSelector(state => selectCurrentUserId(state)),
    // @ts-ignore
    messageAuthorId: useSelector(state => selectMessageUser(state, { messageId: props.messageId })),
  }
}

type DataPersisterHook = {
  onMessageDelete: VoidFunction,
}

export const useDataPersister = ({ messageId }: ImageMessageInterface, objectId: string): DataPersisterHook => {
  const dispatch = useDispatch()

  return {
    onMessageDelete: useCallback(() => (
      dispatch(MessagesModelActions.onMessageDelete(objectId, messageId))
    ), [dispatch, objectId, messageId])
  }
}