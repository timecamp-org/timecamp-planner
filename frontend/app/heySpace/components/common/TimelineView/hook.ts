import { useCallback, useEffect, useMemo } from 'react';

import getIsSameMonth from 'date-fns/is_same_month';
import { List } from 'immutable';
import { TimelineGroupBase, TimelineItemBase } from 'react-calendar-timeline';
import { useLocation, useParams } from 'react-router';

import useElementOpen from 'common/hooks/useElementOpen';
import usePrevious from 'common/hooks/usePrevious';
import useRefreshData from 'common/hooks/useRefreshData';
import { UserTracker } from 'common/services';
import { format } from 'common/utils/dateOperations';
import { Id } from 'common/utils/identifier';
import { getPeriodDuration, PeriodDurationType } from 'common/utils/timeIntervalDefinitions';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import * as RequestModelActions from 'models/domain/RequestModel/actions';

import { generateProjectTimelineQueryParams, useDataPersister, useDataProvider } from './dataHooks';

import { ResizeEdgeType } from 'commonComponents/Timeline/types';
import { SpaceTimelineInterface } from 'components/overwatch/timeline/SpaceTimeline';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';

export interface SpaceTimelineHookInterface {
  items: List<TimelineItemBase<number>>;
  groups: TimelineGroupBase[];
  monthAndYear: string;
  visiblePeriodDurationType: PeriodDurationType;
  visibleTimeStart: number;
  visibleTimeEnd: number;
  isFiltersOpen: boolean;
  hasLeftSidebar?: boolean;
  isProjectView: boolean;
  onResizeItem?: (cardId: Id, timestamp: number, edge: ResizeEdgeType) => void;
  onMoveItem?: (cardId: Id, startTimestamp: number) => void;
  onChangeBounds?: (canvasTimeStart: number, canvasTimeEnd: number) => void;
  onChangeTime?: (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: (startTime: number, endTime: number) => void
  ) => void;
  onChangeVisibleTimePeriodDurationType?: (durationType: PeriodDurationType) => void;
  onGoBackInTime?: VoidFunction;
  onGoForwardInTime?: VoidFunction;
  onItemDoubleClick?: (cardId: Id) => void;
  onToggleFilters?: VoidFunction;
  onCloseFilters?: VoidFunction;
}

const TIME_STEP_FACTOR = 0.5;

