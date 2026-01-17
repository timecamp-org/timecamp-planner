import { domain } from './constants'
import createRequestId from '../RequestModel/createRequestId'
import createCachedSelector from 're-reselect';
import generateSelectorName from '../../../utils/generateSelectorName';
import { createSelector } from 'reselect';
import { selectContainerAccessLossTimestamp } from '../RequestModel/selectors';

const selectPaginationDomain = (state) => state.get(domain)

export const selectPageDomain = createSelector(
  selectPaginationDomain,
  (domain) => domain.get('page'),
)

export const selectPageTimestampDomain = createSelector(
  selectPaginationDomain,
  (domain) => domain.get('pageTimestamp'),
)

// args: objectId, requestType
export const selectPageLastNext = createCachedSelector(
  selectPageDomain,
  (_, args) => args.objectId,
  (_, args) => args.requestType,
  (pageDomain, objectId, requestType) => {
    const pageId = createRequestId(requestType, objectId)
    return pageDomain.get(pageId)
  },
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType'])
  )

// args: objectId, requestType
export const selectPageTimestamp = createCachedSelector(
  selectPageTimestampDomain,
  (_, args) => args.objectId,
  (_, args) => args.requestType,
  (pageTimestampDomain, objectId, requestType) => {
    const pageId = createRequestId(requestType, objectId)
    return pageTimestampDomain.get(pageId)
  },
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType'])
  )

// args:  objectId, requestType
export const selectHasMoreToLoad = createCachedSelector(
  selectPageLastNext,
  (page) => !(page === null),
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType'])
  )

// args: objectId, requestType, containerType, containerId
export const selectEntityContainedRequestPageLastNext = createCachedSelector(
  selectPageLastNext,
  selectPageTimestamp,
  selectContainerAccessLossTimestamp,
  (page, pageTimestamp, containerAccessLossTimestamp) => {
    if (containerAccessLossTimestamp && pageTimestamp && containerAccessLossTimestamp > pageTimestamp) {
      return undefined
    }

    return page
  },
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType', 'containerType', 'containerId'])
  )

// args: objectId, requestType, containerType, containerId
export const selectEntityContainedRequestHasMoreToLoad = createCachedSelector(
  selectEntityContainedRequestPageLastNext,
  (page) => !(page === null),
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType', 'containerType', 'containerId'])
  )
