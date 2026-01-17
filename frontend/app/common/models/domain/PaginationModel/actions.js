import * as PaginationConstants from './constants'
import createRequestId from '../RequestModel/createRequestId'

export function onSetPageLastNext(requestType, objectId, lastPageNext) {
  const pageId = createRequestId(requestType, objectId)
  return {
    type: PaginationConstants.onSetPageLastNext,
    pageId,
    lastPageNext,
  }
}

export function onClearState() {
  return {
    type: PaginationConstants.onClearState,
  }
}
