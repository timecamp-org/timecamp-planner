import { useSelector } from 'common/hooks/useSelector';
import { useUserTrackerEvent } from 'common/hooks/useUserTrackerEvent';
import NoAccessToFeatureModal from 'commonComponents/NoAccessToFeatureModal';
import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import { ItemRenderer } from 'commonComponents/Timeline/types';
import { SpaceTimelineView } from 'components/overwatch/timeline/SpaceTimeline/SpaceTimelineView';
import { useTranslation } from 'i18n';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { UserTrackerEvent } from 'models/component/UserTrackerEventModel/constants';
import { ExtensionNamespace } from 'models/domain/ExtensionsModel/types';
import { ScheduleItem } from 'models/domain/ScheduleModel/types';
import { selectHasAccessToExtension } from 'models/domain/SubscriptionLimitsModel/selectors';
import { TaskEditSource } from 'models/domain/TasksModel/types';

import { ScheduleHeader } from '../ScheduleHeader/ScheduleHeader';
import { ScheduleTaskItem } from '../ScheduleTaskItem';
import TimeCapacityMarker from '../TimeCapacityMarker/index';

import { useComponent } from './hook';
import styles from './styles.css';

const MAX_WIDTH_WITH_PADDING = 50;

const renderCardItem: ItemRenderer<ScheduleItem> = ({
  item,
  isSelected,
  isResizeHandleVisible,
  width,
  scrollRef,
  wrapperRef,
}) => {
  const isCardMinimized = width < MAX_WIDTH_WITH_PADDING;
  const { taskId } = item;

  return taskId ? (
    <ScheduleTaskItem
      item={item}
      isSelected={isSelected}
      isResizeHandleVisible={isResizeHandleVisible}
      isCardMinimized={isCardMinimized}
    />
  ) : (
    <TimeCapacityMarker item={item} />
  );
};

export const SchedulePage = () => {
  const { t } = useTranslation();
  const hook = useComponent();
  const hasAccessToSchedule = useSelector((state) =>
    selectHasAccessToExtension(state, {
      extensionNamespace: ExtensionNamespace.SCHEDULE,
    })
  );

  useUserTrackerEvent(UserTrackerEvent.featureUsed, {
    name: 'Schedule',
  });

  return (
    <div className={styles.wrapper}>
      {!hasAccessToSchedule && (
        <NoAccessToFeatureModal featureName={'Planner'} title={t('Planner is not available in your current plan.')} />
      )}
      <ScheduleHeader filterId={hook.filterId} />
      <div className={styles.content}>
        {hook.isLoading ? (
          <DefaultContentSkeletonLoader />
        ) : (
          <SpaceTimelineView
            {...hook}
            itemRenderer={renderCardItem}
            lineHeight={55}
            itemHeightRatio={0.8}
            taskEditSource={TaskEditSource.SCHEDULE}
            containerType={TaskFiltersContainerType.SCHEDULE}
          />
        )}
      </div>
    </div>
  );
};
