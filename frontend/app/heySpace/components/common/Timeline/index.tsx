/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import endOfWeek from 'date-fns/end_of_week';
import getTime from 'date-fns/get_time';
import startOfWeek from 'date-fns/start_of_week';
import { List } from 'immutable';
import { isEmpty } from 'lodash';
import ReactCalendarTimeline, {
  CustomHeader,
  CustomMarkerChildrenProps,
  TimelineGroupBase,
  TimelineHeaders,
  TimelineItemBase,
  TimelineMarkers,
  TodayMarker,
} from 'react-calendar-timeline';

import { doNothing } from 'common/utils';
import { Id } from 'common/utils/identifier';
import { hour, week } from 'common/utils/timeIntervalDefinitions';
import { ChevronLeft } from 'commonComponents/Icons/fontawesome/ChevronLeft';
import { ChevronRight } from 'commonComponents/Icons/fontawesome/ChevronRight';

import TimelineHeader from '../../overwatch/timeline/TimelineHeader';

import { GroupItem } from './items/GroupItem';
import { TimelineItem } from './items/TimelineItem';
import cssStyles from './styles.css';
import { ItemRenderer, ResizeEdgeType } from './types';
import { getVerticalLineClassNamesForTime } from './utils';

import 'react-calendar-timeline/lib/Timeline.css';
import { GROUP_ROW_ID_PREFIX_CLASS_NAME, groupRowClassName } from './extensions/constants';

import { getConditionalClass } from 'utils/getConditionalClass';

import { timeSelectionExtension } from './extensions/timeSelectionExtension';

export const SIDEBAR_WIDTH = 190;

export interface OnTimeSelectionInterface {
  groupId: string;
  timeStart: number;
  timeEnd: number;
}

export interface TimelineInterface {
  groups: TimelineGroupBase[];
  items: List<TimelineItemBase<number>>;
  visibleTimeStart?: number;
  visibleTimeEnd?: number;
  minZoom?: number;
  maxZoom?: number;
  dragSnap?: number;
  leftClassName?: string;
  rightClassName?: string;
  hasLeftSidebar?: boolean;
  lineHeight?: number;
  itemHeightRatio?: number;
  hasTimeMarkers?: boolean;
  hasCreateNewItemField?: boolean;
  itemRenderer: ItemRenderer;
  onResizeItem?: (itemId: Id, timestamp: number, edge: ResizeEdgeType) => void;
  onMoveItem?: (itemId: Id, startTimestamp: number, newGroupOrder?: number) => void;
  onChangeBounds?: (canvasTimeStart: number, canvasTimeEnd: number) => void;
  onChangeTime?: (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: (startTime: number, endTime: number) => void
  ) => void;
  onItemDoubleClick?: (itemId: Id, event: React.SyntheticEvent<Element, Event>, time: number) => void;
  onGoBackInTime?: VoidFunction;
  onGoForwardInTime?: VoidFunction;
  onTimeSelection?: (props: OnTimeSelectionInterface) => void;
}

