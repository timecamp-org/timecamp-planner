import { isToday, isTomorrow } from 'date-fns';

import DueDate from 'commonComponents/DueDate';
import PersonFullName from 'components/person/PersonFullName';
import PersonIcon from 'components/person/PersonIcon';
import ListNameOutput from 'components/taskList/ListNameOutput';
import { TaskGroupBy } from 'components/tasks/TaskGroupTable/useTaskGroups';
import { i18mark } from 'i18n';
import { TASK_NO_GROUP_KEY } from 'models/domain/TasksModel/helpers';
import { DueDateGroupsKeys } from 'models/domain/TasksModel/types';

import { TASK_PRIORITY_TRANSLATION_MAP } from '../TaskPriority/const';
import TaskPriorityFlag from '../TaskPriority/TaskPriorityFlag';

import styles from './styles.css';

const getGroupNameFromDueDateGroupId = (dateId: DueDateGroupsKeys) => {
  if (Number.isInteger(Number(dateId))) {
    const date = new Date(Number(dateId));
    if (isToday(date)) {
      return i18mark('Today');
    } else if (isTomorrow(date)) {
      return i18mark('Tomorrow');
    } else {
      return <DueDate format={'dddd'} dueDate={Number(dateId)} />;
    }
  }

  switch (dateId) {
    case 'overdue':
      return i18mark('Overdue');
    case 'nextMonth':
      return i18mark('Next month');
    case 'thisMonth':
      return i18mark('This month');
    case 'future':
      return i18mark('Future');
    default:
      return i18mark('No due date');
  }
};

export const getGroupHeader = ({ groupBy, groupId }: { groupId: string; groupBy: TaskGroupBy }) => {
  if (groupId === TASK_NO_GROUP_KEY) {
    switch (groupBy) {
      case 'assignees':
        return i18mark('Not assigned');
      case 'dueDate':
        return i18mark('No due date');
      case 'list':
        return i18mark('No list');
      case 'taskPriorityType':
        return i18mark('No priority');
      default:
        return i18mark('No group');
    }
  }

  switch (groupBy) {
    case 'assignees':
      return (
        <>
          <PersonIcon userId={groupId} height={32} width={32} />
          <PersonFullName userId={groupId} className={styles.personName} />
        </>
      );
    case 'list':
      return <ListNameOutput listId={groupId} />;
    case 'dueDate':
      return getGroupNameFromDueDateGroupId(groupId);
    case 'taskPriorityType':
      return (
        <>
          <TaskPriorityFlag onClick={null} hideBorder={true} size="lg" priorityType={groupId} />
          <span>{groupId ? TASK_PRIORITY_TRANSLATION_MAP[groupId] : i18mark('No priority')}</span>
        </>
      );
    default:
      return i18mark('TASK NAME');
  }
};
