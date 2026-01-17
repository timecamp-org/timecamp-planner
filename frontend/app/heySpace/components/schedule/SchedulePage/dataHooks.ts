/* eslint-disable no-shadow */

import { useEffect } from 'react';

import { List } from 'immutable';
import { useDispatch } from 'react-redux';

import { useSelector } from 'common/hooks/useSelector';
import { ProjectTasksMetadataType } from 'common/models/domain/ProjectsModel/types';
import { ProjectTasksQueryParams } from 'common/models/domain/RequestModel/types';
import { Id } from 'common/utils/identifier';
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions';
import { ResizeEdgeType } from 'commonComponents/Timeline/types';
import { TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { makeFilterId } from 'models/component/FiltersModel/utils';
import * as AppModelActions from 'models/domain/AppModel/actions';
import { selectCurrentOrganizationId } from 'models/domain/OrganizationsModel/selectors/domain';
import { OverwatchTileViewSettingsRecordInterface } from 'models/domain/OverwatchModel/types';
import { generateDefaultTimelineViewSettings } from 'models/domain/OverwatchModel/utils';
import * as RequestTypesConstants from 'models/domain/RequestModel/constants/requestTypes';
import { getViewSettings } from 'models/domain/RequestModel/constants/requestTypes';
import { selectIsRequestFinished } from 'models/domain/RequestModel/selectors';
import { onFetchScheduleData } from 'models/domain/ScheduleModel/actions';
import { selectScheduleTimelineData } from 'models/domain/ScheduleModel/selectors/scheduleSelectors';
import { ScheduleItem } from 'models/domain/ScheduleModel/types';
import { onMoveTaskTimespan, onResizeTaskTimePeriod } from 'models/domain/TasksModel/actions';
import { selectCurrentUser } from 'models/domain/UsersModel/selectors/domain';
import {
  onCreateBaseViewSettings,
  onFetchViewSettings,
  onUpdateViewSettingsBody,
} from 'models/domain/ViewSettingsModel/actions';
import {
  selectViewSettingsBody,
  selectViewSettingsIdByTypeAndContainerId,
} from 'models/domain/ViewSettingsModel/selectors/domain';
import { ViewContainerType, ViewSettingsViewType } from 'models/domain/ViewSettingsModel/types';

import { useCanEdit } from './hook';

export type DataProviderHookInterface = {
  items: List<ScheduleItem>;
  groups: any;
  visibleTimeStart: number;
  visibleTimeEnd: number;
  visiblePeriodDurationType: PeriodDurationType;
  isDataFetched: boolean;
  viewId: string;
  filterId: Id;
  onUpdateViewSettings: (settings: Partial<OverwatchTileViewSettingsRecordInterface>) => void;
  onFetchTimelineViewSettings: () => void;
  onCreateViewSettings: () => void;
};

const DEFAULT_VIEW_SETTINGS = {
  visibleTimeStart: Date.now() + 3_600 * 24 * 7,
  visibleTimeEnd: Date.now() + 3_600 * 24 * 14 * 1000,
  visiblePeriodDurationType: PeriodDurationType.TWO_WEEKS,
} as OverwatchTileViewSettingsRecordInterface;

export const useTimelineData = (): DataProviderHookInterface => {
  const dispatch = useDispatch();
  const organizationId = useSelector(selectCurrentOrganizationId);
  const { id: userId } = useSelector(selectCurrentUser) || {};
  const viewId = useSelector((state) =>
    selectViewSettingsIdByTypeAndContainerId(state, {
      viewType: ViewSettingsViewType.SCHEDULE,
      containerId: organizationId,
      containerType: ViewContainerType.ORGANIZATION,
    })
  );
  const filterId = makeFilterId(userId, TaskFiltersTargetType.SCHEDULE, organizationId);
  const viewSettings =
    useSelector((state) => selectViewSettingsBody(state, { viewId }))?.toJS() || DEFAULT_VIEW_SETTINGS;

  useEffect(() => {
    dispatch(onFetchScheduleData(organizationId));
  }, [dispatch, organizationId]);

  const { items, groups } = useSelector((state) => selectScheduleTimelineData(state, { viewSettings, filterId }));
  const isDataFetched = useSelector(
    (state) =>
      selectIsRequestFinished(state, {
        requestType: getViewSettings,
        objectId: [ViewSettingsViewType.SCHEDULE, organizationId],
      }) &&
      selectIsRequestFinished(state, {
        requestType: RequestTypesConstants.getScheduleData,
        objectId: organizationId,
      })
  );

  const onUpdateViewSettings = (settings: Partial<OverwatchTileViewSettingsRecordInterface>) => {
    dispatch(onUpdateViewSettingsBody(viewId, settings));
  };

  const onFetchTimelineViewSettings = () => {
    dispatch(onFetchViewSettings(ViewSettingsViewType.SCHEDULE, ViewContainerType.ORGANIZATION, organizationId));
  };

  const onCreateViewSettings = () => {
    dispatch(
      onCreateBaseViewSettings(
        ViewSettingsViewType.SCHEDULE,
        ViewContainerType.ORGANIZATION,
        organizationId,
        generateDefaultTimelineViewSettings()
      )
    );
  };

  return {
    items: List(items),
    groups,
    viewId,
    isDataFetched,
    filterId,
    ...viewSettings,
    onUpdateViewSettings,
    onFetchTimelineViewSettings,
    onCreateViewSettings,
  };
};

type OnMoveCardInTimeline = (param: {
  cardId: Id;
  startTimestamp: number;
  ignoreDebounce?: boolean;
  taskStartTime: number;
  taskEndTime: number;
}) => void;

type OnResizeItem = (param: {
  cardId: Id;
  timestamp: number;
  edge: ResizeEdgeType;
  taskStartTime: number;
  taskEndTime: number;
}) => void;

export type DataPersisterHookInterface = {
  onMoveCardInTimeline: OnMoveCardInTimeline;
  onResizeItem: OnResizeItem;
  onOpenCardDetailsModal: (cardId: Id) => void;
};

export const useTaskDataEdit = (): DataPersisterHookInterface => {
  const dispatch = useDispatch();
  const { canEdit } = useCanEdit();

  const onResizeItem: OnResizeItem = ({ cardId, timestamp, edge, taskEndTime, taskStartTime }) => {
    if (canEdit(cardId)) {
      dispatch(onResizeTaskTimePeriod(cardId, timestamp, edge, taskStartTime, taskEndTime));
    }
  };

  const onMoveCardInTimeline: OnMoveCardInTimeline = ({
    cardId,
    startTimestamp,
    ignoreDebounce = false,
    taskEndTime,
    taskStartTime,
  }) => {
    if (canEdit(cardId)) {
      dispatch(onMoveTaskTimespan(cardId, startTimestamp, ignoreDebounce, taskStartTime, taskEndTime));
    }
  };

  const onOpenCardDetailsModal = (cardId: Id) => {
    if (canEdit(cardId)) {
      dispatch(AppModelActions.onSetOpenedCardDetailsModalId(cardId));
    }
  };

  return {
    onResizeItem,
    onMoveCardInTimeline,
    onOpenCardDetailsModal,
  };
};

const projectTimelineMetadata = [
  ProjectTasksMetadataType.PEOPLE,
  ProjectTasksMetadataType.TAGS,
  ProjectTasksMetadataType.CHECKLIST,
];

export function generateProjectTimelineQueryParams(
  visibleTimeStart: number,
  visibleTimeEnd: number,
  fetchArchived: boolean = false
): ProjectTasksQueryParams {
  return {
    fetchArchived,
    before: visibleTimeEnd,
    since: visibleTimeStart,
    metadata: projectTimelineMetadata,
  };
}