const defaultProps = {
  visibleTimeStart: getTime(startOfWeek(Date.now())),
  visibleTimeEnd: getTime(endOfWeek(Date.now())),
  minZoom: week,
  maxZoom: 2 * week,
  dragSnap: hour,
  onChangeBounds: doNothing,
  onResizeItem: doNothing,
  onMoveItem: doNothing,
  onChangeTime: doNothing,
  onItemDoubleClick: doNothing,
  onGoBackInTime: doNothing,
  onGoForwardInTime: doNothing,
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/naming-convention
const Timeline = (props: TimelineInterface) => {
  const [scrollRef, setScrollRef] = useState<HTMLElement>();

  if (props.onTimeSelection) {
    timeSelectionExtension({
      onSelectionEnd: props.onTimeSelection,
      visibleStartDate: props.visibleTimeStart,
      visibleEndDate: props.visibleTimeEnd,
    });
  }

  const renderItem = useCallback(
    (renderProps) => (
      <TimelineItem
        {...renderProps}
        scrollRef={scrollRef}
        itemRenderer={props.itemRenderer}
        hasTimeMarkers={props.hasTimeMarkers}
        leftClassName={props.leftClassName}
        rightClassName={props.rightClassName}
        hasGroups={!isEmpty(props.groups)}
      />
    ),
    [props.itemRenderer, props.hasTimeMarkers, props.rightClassName, props.leftClassName, scrollRef, props.groups]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>();
  // eslint-disable-next-line consistent-return
  useLayoutEffect(() => {
    if (ref.current.scrollHeaderRef) {
      const resizeObserver = new ResizeObserver(() => {
        ref.current.resize();
      });

      resizeObserver.observe(ref.current.scrollHeaderRef as HTMLElement);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [ref]);

  return (
    <ReactCalendarTimeline
      items={props.items.toJS()}
      groups={props.groups}
      groupRenderer={GroupItem}
      visibleTimeStart={props.visibleTimeStart}
      visibleTimeEnd={props.visibleTimeEnd}
      minZoom={props.minZoom}
      maxZoom={props.maxZoom}
      dragSnap={props.dragSnap}
      lineHeight={props.lineHeight || 64}
      itemHeightRatio={props.itemHeightRatio || 0.75}
      sidebarWidth={props.hasLeftSidebar ? SIDEBAR_WIDTH : 0}
      horizontalLineClassNamesForGroup={({ id }) => [
        '',
        cssStyles.groupBorder,
        getConditionalClass(
          `${groupRowClassName} ${GROUP_ROW_ID_PREFIX_CLASS_NAME}${id} ${cssStyles.groupCursor}`,
          !!props.onTimeSelection
        ),
      ]}
      verticalLineClassNamesForTime={getVerticalLineClassNamesForTime}
      stackItems
      useResizeHandle
      canResize={'both'}
      itemRenderer={renderItem}
      // @ts-ignore | remove ts-ignore after react-calendar-timeline fork is merged and @types are updated
      minCellWidth={25}
      onItemResize={props.onResizeItem}
      onItemMove={props.onMoveItem}
      onBoundsChange={props.onChangeBounds}
      onTimeChange={props.onChangeTime}
      onItemDoubleClick={props.onItemDoubleClick}
      ref={ref}
      scrollRef={setScrollRef}
    >
      {renderMarkers()}
      {renderHeaders(props)}
    </ReactCalendarTimeline>
  );
};

function renderMarkers() {
  return (
    <TimelineMarkers>
      <TodayMarker interval={hour} date={null}>
        {({ styles, date }: CustomMarkerChildrenProps) => (
          <div
            // @ts-ignore TODO: fix import correct @types/react
            style={styles}
            className={cssStyles.todayMarker}
            id={'today-marker'}
          ></div>
        )}
      </TodayMarker>
    </TimelineMarkers>
  );
}

const getLeftArrowStyles = (hasOffset: boolean) => (hasOffset ? { left: `${SIDEBAR_WIDTH}px` } : null);

// eslint-disable-next-line @typescript-eslint/naming-convention
function renderHeaders<Items extends TimelineItemBase<number>>(props: TimelineInterface) {
  return (
    <TimelineHeaders className={cssStyles.headersWrapper} calendarHeaderClassName={cssStyles.headerInnerWrapper}>
      <div
        className={cssStyles.prevButton}
        onClick={props.onGoBackInTime}
        style={getLeftArrowStyles(props.hasLeftSidebar)}
      >
        <ChevronLeft className={cssStyles.arrowIcon} />
      </div>
      <CustomHeader height={50}>
        {({ headerContext: { intervals, unit }, getRootProps, getIntervalProps }) => (
          // @ts-ignore TODO: fix import correct @types/react
          <div {...getRootProps()}>
            {intervals.map((interval) => (
              <TimelineHeader
                key={`TimelineHeader-${interval.startTime.toString()}-${interval.endTime.toString()}`}
                timelineBaseUnit={unit}
                interval={interval}
                visibleTimeStart={props.visibleTimeStart}
                visibleTimeEnd={props.visibleTimeEnd}
                reactCalendarTimelineInternalProps={getIntervalProps({
                  interval,
                })}
              />
            ))}
          </div>
        )}
      </CustomHeader>
      <div className={cssStyles.nextButton} onClick={props.onGoForwardInTime}>
        <ChevronRight className={cssStyles.arrowIcon} />
      </div>
    </TimelineHeaders>
  );
}

Timeline.defaultProps = defaultProps;

export default Timeline;
