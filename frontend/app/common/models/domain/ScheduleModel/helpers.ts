import { Id } from 'common/utils/identifier';
import { differenceInCalendarDays, endOfDay, isWeekend, isWithinRange, startOfDay } from 'date-fns';
import { List, Map } from 'immutable';
import { add, isEmpty } from 'lodash';
import { FilterByType } from 'models/component/FiltersModel/types';
import { differenceInBusinessDays } from 'utils/dates';
import { SumPeriod } from '../TaskTimeEstimateModel/types';
import { TaskStatus, TaskStatusFilterType } from '../TasksModel/types';
import { ScheduleItem, TaskScheduleInterface } from './types';

export function mapTaskDataToScheduleItem(taskSchedule: TaskScheduleInterface): any {
  const { dueDate, id, startDate, ...rest } = taskSchedule;
  const isAllDay = !startDate || !dueDate;
  const { userId, skipWeekends, minutes, sumPeriod, hasAccess } = rest;
  const group = userId;
  const itemId = `${id}/${group}`;

  const totalWorkingDays = skipWeekends
    ? differenceInBusinessDays(startDate, dueDate)
    : differenceInCalendarDays(dueDate, startDate) + 1;
  const minutesPerDay = sumPeriod === SumPeriod.DAILY ? minutes : Math.ceil(minutes / totalWorkingDays);

  return {
    ...rest,
    taskId: id,
    id: itemId,
    group,
    start_time: isAllDay ? startOfDay(startDate || dueDate).getTime() : startDate,
    end_time: isAllDay ? endOfDay(startDate || dueDate).getTime() : dueDate,
    isEditable: hasAccess,
    totalWorkingDays,
    minutesPerDay,
    canChangeGroup: false,
  };
}

interface ScheduleFilterArgsInterface {
  scheduleItems: TaskScheduleInterface[];
  filterBy?: FilterByType;
  tagsByObjectId?: Map<Id, List<Id>>;
  groupIdByUserIdMap: Map<Id, Id>;
}

type ScheduleFilter = (args: ScheduleFilterArgsInterface) => TaskScheduleInterface[];

const FILTER_KEY_MAP = {
  assigneeId: 'userId',
  projects: 'projectId',
  status: 'status',
  tags: 'tag',
  userGroup: 'userGroup',
};

export const filterScheduleData: ScheduleFilter = ({ scheduleItems, filterBy, groupIdByUserIdMap }) => {
  if (!filterBy?.size) {
    return scheduleItems;
  }
  return Object.entries(filterBy?.toJS()).reduce((acc, [filterKey, filterValues]) => {
    if (isEmpty(filterValues)) {
      return acc;
    }

    switch (FILTER_KEY_MAP[filterKey]) {
      case FILTER_KEY_MAP.status:
        if (Array.isArray(filterValues)) {
          return filterByStatus(acc, filterValues[0] as TaskStatusFilterType);
        }
        return filterByStatus(acc, filterValues as TaskStatusFilterType);

      case FILTER_KEY_MAP.assigneeId:
        return acc.filter((item) => {
          return (filterValues as string[]).includes(item[FILTER_KEY_MAP[filterKey]]);
        });

      case FILTER_KEY_MAP.projects:
        return acc.filter((item) => (filterValues as List<string>).includes(item[FILTER_KEY_MAP[filterKey]]));

      case FILTER_KEY_MAP.userGroup:
        if (Array.isArray(filterValues)) {
          return filterByUserGroup(acc, groupIdByUserIdMap, filterValues);
        }

      default:
        return acc;
    }
  }, scheduleItems);
};

function filterByStatus(items: TaskScheduleInterface[], filterStatus: TaskStatusFilterType) {
  switch (filterStatus) {
    case TaskStatusFilterType.ACTIVE:
      return items.filter(({ status }) => status === TaskStatus.ACTIVE);
    case TaskStatusFilterType.COMPLETED:
      return items.filter(({ status }) => status === TaskStatus.COMPLETED);
    default:
      return items;
  }
}

function filterByUserGroup(tasks: TaskScheduleInterface[], groupByUser: Map<Id, Id>, filterGroupIds: Id[]) {
  return tasks.filter(({ userId }) => filterGroupIds.includes(groupByUser.get(userId)));
}

export const mapTasksItemsInVisibleDaysToWorkTime = (
  taskItems: ScheduleItem[],
  days: Date[],
  group: string
): ScheduleItem[] =>
  days.map((dayKey) => {
    const minutes = taskItems
      .filter(({ start_time, end_time }) => isWithinRange(dayKey, startOfDay(start_time), endOfDay(end_time)))
      .reduce(
        // tslint:disable-next-line: no-shadowed-variable
        (acc, { minutesPerDay, skipWeekends }) => {
          const isWorkingDay = isWeekend(dayKey) ? !skipWeekends : true;

          if (!isWorkingDay) {
            return acc;
          }
          return add(acc, minutesPerDay);
        },
        0
      );

    return {
      minutes,
      start_time: startOfDay(dayKey).getTime(),
      end_time: endOfDay(dayKey).getTime(),
      group,
      id: `${dayKey}/${group}`,
      isEditable: false,
      canMove: false,
      canChangeGroup: false,
    } as ScheduleItem;
  }, [] as ScheduleItem[]);

type ScheduleFilterValuesCounter = (args: ScheduleFilterArgsInterface) => number;

export const countFilteredValues: ScheduleFilterValuesCounter = (args) => filterScheduleData(args).length;

export const getPlaceholderTask = (userId: string): TaskScheduleInterface => ({
  userId,
  color: '',
  startDate: null,
  dueDate: null,
  hasAccess: true,
  minutes: null,
  id: Math.random().toString(),
  name: '',
  progress: null,
  projectId: '',
  skipWeekends: null,
  status: null,
  sumPeriod: null,
});
