import { GroupedTasksTable } from 'components/tasks/TaskGroupTable';
import {
  ASSIGNEE_COLUMN_CONFIG,
  DUE_DATE_COLUMN_CONFIG,
  LIST_COLUMN_CONFIG,
  PRIORITY_COLUMN_CONFIG,
  PROGRESS_COLUMN_CONFIG,
  PROJECT_COLUMN_CONFIG,
  TAGS_COLUMN_CONFIG,
} from 'components/tasks/TaskGroupTable/columns-config';
import { ColumnConfigInterface } from 'components/tasks/TaskGroupTable/types';

import useComponent from './hook';

export const MY_TASKS_TABLE_CONFIG: ColumnConfigInterface[] = [
  ASSIGNEE_COLUMN_CONFIG,
  PROJECT_COLUMN_CONFIG,
  DUE_DATE_COLUMN_CONFIG,
  PROGRESS_COLUMN_CONFIG,
  LIST_COLUMN_CONFIG,
  TAGS_COLUMN_CONFIG,
  PRIORITY_COLUMN_CONFIG,
];

const MyTasksTable = () => {
  const { taskIds, filterId } = useComponent();

  return (
    <GroupedTasksTable
      groupBy="none"
      groupId="none"
      disableCollapse
      taskIds={taskIds.toArray()}
      filterId={filterId}
      columnsConfig={MY_TASKS_TABLE_CONFIG}
    />
  );
};

export default MyTasksTable;
