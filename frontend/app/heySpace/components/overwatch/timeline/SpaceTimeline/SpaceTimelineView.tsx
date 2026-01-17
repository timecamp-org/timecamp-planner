/* eslint-disable @typescript-eslint/naming-convention */

import { FC } from 'react';

import moment from 'moment';

import { Id } from 'common/utils/identifier';
import MonthCalendarPopup from 'commonComponents/MonthCalendarPicker/MonthCalendarPickerPopup';
import Timeline, { TimelineInterface } from 'commonComponents/Timeline';
import { ButtonPopover } from 'components/buttons/ButtonPopover';
import GoToTodayButton from 'components/overwatch/GoToTodayButton';
import OverwatchSpaceFilters, { OverwatchSpaceFiltersInterface } from 'components/overwatch/OverwatchSpaceFilters';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';

import { TimelineViewSwitch } from '../TimelineTeamProjectSwitch';
import TimePeriodDropdown from '../TimePeriodDropdown';

import { SpaceTimelineHookInterface } from './hook';
import styles from './styles.css';

import { SpaceTimelineInterface } from '.';

const MONTH_PICKER_MODIFIERS = {
  offset: {
    offset: `0, 8px`,
  },
};

type SpaceTimelineViewInterface = {
  spaceId?: Id;
  containerType?: TaskFiltersContainerType;
  targetType?: TaskFiltersTargetType;
  areTimeLineFiltersVisible?: boolean;
  isProjectView?: boolean;
  hasTimeMarkers?: boolean;
  itemHeightRatio?: number;
  lineHeight?: number;
  className?: string;
  monthAndYear?: string;
  isToolbarDisabled?: boolean;
} & TimelineInterface &
  Omit<SpaceTimelineInterface, ' containerType' | 'targetType' | 'spaceId'> &
  SpaceTimelineHookInterface &
  Partial<OverwatchSpaceFiltersInterface>;

export const SpaceTimelineView: FC<SpaceTimelineViewInterface> = ({
  isProjectView,
  groups,
  hasLeftSidebar,
  isFiltersOpen,
  items,
  className,
  monthAndYear,
  spaceId,
  containerType,
  targetType,
  viewId,
  containerClassName,
  filterId,
  areTimeLineFiltersVisible,
  onChangeBounds,
  onChangeTime,
  onChangeVisibleTimePeriodDurationType,
  onCloseFilters,
  onGoBackInTime,
  onGoForwardInTime,
  onItemDoubleClick,
  onMoveItem,
  onResizeItem,
  onToggleFilters,
  itemRenderer,
  onTimeSelection,
  onGoToMonth,
  visiblePeriodDurationType,
  visibleTimeEnd,
  visibleTimeStart,
  hasTimeMarkers,
  itemHeightRatio,
  lineHeight,
}) => (
  <div className={className || styles.spaceTimeline}>
    <div className={styles.timelineHeader}>
      {isProjectView && (
        <div className={styles.itemWithBadge}>
          <TimelineViewSwitch />
        </div>
      )}
      <span className={styles.monthAndYear}>
        <ButtonPopover
          popperModifiers={MONTH_PICKER_MODIFIERS}
          popperComponent={
            <MonthCalendarPopup
              value={moment(visibleTimeStart)}
              onChange={(month) => onGoToMonth(month.toDate().getTime())}
            />
          }
          targetContent={monthAndYear}
        />
      </span>
      <div className={styles.controls}>
        <GoToTodayButton viewId={viewId} className={styles.goToTodayButton} />

        <TimePeriodDropdown
          selectedTimePeriodDurationType={visiblePeriodDurationType}
          onChangeVisibleTimePeriodDurationType={onChangeVisibleTimePeriodDurationType}
        />
        {areTimeLineFiltersVisible && (
          <OverwatchSpaceFilters
            spaceId={spaceId}
            targetType={TaskFiltersTargetType.TIMELINE}
            containerType={containerType}
            filterId={filterId}
            isFiltersOpen={isFiltersOpen}
            onToggleFilters={onToggleFilters}
            onCloseFilters={onCloseFilters}
          />
        )}
      </div>
    </div>
    <div className={`${styles.timelineContainer} ${!hasLeftSidebar && styles.leftOffset} ${containerClassName}`}>
      <Timeline
        groups={groups}
        items={items}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        leftClassName={styles.resizeHandler}
        rightClassName={styles.resizeHandler}
        onMoveItem={onMoveItem}
        onResizeItem={onResizeItem}
        onChangeBounds={onChangeBounds}
        onChangeTime={onChangeTime}
        onItemDoubleClick={onItemDoubleClick}
        itemRenderer={itemRenderer}
        onGoBackInTime={onGoBackInTime}
        onGoForwardInTime={onGoForwardInTime}
        hasLeftSidebar={hasLeftSidebar}
        hasTimeMarkers={hasTimeMarkers}
        itemHeightRatio={itemHeightRatio}
        lineHeight={lineHeight}
        onTimeSelection={onTimeSelection}
      />
    </div>
  </div>
);
