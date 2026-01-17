import { ViewFiltersType } from '../ViewSettingsModel/types';
import { TypedRecord } from 'typed-immutable-record';
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions';

export interface OverwatchViewSettingsInterface {
  filters: ViewFiltersType
}

export interface OverwatchViewSettingsRecordInterface extends TypedRecord<OverwatchViewSettingsRecordInterface>, OverwatchViewSettingsInterface { }

export interface OverwatchTileViewSettingsInterface {
  visibleTimeStart: number,
  visibleTimeEnd: number,
  visiblePeriodDurationType: PeriodDurationType,
  filters: ViewFiltersType
}

export interface OverwatchTileViewSettingsRecordInterface extends TypedRecord<OverwatchTileViewSettingsRecordInterface>, OverwatchTileViewSettingsInterface { }