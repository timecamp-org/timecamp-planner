import { useCallback, useEffect } from 'react';

import getIsSameMonth from 'date-fns/is_same_month';
import getStartOfMonth from 'date-fns/start_of_month';
import { List } from 'immutable';
import { TimelineGroupBase, TimelineItemBase } from 'react-calendar-timeline';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import useElementOpen from 'common/hooks/useElementOpen';
import { UserTracker } from 'common/services';
import { format } from 'common/utils/dateOperations';
import { Id } from 'common/utils/identifier';
import { getPeriodDuration, PeriodDurationType } from 'common/utils/timeIntervalDefinitions';
import { OnTimeSelectionInterface } from 'commonComponents/Timeline';
import { ResizeEdgeType } from 'commonComponents/Timeline/types';
import { getNewTimeBounds } from 'components/overwatch/timeline/helpers';
import { onOpenModal } from 'models/component/ModalsModel/actions';
import { ModalType } from 'models/component/ModalsModel/types';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { selectScheduleTasksById } from 'models/domain/ScheduleModel/selectors';

import { useTaskDataEdit, useTimelineData } from './dataHooks';

const PERIODS_WITH_MARKERS = [PeriodDurationType.WEEK, PeriodDurationType.TWO_WEEKS, PeriodDurationType.MONTH];

export type SpaceTimelineHookInterface = {
  items: List<TimelineItemBase<number>>;
  groups: TimelineGroupBase[];
  monthAndYear: string;
  visiblePeriodDurationType: PeriodDurationType;
  visibleTimeStart: number;
  visibleTimeEnd: number;
  isFiltersOpen: boolean;
  hasLeftSidebar: boolean;
  isProjectView: boolean;
  filterId: Id;
  viewId: Id;
  isLoading: boolean;
  hasTimeMarkers: boolean;
  onResizeItem: (cardId: Id, timestamp: number, edge: ResizeEdgeType) => void;
  onMoveItem: (cardId: Id, startTimestamp: number) => void;
  onChangeBounds: (canvasTimeStart: number, canvasTimeEnd: number) => void;
  onChangeTime: (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: (startTime: number, endTime: number) => void
  ) => void;
  onChangeVisibleTimePeriodDurationType: (durationType: PeriodDurationType) => void;
  onGoBackInTime: VoidFunction;
  onGoForwardInTime: VoidFunction;
  onItemDoubleClick: (cardId: Id) => void;
  onToggleFilters: VoidFunction;
  onCloseFilters: VoidFunction;
  onTimeSelection: (props: OnTimeSelectionInterface) => void;
  onGoToMonth: (month: number) => void;
};

const TIME_STEP_FACTOR = 0.5;

export const useComponent = (): SpaceTimelineHookInterface => {
  const dispatch = useDispatch();
  const {
    items,
    groups,
    visibleTimeStart,
    visibleTimeEnd,
    visiblePeriodDurationType,
    filterId,
    viewId,
    isDataFetched,
    onUpdateViewSettings,
    onFetchTimelineViewSettings,
    onCreateViewSettings,
  } = useTimelineData();
  const { onMoveCardInTimeline, onOpenCardDetailsModal, ...dataPersister } = useTaskDataEdit();
  const filtersHook = useElementOpen(false);

  useEffect(() => {
    onFetchTimelineViewSettings();
  }, []);

  useEffect(() => {
    if (isDataFetched && !viewId) {
      onCreateViewSettings();
    }
  }, [isDataFetched, viewId, onCreateViewSettings]);

  const onMoveItem = useCallback(
    (cardId: Id, startTimestamp: number) => {
      const taskId = extractTaskId(cardId);
      const item = items.find((task) => task.taskId === taskId);

      onMoveCardInTimeline({
        cardId: taskId,
        startTimestamp,
        taskEndTime: item.end_time,
        taskStartTime: item.start_time,
        ignoreDebounce: true,
      });
      UserTracker.track(UserTrackerEvent.cardEdited, {
        what: 'start_and_due_date',
        source: '',
      });
    },
    [onMoveCardInTimeline, items]
  );

  const onResizeItem = useCallback(
    (cardId: Id, timestamp: number, edge: ResizeEdgeType) => {
      const taskId = extractTaskId(cardId);
      const item = items.find((task) => task.taskId === taskId);
      dataPersister.onResizeItem({
        cardId: taskId,
        timestamp,
        edge,
        taskEndTime: item.end_time,
        taskStartTime: item.start_time,
      });
      const what = edge === 'left' ? 'startDate' : 'dueDate';
      UserTracker.track(UserTrackerEvent.cardEdited, {
        what,
        source: 'props.taskEditSource',
      });
    },
    [dataPersister.onResizeItem, items]
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

  const onItemDoubleClick = (cardId: Id) => {
    onOpenCardDetailsModal(extractTaskId(cardId));
  };

  const onGoToMonth = useCallback(
    (month: number) => {
      const { timeStart, timeEnd } = getNewTimeBounds(visiblePeriodDurationType, getStartOfMonth(month).getTime());

      onUpdateViewSettings({
        visibleTimeStart: timeStart,
        visibleTimeEnd: timeEnd,
      });
    },
    [visiblePeriodDurationType, onUpdateViewSettings]
  );

  const isProjectView = useLocation().pathname.includes('projects');
  const hasTimeMarkers = PERIODS_WITH_MARKERS.includes(visiblePeriodDurationType);

  const onTimeSelection = ({ groupId, timeEnd, timeStart }: OnTimeSelectionInterface) => {
    const modalInitialData = {
      startDate: timeStart,
      dueDate: timeEnd,
      assignees: [groupId],
    };

    dispatch(onOpenModal(ModalType.ADD_NEW_CARD_MODAL, modalInitialData));
  };

  return {
    items,
    groups,
    monthAndYear: getMonthAndYearLabel(visibleTimeStart, visibleTimeEnd),
    visiblePeriodDurationType,
    visibleTimeStart,
    visibleTimeEnd,
    isFiltersOpen: filtersHook.isOpen,
    hasLeftSidebar: true,
    isProjectView,
    filterId,
    viewId,
    isLoading: !isDataFetched,
    hasTimeMarkers,
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
    onTimeSelection,
    onGoToMonth,
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useCanEdit = () => {
  const tasksById = useSelector(selectScheduleTasksById);

  return {
    canEdit: (id: string) => Boolean(tasksById?.[id]?.hasAccess),
  };
};
