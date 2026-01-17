import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { TaskEditSource } from 'models/domain/TasksModel/types';

import NoAccessContent from '../NoAccessContent';
import { BaseTileProps } from '../types';

import SpaceTimeline from 'commonComponents/TimelineView/TimelineView';
import { useComponent } from './hook';
import styles from './styles.css';

const SpaceTimelineTile = (props: BaseTileProps) => {
  const hook = useComponent(props);

  if (!hook.hasAccessToView) {
    return <NoAccessContent viewId={props.viewId} />;
  }
  return (
    <>
      {hook.isLoading && renderSkeleton()}

      <SpaceTimeline
        spaceId={props.spaceId}
        viewId={props.viewId}
        taskEditSource={TaskEditSource.OVERWATCH}
        containerType={TaskFiltersContainerType.OVERWATCH_SPACE_TILE}
        shouldMergeFiltersWithParent={true}
        areTimeLineFiltersVisible={false}
        areViewSelectOptionsVisible={false}
      />
    </>
  );
};

function renderSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <DefaultContentSkeletonLoader />
    </div>
  );
}

export default SpaceTimelineTile;
