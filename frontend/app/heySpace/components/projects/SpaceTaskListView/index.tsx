import { FC } from 'react';

import { Id } from 'common/utils/identifier';
import { makeProjectChatLink } from 'common/utils/routerHelpers';
import NoAccessToFeatureModal from 'commonComponents/NoAccessToFeatureModal';
import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import AddCardButton from 'components/tasks/AddCardButton';
import TasksTable from 'components/tasks/TasksTable';
import { ColumnsConfig, TaskTableColumn } from 'components/tasks/TasksTable/types';
import { useTranslation } from 'i18n';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

import useComponent from './hook';
import styles from './styles.css';

export type SpaceTaskListViewInterface = {
  spaceId: Id;
  isConversation: boolean;
};

const getColumnsConfig = (isConversation: boolean): ColumnsConfig => ({
  [TaskTableColumn.SPACE]: {
    isVisible: isConversation,
    isSortable: true,
    props: {
      width: 150,
    },
  },
});

const SpaceTaskListView: FC<SpaceTaskListViewInterface> = (props) => {
  const hook = useComponent(props);
  const { t } = useTranslation();

  if (hook.isLoading) {
    return renderSkeleton();
  }

  return (
    <div className={styles.component}>
      {hook.isTaskListEnabled || (
        <NoAccessToFeatureModal
          fallbackUrl={makeProjectChatLink({ projectId: props.spaceId })}
          title={t('List is not available in your current plan.')}
          featureName={t('List')}
        />
      )}
      <div className={styles.content}>
        <TasksTable
          taskIds={hook.taskIds}
          filterId={hook.filterId}
          columnsConfig={getColumnsConfig(props.isConversation)}
        />
      </div>
      <AddCardButton
        projectId={props.spaceId}
        taskCreateSource={TaskCreateSource.SPACE_TASK_LIST}
        className={styles.addCardButton}
      />
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

export default SpaceTaskListView;
