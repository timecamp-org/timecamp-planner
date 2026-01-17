import { FiltersRightPanelChatInterface } from '.'
import { useDataProvider, useDataPersister } from './dataHooks'
import { useCallback, useEffect } from 'react'
import { useParams, useHistory } from 'react-router'
import { AnyDict } from 'common/types'
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types'
import { TaskStatusFilterType } from 'models/domain/TasksModel/types'


export type FiltersRightPanelChatHookInterface = {
  isClearFiltersVisible: boolean,
  isCalendar: boolean,
  color: string,
  onClearFilters: VoidFunction,
}

export default function useComponent(props: FiltersRightPanelChatInterface): FiltersRightPanelChatHookInterface {
  const {
    color,
    filterBy,
    filterId,
    filtersCount,
  } = useDataProvider(props)

  const dataPersister = useDataPersister()

  const { projectPanelType } = useParams<AnyDict>()
  const history = useHistory()

  const onClearFilters = useCallback(() => {
    dataPersister.onClearFilters(filterId)
    history.push(`/projects/${props.containerId}/${projectPanelType}`)
  }, [dataPersister.onClearFilters, filterId, props.containerId, projectPanelType])

  const isCalendar = projectPanelType === ProjectPanelType.CALENDAR

  const isClearFiltersVisible = Boolean(!(filtersCount === 1 && filterBy.get('status') === TaskStatusFilterType.ALL) || filtersCount)

  return {
    color,
    isClearFiltersVisible,
    isCalendar,
    onClearFilters,
  }
}