import createCachedSelector from 're-reselect'
import createRequestId from '../createRequestId'
import { RequestStatus, ResponseCode } from '../types'
import generateSelectorName from '../../../../utils/generateSelectorName'
import { isRequestRepetable, isEntityContainedRequestRepetable } from '../helpers'
import {
  selectRequestTimestampDomain,
  selectRequestStatusDomain,
  selectRequestDataDomain,
  selectRequestCountDomain,
  selectRequestDirtyDomain,
  selectContainerAccessLossTimestampDomain, selectRequestErrorDomain
} from './domain'
import { createSelector } from 'reselect'
import { selectCurrentOrganizationId } from '../../OrganizationsModel/selectors/domain'
import * as RequestType from '../constants/requestTypes'

const requestFinishedStatuses = [RequestStatus.SUCCESS, RequestStatus.FAILURE]

// args: objectId, requestType
export const selectRequestTimestamp = createCachedSelector(
  selectRequestTimestampDomain,
  (_, args) => args.requestType,
  (_, args) => args.objectId,
  (requestTimestammpDomain, requestType, objectId) => {
    const id = createRequestId(requestType, objectId)
    return requestTimestammpDomain.get(id)
  }
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectRequestStatus = createCachedSelector(
  selectRequestStatusDomain,
  (_, args) => args.requestType,
  (_, args) => args.objectId,
  (domain, requestType, objectId) => {
    const id = createRequestId(requestType, objectId)
    return domain.get(id)
  },
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectRequestData = createCachedSelector(
  selectRequestDataDomain,
  (_, args) => args.requestType,
  (_, args) => args.objectId,
  (domain, requestType, objectId) => {
    const id = createRequestId(requestType, objectId)
    return domain.get(id)
  },
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectRequestCount = createCachedSelector(
  selectRequestCountDomain,
  (_, args) => args.requestType,
  (_, args) => args.objectId,
  (domain, requestType, objectId) => {
    const id = createRequestId(requestType, objectId)
    return domain.get(id) || 0
  },
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectIsRequestDirty = createCachedSelector(
  selectRequestDirtyDomain,
  (_, args) => args.requestType,
  (_, args) => args.objectId,
  (dirtyRequests, requestType, objectId) => {
    const id = createRequestId(requestType, objectId)
    return dirtyRequests.includes(id)
  }
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )


// args: objectId, requestType
export const selectRequestIsLoading = createCachedSelector(
  selectRequestStatus,
  (status) => status === RequestStatus.LOADING,
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectRequestIsSuccess = createCachedSelector(
  selectRequestStatus,
  (status) => status === RequestStatus.SUCCESS,
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectRequestIsFailure = createCachedSelector(
  selectRequestStatus,
  (status) => status === RequestStatus.FAILURE,
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectIsRequestRepeatable = createCachedSelector(
  selectRequestStatus,
  selectIsRequestDirty,
  (status, isDirty) => isRequestRepetable(status, isDirty),
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectIsRequestFinished = createCachedSelector(
  selectRequestStatus,
  (status) => status && requestFinishedStatuses.includes(status),
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectIsRequestNotFinishedInitially = createCachedSelector(
  selectIsRequestFinished,
  selectRequestCount,
  (isRequestFinished, count) => !isRequestFinished && count <= 1,
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const selectRequestIsLoadingInitially = createCachedSelector(
  selectRequestIsLoading,
  selectRequestCount,
  (isLoading, requestCount) => isLoading && requestCount === 1,
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: objectId, requestType
export const isRequestRepeated = createCachedSelector(
  selectRequestCount,
  (count) => count && count > 1,
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType']),
  )

// args: containerType
export const selectContainerAccessLossTimestamps = createCachedSelector(
  selectContainerAccessLossTimestampDomain,
  (_, args) => args.containerType,
  (containerAccessLossTimestampDomain, containerType) => containerAccessLossTimestampDomain.get(containerType),
)
  (
    (_, args) => generateSelectorName(args, ['containerType']),
  )

// args: containerType, containerId
export const selectContainerAccessLossTimestamp = createCachedSelector(
  selectContainerAccessLossTimestamps,
  (_, args) => args.containerId,
  (containerAccessLossTimestamps, containerId) => containerAccessLossTimestamps && containerAccessLossTimestamps.get(containerId),
)
  (
    (_, args) => generateSelectorName(args, ['containerType', 'containerId']),
  )

// args: objectId, requestType, containerId, containerType
export const selectIsEntityContainedRequestRepeatable = createCachedSelector(
  selectRequestStatus,
  selectIsRequestDirty,
  selectRequestTimestamp,
  selectContainerAccessLossTimestamp,
  (status, isDirty, requestTimestamp, containerAccessLossTimestamp) =>
    isEntityContainedRequestRepetable(status, isDirty, containerAccessLossTimestamp, requestTimestamp),
)
  (
    (_, args) => generateSelectorName(args, ['objectId', 'requestType', 'containerId', 'containerType']),
  )

export const selectSubscriptionViewRequestStatus = createSelector(
  selectCurrentOrganizationId,
  selectRequestStatusDomain,
  (organizationId, requestStatusDomain) => {
    const requestId = createRequestId(RequestType.getSubscriptionViewData, organizationId)
    return requestStatusDomain.get(requestId)
  },
)

export const selectOrganizationGuestsViewRequestStatus = createSelector(
  selectCurrentOrganizationId,
  selectRequestStatusDomain,
  (organizationId, requestStatusDomain) => {
    const requestId = createRequestId(RequestType.getOrganizationProjectsGuestInProject, organizationId)
    return requestStatusDomain.get(requestId)
  },
)

export const selectRequestErrorStatusCode = createSelector(
  selectRequestErrorDomain,
  (_, args) => args.requestType,
  (_, args) => args.objectId,
  (domain, requestType, objectId) => {
    const id = createRequestId(requestType, objectId)
    const error = domain.get(id)
    return error?.params.statusCode
  },
)

export const selectIsForbiddenError = createSelector(
  selectRequestErrorStatusCode,
  (_, args) => args.requestType,
  (_, args) => args.objectId,
  (statusCode) => statusCode === ResponseCode.FORBIDDEN
)