import createCachedSelector from 're-reselect'
import get from 'lodash/get'
import createRequestId from '../createRequestId'
import { RequestStatus } from '../types'
import generateSelectorName from '../../../../utils/generateSelectorName'
import { selectFiltersData } from "../../../component/FiltersModel/selectors";
import { makeFilterId } from "../../../component/FiltersModel/utils";
import { selectCurrentUserId } from "../../UsersModel/selectors/domain";
import { TaskStatusFilterType } from "../../TasksModel/types";
import { ProjectViewQueryParams } from "../types";
import { getProjectViewData, getConversationViewData } from "../constants/requestTypes";
import { getRequestTypeWithParams, isEntityContainedRequestRepetable } from '../helpers';
import { EntityType } from '../../EntityModel/types'
import {
  selectRequestStatusDomain,
  selectRequestCountDomain,
  selectRequestDirtyDomain,
  selectContainerAccessLossTimestampDomain,
  selectRequestTimestampDomain
} from './domain'

// args: projectId, forceFetchArchived?: boolean, isConversation?, taskFiltersTargetType
export const selectProjectViewRequestId = createCachedSelector(
  selectFiltersData,
  selectCurrentUserId,
  (_, args) => args.projectId,
  (_, args) => args.forceFetchArchived,
  (_, args) => args.isConversation,
  (_, args) => args.taskFiltersTargetType,
  (filtersData, currentUserId, projectId, forceFetchArchived, isConversation, taskFiltersTargetType) => {
    const filterId = makeFilterId(currentUserId, taskFiltersTargetType, projectId)
    const filter = filtersData.get(filterId)

    const fetchArchived = forceFetchArchived || (get(filter, 'filterByField.status') === TaskStatusFilterType.ARCHIVED)
    const queryParams: ProjectViewQueryParams = {
      fetchArchived
    }

    const requestType = getRequestTypeWithParams(isConversation ? getConversationViewData : getProjectViewData, queryParams)
    return createRequestId(requestType, projectId)
  }
)
  (
    (_, args) => generateSelectorName(args, ['projectId', 'forceFetchArchived', 'isConversation', 'taskFiltersTargetType']),
  )



//args: projectId, forceFetchArchived?: boolean, isConversation?, taskFiltersTargetType
export const selectProjectViewRequestStatus = createCachedSelector(
  selectProjectViewRequestId,
  selectRequestStatusDomain,
  (requestId, requestStatusDomain) => requestStatusDomain.get(requestId)
)
  (
    (_, args) => generateSelectorName(args, ['projectId', 'forceFetchArchived', 'isConversation', 'taskFiltersTargetType']),
  )

// args: projectId, forceFetchArchived?: boolean, isConversation?
export const selectProjectViewRequestIsLoading = createCachedSelector(
  selectProjectViewRequestStatus,
  (requestStatus) => requestStatus === RequestStatus.LOADING
)
  (
    (_, args) => generateSelectorName(args, ['projectId', 'forceFetchArchived', 'isConversation', 'taskFiltersTargetType']),
  )

// args: projectId, forceFetchArchived?: boolean, isConversation?
export const selectProjectViewRequestIsLoadingInitially = createCachedSelector(
  selectProjectViewRequestId,
  selectRequestStatusDomain,
  selectRequestCountDomain,
  (requestId, requestStatusDomain, requestCountDomain) => {
    const requestStatus = requestStatusDomain.get(requestId)
    const requestCount = requestCountDomain.get(requestId, 0)

    return requestStatus === RequestStatus.LOADING && requestCount === 1
  }
)
  (
    (_, args) => generateSelectorName(args, ['projectId', 'forceFetchArchived', 'isConversation', 'taskFiltersTargetType']),
  )


// args: projectId, forceFetchArchived?: boolean
export const selectProjectViewRequestIsRepeatable = createCachedSelector(
  selectProjectViewRequestId,
  selectRequestStatusDomain,
  selectRequestDirtyDomain,
  selectRequestTimestampDomain,
  selectContainerAccessLossTimestampDomain,
  (_, args) => args.projectId,
  (requestId, requestStatusDomain, dirtyRequestDomain, requestTimestampDomain, containerAccessLossTimestampDomain, projectId) => {
    const isRequestDirty = dirtyRequestDomain.get(requestId)
    const requestStatus = requestStatusDomain.get(requestId)
    const requestTimestamp = requestTimestampDomain.get(requestId)
    const projectAccessLossTimestamps = containerAccessLossTimestampDomain.get(EntityType.PROJECT_DATA)
    const projectAccessLossTimestamp = projectAccessLossTimestamps && projectAccessLossTimestamps.get(projectId)

    return isEntityContainedRequestRepetable(requestStatus, isRequestDirty, projectAccessLossTimestamp, requestTimestamp)
  }
)
  (
    (_, args) => generateSelectorName(args, ['projectId', 'forceFetchArchived']),
  )
