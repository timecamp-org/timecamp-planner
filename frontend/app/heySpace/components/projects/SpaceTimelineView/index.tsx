import { FC } from 'react';

import { useParams } from 'react-router';

import { Id } from 'common/utils/identifier';
import { makeProjectChatLink } from 'common/utils/routerHelpers';
import NoAccessToFeatureModal from 'commonComponents/NoAccessToFeatureModal';
import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import SpaceTimeline from 'components/overwatch/timeline/SpaceTimeline';
import { useTranslation } from 'i18n';
import { TaskFiltersContainerType } from 'models/component/FiltersModel/types';
import { ProjectPanelType } from 'models/domain/ProjectsSettingsModel/types';
import { TaskEditSource } from 'models/domain/TasksModel/types';
import { onSetProjectLastOpenedPanel, onSetProjectLastOpenedSubPanel } from 'utils/lastOpenedPanelController';

import useComponent from './hook';
import styles from './styles.css';

export type SpaceTimelineViewInterface = {
  spaceId: Id;
  isConversation: boolean;
};

const SpaceTimelineView: FC<SpaceTimelineViewInterface> = (props) => {
  const hook = useComponent(props);
  const { t } = useTranslation();
  const { projectPanelType } = useParams<{ projectPanelType: ProjectPanelType }>();
  onSetProjectLastOpenedPanel(props.spaceId, projectPanelType);
  onSetProjectLastOpenedSubPanel(props.spaceId, {
    [ProjectPanelType.TIMELINE]: projectPanelType,
  });

  if (hook.isLoading) {
    return renderSkeleton();
  }

  return (
    <div className={styles.component}>
      {hook.isTimelineEnabled || (
        <NoAccessToFeatureModal
          fallbackUrl={makeProjectChatLink({ projectId: props.spaceId })}
          title={t('Timeline is not available in your current plan.')}
          featureName={t('Timeline')}
        />
      )}
      <div className={styles.content}>
        <SpaceTimeline
          spaceId={props.spaceId}
          viewId={hook.viewId}
          className={styles.timeline}
          containerClassName={styles.timelineContainer}
          taskEditSource={TaskEditSource.SPACE_TIMELINE}
          containerType={
            props.isConversation ? TaskFiltersContainerType.CONVERSATION : TaskFiltersContainerType.PROJECT
          }
          shouldMergeFiltersWithParent={false}
        />
      </div>
    </div>
  );
};

function renderSkeleton() {
  return (
    <div className={styles.skeletonWrapper}>
      <DefaultContentSkeletonLoader />
    </div>
  );
}

export default SpaceTimelineView;
