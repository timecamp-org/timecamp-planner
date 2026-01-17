import { AnyDict, Maybe } from 'common/types';
import { fromJS } from 'immutable';
import { Filter } from 'models/component/FiltersModel/models';
import { FilterRecordInterface } from 'models/component/FiltersModel/types';
import {
  ViewSettingsBodyType,
  ViewSettingsInterface,
  ViewSettingsRecordInterface,
  ViewSettingsViewType,
  ViewSettingsWithSettingsBody,
} from 'models/domain/ViewSettingsModel/types';
import { OverwatchTileViewSettingsBody, OverwatchViewSettingsBody } from '../OverwatchModel/models';
import { ViewSettings } from './models';

export const parseViewSettingsImmutableRecordsToAPIFormat = (
  viewSettings: ViewSettingsRecordInterface,
  viewSettingsBody: ViewSettingsBodyType
) => {
  return {
    ...viewSettings.toJS(),
    settings: viewSettingsBody.toJS(),
  };
};

export const getViewSettingsRecordByViewType = (
  viewType: ViewSettingsViewType
): ((payload: AnyDict) => ViewSettingsBodyType) => {
  switch (viewType) {
    case ViewSettingsViewType.OVERWATCH: {
      return OverwatchViewSettingsBody;
    }

    case ViewSettingsViewType.MY_TASKS:
    case ViewSettingsViewType.BOARD:
    case ViewSettingsViewType.CHAT:
    case ViewSettingsViewType.SCHEDULE:
    case ViewSettingsViewType.TIMELINE: {
      return OverwatchTileViewSettingsBody;
    }

    default: {
      throw Error(`Unimplemented view settings body for view type: ${viewType}`);
    }
  }
};

export const parseViewSettingsFromAPI = (
  viewSettingsFromAPI: AnyDict
): ViewSettingsWithSettingsBody<ViewSettingsBodyType> => {
  const { settings: viewSettingsBody, ...restViewSettings } = viewSettingsFromAPI;
  const ViewSettingsBodyRecord = getViewSettingsRecordByViewType(restViewSettings.viewType);
  const immutableViewSettings = ViewSettings(restViewSettings as ViewSettingsInterface);
  const immutableViewSettingsBody = ViewSettingsBodyRecord(fromJS(viewSettingsBody));

  return {
    viewSettings: immutableViewSettings,
    viewSettingsBody: immutableViewSettingsBody,
  };
};

export const extractFiltersFromViewSettingsBody = (
  viewSettingsBody: ViewSettingsBodyType
): Maybe<FilterRecordInterface> => {
  // TODO: Rethink ViewSettingsBody types
  // @ts-ignore
  if (viewSettingsBody.filters && !viewSettingsBody?.filters.isEmpty()) {
    // @ts-ignore
    return Filter(viewSettingsBody.filters as FilterRecordInterface);
  }
  return null;
};
