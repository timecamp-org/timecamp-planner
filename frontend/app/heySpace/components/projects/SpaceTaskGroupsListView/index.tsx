import { FC } from 'react';

import { MenuItem } from '@mui/material';

import { useLocalStorage } from 'common/hooks/useLocalStorage';
import { makeProjectChatLink } from 'common/utils/routerHelpers';
import NoAccessToFeatureModal from 'commonComponents/NoAccessToFeatureModal';
import { UnderlinedSelect } from 'commonComponents/Select';
import DefaultContentSkeletonLoader from 'commonComponents/skeletons/DefaultContentSkeletonLoader';
import { TaskGroupBy } from 'components/tasks/TaskGroupTable/useTaskGroups';
import { i18mark, useTranslation } from 'i18n';

import { SpaceTaskListViewInterface } from '../SpaceTaskListView';
import useComponent from '../SpaceTaskListView/hook';

import { GroupTables } from './GroupTables';
import { NoGroupTable } from './NoGroupTable';
import styles from './styles.css';

const ITEMS_TYPE_LABELS: Record<TaskGroupBy, string> = {
  none: i18mark('no_grouping'),
  assignees: i18mark('Assignee'),
  dueDate: i18mark('Due date'),
  list: i18mark('List'),
  taskPriorityType: i18mark('Priority'),
};

const SpaceTaskGroupsListView: FC<SpaceTaskListViewInterface> = (props) => {
  const { t } = useTranslation();
  const hook = useComponent(props);
  const [groupBy, setGroupBy] = useLocalStorage<TaskGroupBy>(`projectListView-groupBy-${props.spaceId}`, 'none');

  if (hook.isLoading) {
    return (
      <div className={styles.skeletonWrapper}>
        <DefaultContentSkeletonLoader />
      </div>
    );
  }

  const Table =
    groupBy === 'none' ? (
      <NoGroupTable projectId={props.spaceId} />
    ) : (
      <GroupTables groupBy={groupBy} projectId={props.spaceId} />
    );

  return (
    <div className={styles.component}>
      <UnderlinedSelect label={t('Group by:')} onChange={setGroupBy} value={groupBy} className={styles.groupBy}>
        {Object.entries(ITEMS_TYPE_LABELS).map(([itemType, label]) => (
          <MenuItem key={itemType} value={itemType} className={styles.groupByOption}>
            {t(label)}
          </MenuItem>
        ))}
      </UnderlinedSelect>
      {hook.isTaskListEnabled || (
        <NoAccessToFeatureModal
          fallbackUrl={makeProjectChatLink({ projectId: props.spaceId })}
          title={t('List is not available in your current plan.')}
          featureName={t('List')}
        />
      )}
      <div className={styles.content}>{Table}</div>
    </div>
  );
};

export default function ({ isConversation, spaceId }: SpaceTaskListViewInterface) {
  return <SpaceTaskGroupsListView spaceId={spaceId} isConversation={isConversation} />;
}
