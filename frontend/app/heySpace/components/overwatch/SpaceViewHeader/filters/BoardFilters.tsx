import useElementOpen from 'common/hooks/useElementOpen';
import { Id } from 'common/utils/identifier';
import OverwatchSpaceFilters from 'components/overwatch/OverwatchSpaceFilters';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { FC } from 'react';

interface BoardFiltersInterface {
  spaceId: Id;
}

const BoardFilters: FC<BoardFiltersInterface> = (props) => {
  const { isOpen: isFiltersOpen, onToggleOpen: onToggleFilters, onClose: onCloseFilters } = useElementOpen();

  return (
    <OverwatchSpaceFilters
      spaceId={props.spaceId}
      containerType={TaskFiltersContainerType.OVERWATCH_SPACE_TILE}
      targetType={TaskFiltersTargetType.KANBAN}
      isFiltersOpen={isFiltersOpen}
      onToggleFilters={onToggleFilters}
      onCloseFilters={onCloseFilters}
    />
  );
};

export default BoardFilters;
