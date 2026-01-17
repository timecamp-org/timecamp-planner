import React from 'react';

import { TaskFiltersContainerType, TaskFiltersTargetType } from 'common/models/component/FiltersModel/types';
import { Id } from 'common/utils/identifier';
import { DayMarker } from 'commonComponents/Timeline/items/DayMarker/DayMarker';
import { ItemRenderer } from 'commonComponents/Timeline/types';
import { TaskEditSource, TaskTimelineItem } from 'models/domain/TasksModel/types';

import TimelineCard from '../TimelineCard';

import { useComponent } from './hook';
import { SpaceTimelineView } from './SpaceTimelineView';

const MAX_WIDTH_WITH_PADDING = 50;

const renderCardItem: ItemRenderer<TaskTimelineItem> = ({
  isResizeHandleVisible,
  isSelected,
  item,
  width,
  scrollRef,
  wrapperRef,
}) => {
  const isCardMinimized = width < MAX_WIDTH_WITH_PADDING;
  const { taskId } = item;

  return taskId ? (
    <TimelineCard
      cardId={taskId}
      isSelected={isSelected}
      isResizeHandleVisible={isResizeHandleVisible}
      isCardMinimized={isCardMinimized}
    />
  ) : (
    <DayMarker item={item} scrollRef={scrollRef} wrapperRef={wrapperRef} />
  );
};

export type SpaceTimelineInterface = {
  spaceId: Id;
  filterId?: Id;
  viewId: Id;
  className?: string;
  containerClassName?: string;
  taskEditSource: TaskEditSource;
  containerType: TaskFiltersContainerType;
  targetType?: TaskFiltersTargetType;
  shouldMergeFiltersWithParent?: boolean;
};

const SpaceTimeline: React.FC<SpaceTimelineInterface> = (props) => {
  const hook = useComponent(props);

  const areTimeLineFiltersVisible = [
    TaskFiltersContainerType.OVERWATCH_SPACE_TILE,
    TaskFiltersContainerType.MY_TASKS,
  ].includes(props.containerType);

  return (
    <SpaceTimelineView
      {...hook}
      {...props}
      areTimeLineFiltersVisible={areTimeLineFiltersVisible}
      itemRenderer={renderCardItem}
    />
  );
};

export default SpaceTimeline;
