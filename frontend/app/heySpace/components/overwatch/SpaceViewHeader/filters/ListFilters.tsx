import useElementOpen from 'common/hooks/useElementOpen';
import { Id } from 'common/utils/identifier';
import OverwatchSpaceFilters from 'components/overwatch/OverwatchSpaceFilters';
import { OverwatchFilterContext } from 'components/overwatch/tiles/OverwatchViewTile';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { FC, useContext } from 'react';

interface ListFiltersInterface {
  spaceId: Id;
}

const ListFilters: FC<ListFiltersInterface> = ({ spaceId }) => {
  const { isOpen: isFiltersOpen, onToggleOpen: onToggleFilters, onClose: onCloseFilters } = useElementOpen();

  const { filterId } = useContext(OverwatchFilterContext);
  return (
    <OverwatchSpaceFilters
      spaceId={spaceId}
      containerType={TaskFiltersContainerType.MY_TASKS}
      targetType={TaskFiltersTargetType.TASK_LIST}
      isFiltersOpen={isFiltersOpen}
      onToggleFilters={onToggleFilters}
      onCloseFilters={onCloseFilters}
      filterId={filterId}
    />
  );
};

export default ListFilters;
