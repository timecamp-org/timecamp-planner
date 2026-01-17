import { LinkPreviewInterface } from './index';
import { useSelector, useDispatch } from 'react-redux'
import { EntityType } from 'models/domain/EntityModel/types'
import { selectProjectColor } from 'models/domain/ProjectsModel/selectors/index'
import { selectTaskColor } from 'models/domain/TasksModel/selectors/index'
import { selectEntityType } from 'models/domain/EntityModel/selectors'
import { getLinkMetadata } from 'models/domain/RequestModel/constants/requestTypes'
import { selectLinkPreviewProperty } from 'models/domain/LinkPreviewModel/selectors'
import { selectRequestIsLoading, selectIsRequestRepeatable } from 'models/domain/RequestModel/selectors'
import { selectDoesMessageBelongToCurrentUser } from 'models/domain/MessagesModel/selectors'
import {
  selectMessageIsLinkPreviewEnabled,
  selectMessageContainerId,
} from 'models/domain/MessagesModel/selectors/domain'
import { onFetchLinkMetadata } from 'models/domain/LinkPreviewModel/actions'
import { useCallback } from 'react'

export type DataProviderHook = {
  imageUrl: string,
  logo: string,
  title: string,
  description: string,
  publisher: string,
  isLoading: boolean,
  canBeFetched: boolean,
  color: string,
  isOwnMessage: boolean,
  isLinkPreviewEnabled: boolean,
};

export function useDataProvider(props: LinkPreviewInterface): DataProviderHook {
  // @ts-ignore
  const objectId = useSelector(state => selectMessageContainerId(state, { messageId: props.messageId }))
  const entityType = useSelector(state => selectEntityType(state, { entityId: objectId }))
  let color
  if (entityType === EntityType.TASK_DATA) {
    color = useSelector(state => selectTaskColor(state, { taskId: objectId }))
  } else {
    color = useSelector(state => selectProjectColor(state, { projectId: objectId }))
  }
  return {
    imageUrl: useSelector(state => selectLinkPreviewProperty(state, { targetUrl: props.url, property: 'image' })),
    logo: useSelector(state => selectLinkPreviewProperty(state, { targetUrl: props.url, property: 'logo' })),
    title: useSelector(state => selectLinkPreviewProperty(state, { targetUrl: props.url, property: 'title' })),
    description: useSelector(state => selectLinkPreviewProperty(state, { targetUrl: props.url, property: 'description' })),
    publisher: useSelector(state => selectLinkPreviewProperty(state, { targetUrl: props.url, property: 'publisher' })),
    isLoading: useSelector(state => selectRequestIsLoading(state, { requestType: getLinkMetadata, objectId: props.url })),
    canBeFetched: useSelector(state => selectIsRequestRepeatable(state, { requestType: getLinkMetadata, objectId: props.url })),
    color,
    // @ts-ignore
    isOwnMessage: useSelector(state => selectDoesMessageBelongToCurrentUser(state, { messageId: props.messageId })),
    // @ts-ignore
    isLinkPreviewEnabled: useSelector(state => selectMessageIsLinkPreviewEnabled(state, { messageId: props.messageId })),
  }
}

export type DataPersisterHook = {
  onFetchLinkMetadata: VoidFunction
};

export function useDataPersister(props: LinkPreviewInterface): DataPersisterHook {

  const dispatch = useDispatch();

  return {
    onFetchLinkMetadata: useCallback(
      () => dispatch(onFetchLinkMetadata(props.url)),
      [props.url, dispatch]
    ),
  };
}
