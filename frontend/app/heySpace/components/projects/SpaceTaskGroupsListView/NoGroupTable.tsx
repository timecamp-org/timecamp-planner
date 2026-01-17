import { FC } from 'react';

import { Id } from 'common/utils/identifier';
import { AddTaskButton } from 'components/tasks/AddTaskButton';
import { GroupedTasksTable } from 'components/tasks/TaskGroupTable';
import { TaskCreateSource } from 'models/domain/TasksModel/types';

import useComponent from '../SpaceTaskListView/hook';

import { getAddTaskProps } from './helpers';
import styles from './styles.css';

export type NoGroupTableInterface = {
  projectId: Id;
};

export const NoGroupTable: FC<NoGroupTableInterface> = ({ projectId }) => {
  const hook = useComponent({ spaceId: projectId, isConversation: false });

  return (
    <div className={styles.component}>
      <GroupedTasksTable
        groupBy="none"
        groupId={projectId}
        taskIds={hook.taskIds.toArray()}
        filterId={hook.filterId}
        disableCollapse
      >
        <AddTaskButton
          projectId={projectId}
          taskCreateSource={TaskCreateSource.SPACE_TASK_LIST}
          {...getAddTaskProps('none')}
        />
      </GroupedTasksTable>
    </div>
  );
};