export const useComponent = (props: SpaceTimelineInterface): SpaceTimelineHookInterface => {
  const { items, groups, visibleTimeStart, visibleTimeEnd, visiblePeriodDurationType, fetchArchived } =
    useDataProvider(props);
  const {
    onMoveCardInTimeline,
    onUpdateViewSettings,
    onOpenCardDetailsModal,
    onFetchProjectTasksData,
    ...dataPersister
  } = useDataPersister(props);
  const filtersHook = useElementOpen(false);
  const visibleTimeStartChanged = usePrevious<number>(visibleTimeStart);
  const visibleTimeEndChanged = usePrevious<number>(visibleTimeEnd);
  const { projectPanelType } = useParams<{ projectPanelType: ProjectPanelType }>();

  const refreshControllerOptions = useMemo(() => {
    const queryParams = generateProjectTimelineQueryParams(visibleTimeStart, visibleTimeEnd, fetchArchived);

    return {
      action: RequestModelActions.onFetchProjectTasksData,
      paramsToInject: [{ key: 'spaceId' }, { key: 'queryParams', defaultValue: queryParams }],
      isArgumentsValid: (args) => !!args.spaceId,
    };
  }, [visibleTimeStart, visibleTimeEnd, fetchArchived]);

  useRefreshData(props, refreshControllerOptions);

  useEffect(() => {
    onFetchProjectTasksData(visibleTimeStart, visibleTimeEnd, fetchArchived);
  }, []);

  useEffect(() => {
    if (visibleTimeStartChanged || visibleTimeEndChanged) {
      onFetchProjectTasksData(visibleTimeStart, visibleTimeEnd, fetchArchived);
    }
  }, [visibleTimeStart, visibleTimeEnd, fetchArchived, onFetchProjectTasksData]);

  const onMoveItem = useCallback(
    (cardId: Id, startTimestamp: number) => {
      onMoveCardInTimeline(extractTaskId(cardId), startTimestamp, true);
      UserTracker.track(UserTrackerEvent.cardEdited, {
        what: 'start_and_due_date',
        source: props.taskEditSource,
      });
    },
    [onMoveCardInTimeline]
  );

  const onResizeItem = useCallback(
    (cardId: Id, timestamp: number, edge: ResizeEdgeType) => {
      dataPersister.onResizeItem(extractTaskId(cardId), timestamp, edge);
      const what = edge === 'left' ? 'startDate' : 'dueDate';
      UserTracker.track(UserTrackerEvent.cardEdited, {
        what,
        source: props.taskEditSource,
      });
    },
    [dataPersister.onResizeItem]
  );

  const onChangeBounds = useCallback((canvasTimeStart: number, canvasTimeEnd: number) => {}, []);

  const onChangeTime = (
    timeStart: number,
    timeEnd: number,
    updateScrollCanvas: (startTime: number, endTime: number) => void
  ) => {
    // block scroll & zoom
  };

  const onChangeVisibleTimePeriodDurationType = useCallback(
    (durationType) => {
      const zoom = getPeriodDuration(visibleTimeStart, durationType);
      onUpdateViewSettings({
        visiblePeriodDurationType: durationType,
        visibleTimeEnd: visibleTimeStart + zoom,
      });
    },
    [visibleTimeStart, onUpdateViewSettings]
  );

  const onGoBackInTime = useCallback(() => {
    const visiblePeriodDuration = getPeriodDuration(visibleTimeStart, visiblePeriodDurationType);
    onUpdateViewSettings({
      visibleTimeStart: visibleTimeStart - visiblePeriodDuration * TIME_STEP_FACTOR,
      visibleTimeEnd: visibleTimeEnd - visiblePeriodDuration * TIME_STEP_FACTOR,
    });
  }, [visiblePeriodDurationType, visibleTimeStart, visibleTimeEnd, onUpdateViewSettings]);

  const onGoForwardInTime = useCallback(() => {
    const visiblePeriodDuration = getPeriodDuration(visibleTimeStart, visiblePeriodDurationType);
    onUpdateViewSettings({
      visibleTimeStart: visibleTimeStart + visiblePeriodDuration * TIME_STEP_FACTOR,
      visibleTimeEnd: visibleTimeEnd + visiblePeriodDuration * TIME_STEP_FACTOR,
    });
  }, [visiblePeriodDurationType, visibleTimeStart, visibleTimeEnd, onUpdateViewSettings]);

  const onItemDoubleClick = useCallback((cardId: Id) => {
    onOpenCardDetailsModal(extractTaskId(cardId));
  }, []);

  const hasLeftSidebar = projectPanelType === ProjectPanelType.TIMELINE_PEOPLE;
  const isProjectView = useLocation().pathname.includes('projects');

  return {
    items,
    groups,
    monthAndYear: getMonthAndYearLabel(visibleTimeStart, visibleTimeEnd),
    visiblePeriodDurationType,
    visibleTimeStart,
    visibleTimeEnd,
    isFiltersOpen: filtersHook.isOpen,
    hasLeftSidebar,
    isProjectView,
    onResizeItem,
    onMoveItem,
    onChangeBounds,
    onChangeTime,
    onChangeVisibleTimePeriodDurationType,
    onGoBackInTime,
    onGoForwardInTime,
    onItemDoubleClick,
    onToggleFilters: filtersHook.onToggleOpen,
    onCloseFilters: filtersHook.onClose,
  };
};

function getMonthAndYearLabel(visibleTimeStart: number, visibleTimeEnd: number): string {
  const isSameMonth = getIsSameMonth(visibleTimeStart, visibleTimeEnd);
  if (isSameMonth) {
    return format(visibleTimeStart, 'MMM YYYY');
  } else {
    return `${format(visibleTimeStart, 'MMM YYYY')} - ${format(visibleTimeEnd, 'MMM YYYY')}`;
  }
}

function extractTaskId(cardId: string) {
  return cardId.slice(0, cardId.indexOf('/'));
}
