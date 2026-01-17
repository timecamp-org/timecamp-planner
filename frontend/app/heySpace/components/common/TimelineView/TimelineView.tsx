import React from 'react';

import { TaskFiltersContainerType, TaskFiltersTargetType } from 'common/models/component/FiltersModel/types';
import { Id } from 'common/utils/identifier';
import { ItemRenderer } from 'commonComponents/Timeline/types';
import TimelineCard from 'components/overwatch/timeline/TimelineCard';
import { TaskEditSource } from 'models/domain/TasksModel/types';

import { useComponent } from './hook';
import { SpaceTimelineView } from './SpaceTimelineView';

const MAX_WIDTH_WITH_PADDING = 50;

const renderCardItem: ItemRenderer<{ taskId: Id }> = ({ isResizeHandleVisible, isSelected, item, width }) => {
  const isCardMinimized = width < MAX_WIDTH_WITH_PADDING;
  const { taskId } = item;

  return (
    <TimelineCard
      cardId={taskId}
      isSelected={isSelected}
      isResizeHandleVisible={isResizeHandleVisible}
      isCardMinimized={isCardMinimized}
    />
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
  areTimeLineFiltersVisible?: boolean;
  areViewSelectOptionsVisible?: boolean;
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
      areTimeLineFiltersVisible={areTimeLineFiltersVisible}
      {...props}
      itemRenderer={renderCardItem}
    />
  );
};

export default SpaceTimeline;
