import { useSelector } from 'common/hooks/useSelector'
import { DataProviderHookInterface } from './dataHooks'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types';
import { TaskFiltersResultsCountInterface } from '.';
import { selectRequestIsSuccess } from 'models/domain/RequestModel/selectors';
import { getRequestTypeWithParams } from 'models/domain/RequestModel/helpers';
import { getProjectTasks } from 'models/domain/RequestModel/constants/requestTypes';
import { generateProjectTimelineQueryParams } from '../../../overwatch/timeline/SpaceTimeline/dataHooks';
import {
  selectViewSettingsBodyField,
  selectViewSettingsIdByTypeAndContainerId
} from 'models/domain/ViewSettingsModel/selectors/domain';
import { ViewSettingsViewType, ViewContainerType } from 'models/domain/ViewSettingsModel/types';
import { selectFilteredTimelineTaskIdsCountPreview } from 'models/domain/TasksModel/selectors/timelineSelectors';


export function useDataProvider(props: TaskFiltersResultsCountInterface): DataProviderHookInterface {
  let resultsCount
  const [filterKey, filterValue] = props.filterPath

  const viewId = useSelector(state => selectViewSettingsIdByTypeAndContainerId(state, {
    viewType: ViewSettingsViewType.TIMELINE,
    containerId: props.containerId,
    containerType: ViewContainerType.OVERWATCH_SPACE_TILE,
  }))
  const visibleTimeStart = useSelector(state => selectViewSettingsBodyField(state, { viewId, fieldName: 'visibleTimeStart' }))
  const visibleTimeEnd = useSelector(state => selectViewSettingsBodyField(state, { viewId, fieldName: 'visibleTimeEnd' }))

  const fetchArchived = filterKey === 'status' && filterValue === TaskStatusFilterType.ARCHIVED
  const queryParams = generateProjectTimelineQueryParams(visibleTimeStart, visibleTimeEnd, fetchArchived)

  const isFetchArchivedProjectTasksRequestSuccess = useSelector(state => selectRequestIsSuccess(state, {
    requestType: getRequestTypeWithParams(getProjectTasks, queryParams),
    objectId: props.containerId,
  }))

  resultsCount = useSelector(state => selectFilteredTimelineTaskIdsCountPreview(state, {
    filterId: props.filterId,
    projectId: props.containerId,
    filterPath: props.filterPath,
    viewId
  }))

  if (fetchArchived && !isFetchArchivedProjectTasksRequestSuccess) {
    resultsCount = null
  }

  return {
    resultsCount
  }
}
