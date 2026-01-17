import { useSelector } from 'common/hooks/useSelector'
import {
  selectViewSettingsBodyField,
  selectViewSettingsContainerId
} from 'models/domain/ViewSettingsModel/selectors/domain'
import { selectCurrentUserId } from 'models/domain/UsersModel/selectors/domain'
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain'
import { makeFilterId } from 'models/component/FiltersModel/utils'
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types'
import { selectFilterByProperty } from 'models/component/FiltersModel/selectors'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types'
import { generateProjectTimelineQueryParams } from '../../timeline/SpaceTimeline/dataHooks'
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers'
import { getProjectTasks, getOrganizationProjects } from 'models/domain/RequestModel/constants/requestTypes'
import { selectIsRequestFinished } from 'models/domain/RequestModel/selectors'
import { selectHasAccessToProject } from 'models/domain/ProjectsModel/selectors'
import { BaseSpaceTileHookInterface, BaseTileProps } from '../types'
import { getOrganizationProjectsWithUnreadMessagesQueryParams } from 'models/domain/ProjectsModel/requestQueryParams'

export const useDataProvider = (props: BaseTileProps): BaseSpaceTileHookInterface => {
  const containerId = useSelector(state => selectViewSettingsContainerId(state, { viewId: props.viewId }))
  const visibleTimeStart = useSelector(state => selectViewSettingsBodyField(state, { viewId: props.viewId, fieldName: 'visibleTimeStart' }))
  const visibleTimeEnd = useSelector(state => selectViewSettingsBodyField(state, { viewId: props.viewId, fieldName: 'visibleTimeEnd' }))
  const currentUserId = useSelector(state => selectCurrentUserId(state))
  const currentOrganizationId = useSelector(state => selectCurrentOrganizationId(state))

  const timelineFilterId = makeFilterId(currentUserId, TaskFiltersContainerType.OVERWATCH_SPACE_TILE, containerId)
  const taskStatusFilter = useSelector(state => selectFilterByProperty(state, { filterId: timelineFilterId, property: 'status' }))

  const fetchArchived = taskStatusFilter === TaskStatusFilterType.ARCHIVED
  const queryParams = generateProjectTimelineQueryParams(visibleTimeStart, visibleTimeEnd, fetchArchived)
  const requestType = getRequestTypeWithParams(getProjectTasks, queryParams)
  const objectId = containerId

  const isLoading = useSelector(state => !selectIsRequestFinished(state, { requestType, objectId }))

  const organizationProjectsRequestType = getRequestTypeWithParams(getOrganizationProjects, getOrganizationProjectsWithUnreadMessagesQueryParams)
  const isLoadingOrganizationProjects = useSelector(state => !selectIsRequestFinished(state, { requestType: organizationProjectsRequestType, objectId: currentOrganizationId }))

  const hasAccess = useSelector(state => selectHasAccessToProject(state, { projectId: containerId }))

  const hasAccessToView = isLoadingOrganizationProjects || isLoading || hasAccess
  return {
    hasAccessToView,
    isLoading,
    objectId,
  }
}
