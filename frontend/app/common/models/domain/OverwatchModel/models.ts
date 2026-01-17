import { Map } from 'immutable'
import { AnyMap } from 'common/types'
import {
  OverwatchViewSettingsInterface,
  OverwatchViewSettingsRecordInterface,
  OverwatchTileViewSettingsInterface,
  OverwatchTileViewSettingsRecordInterface
} from './types'
import { makeTypedFactory } from 'typed-immutable-record';

export const defaultFilters = Map() as AnyMap

const defaultOverwatchViewSettings: OverwatchViewSettingsInterface = {
  filters: defaultFilters,
}

export const OverwatchViewSettingsBody = makeTypedFactory<
  OverwatchViewSettingsInterface | OverwatchViewSettingsRecordInterface,
  OverwatchViewSettingsRecordInterface
>
  (defaultOverwatchViewSettings);

const defaultTimelineViewSettings: OverwatchTileViewSettingsInterface = {
  visiblePeriodDurationType: undefined,
  visibleTimeStart: undefined,
  visibleTimeEnd: undefined,
  filters: defaultFilters,
}

export const OverwatchTileViewSettingsBody = makeTypedFactory<
  OverwatchTileViewSettingsInterface | OverwatchTileViewSettingsRecordInterface,
  OverwatchTileViewSettingsRecordInterface
>
  (defaultTimelineViewSettings);
