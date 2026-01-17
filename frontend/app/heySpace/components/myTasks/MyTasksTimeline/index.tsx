import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import SpaceTimeline from 'components/overwatch/timeline/SpaceTimeline';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { TaskEditSource } from 'models/domain/TasksModel/types';

import useComponent from './hook';
import styles from './styles.css';

const MyTasksTimeline = () => {
  const { projectId, viewId, isLoading, filterId } = useComponent();

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <SpaceTimeline
      spaceId={projectId}
      viewId={viewId}
      filterId={filterId}
      className={styles.timeline}
      containerClassName={styles.timelineContainer}
      taskEditSource={TaskEditSource.MY_TASKS}
      containerType={TaskFiltersContainerType.MY_TASKS}
      shouldMergeFiltersWithParent={false}
    />
  );
};

function renderSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <DefaultContentSkeletonLoader />
    </div>
  );
}

export default MyTasksTimeline;
