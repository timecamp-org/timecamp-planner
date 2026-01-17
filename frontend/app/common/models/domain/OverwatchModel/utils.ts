import {
  ViewContainerType, 
  ViewSettingsViewType, 
  ViewSettingsWithSettingsBody, 
} from 'models/domain/ViewSettingsModel/types'
import { Id } from 'common/utils/identifier'
import { timestampNow } from 'common/utils/epoch'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import addWeeks from 'date-fns/add_weeks'
import getTime from 'date-fns/get_time'
import { defaultFilters, OverwatchTileViewSettingsBody } from './models'
import generateId from 'common/utils/generate-pushid'
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions'
import { OverwatchTileViewSettingsRecordInterface } from './types'
import { ViewSettings } from '../ViewSettingsModel/models'

export const generateDefaultOverwatchTileViewSettings = (spaceId: Id): ViewSettingsWithSettingsBody<OverwatchTileViewSettingsRecordInterface> => {
  return {
    viewSettings: ViewSettings({
      id: generateId(),
      viewType: ViewSettingsViewType.BOARD,
      containerId: spaceId,
      containerType: ViewContainerType.OVERWATCH_SPACE_TILE,
    }),
    viewSettingsBody: generateDefaultTimelineViewSettings()
  }
}

export const generateDefaultTimelineViewSettings = (): OverwatchTileViewSettingsRecordInterface => {
  const timeNow = timestampNow()
  const visibleTimeStart = getTime(startOfWeek(timeNow))
  const visibleTimeEnd = getTime(endOfWeek(addWeeks(timeNow, 1)))

  return OverwatchTileViewSettingsBody({
    visibleTimeStart,
    visibleTimeEnd,
    visiblePeriodDurationType: PeriodDurationType.TWO_WEEKS,
    filters: defaultFilters,
  })
}