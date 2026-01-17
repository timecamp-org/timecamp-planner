import { useSelector } from 'common/hooks/useSelector';
import { Id } from 'common/utils/identifier';
import { getPeriodDuration } from 'common/utils/timeIntervalDefinitions';
import OverwatchSpaceFilters from 'components/overwatch/OverwatchSpaceFilters';
import VisibleTimePeriodDropdown from 'components/overwatch/timeline/TimePeriodDropdown';
import { TaskFiltersContainerType, TaskFiltersTargetType } from 'models/component/FiltersModel/types';
import { selectViewSettingsBodyField } from 'models/domain/ViewSettingsModel/selectors/domain';
import { ViewSettingsBodyType } from 'models/domain/ViewSettingsModel/types';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { onUpdateViewSettingsBody as onUpdateViewSettingsBodyAction } from 'models/domain/ViewSettingsModel/actions';
import useElementOpen from 'common/hooks/useElementOpen';

interface TimelineFiltersInterface {
  viewId: Id;
  spaceId: Id;
}

const TimelineFilters: FC<TimelineFiltersInterface> = ({ viewId, spaceId }) => {
  const filtersHook = useElementOpen(false);

  const dispatch = useDispatch();
  const visiblePeriodDurationType = useSelector((state) =>
    selectViewSettingsBodyField(state, {
      viewId,
      fieldName: 'visiblePeriodDurationType',
    })
  );

  const visibleTimeStart = useSelector((state) =>
    selectViewSettingsBodyField(state, {
      viewId,
      fieldName: 'visibleTimeStart',
    })
  );

  const onUpdateViewSettings = (settings: Partial<ViewSettingsBodyType>) => {
    dispatch(onUpdateViewSettingsBodyAction(viewId, settings));
  };

  const onChangeVisibleTimePeriodDurationType = (durationType) => {
    const zoom = getPeriodDuration(visibleTimeStart, durationType);
    onUpdateViewSettings({
      visiblePeriodDurationType: durationType,
      visibleTimeEnd: visibleTimeStart + zoom,
    });
  };

  return (
    <>
      <VisibleTimePeriodDropdown
        selectedTimePeriodDurationType={visiblePeriodDurationType}
        onChangeVisibleTimePeriodDurationType={onChangeVisibleTimePeriodDurationType}
      />

      <OverwatchSpaceFilters
        spaceId={spaceId}
        targetType={TaskFiltersTargetType.TIMELINE}
        containerType={TaskFiltersContainerType.OVERWATCH_SPACE_TILE}
        filterId={null}
        isFiltersOpen={filtersHook.isOpen}
        onToggleFilters={filtersHook.onToggleOpen}
        onCloseFilters={filtersHook.onClose}
      />
    </>
  );
};

export default TimelineFilters;
