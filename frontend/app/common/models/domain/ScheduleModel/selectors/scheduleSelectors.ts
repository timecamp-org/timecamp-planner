import createImmutableEqualSelector from 'common/utils/createImmutableEqualSelector';
import { eachDay } from 'date-fns';
import { flatten, groupBy, keyBy } from 'lodash';
import { mapUserIdToGroupItem } from 'models/domain/TasksModel/helpers';
import { OverwatchTileViewSettingsInterface } from '../../OverwatchModel/types';
import { filterScheduleData, mapTaskDataToScheduleItem, mapTasksItemsInVisibleDaysToWorkTime } from '../helpers';

import generateSelectorName from 'common/utils/generateSelectorName';
import { PeriodDurationType } from 'common/utils/timeIntervalDefinitions';
import { selectFilter } from 'models/component/FiltersModel/selectors';
import { selectProjectsColor } from 'models/domain/ProjectsModel/selectors';
import { selectTaskPeopleIdsDomain, selectTasksData } from 'models/domain/TasksModel/selectors/domain';
import { selectTimeEstimatesByTasks } from 'models/domain/TaskTimeEstimateModel/selectors';

import { Task } from 'models/domain/TasksModel/models';
import { selectActiveUsersSortedByFullName } from 'models/domain/UsersModel/selectors/domain';
import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';
import { FilterByType } from '../../../component/FiltersModel/types';
import { selectGroupIdByUserIdMap } from '../../OrganizationGroupsModel/selectors/domain';
import { selectProjectsDataDomain } from '../../ProjectsModel/selectors/domain';
import { TaskTimeEstimateInterface } from '../../TaskTimeEstimateModel/types';
import { selectUsersData } from '../../UsersModel/selectors/domain';
import { getPlaceholderTask } from '../helpers';
import { ScheduleItem, ScheduleTimelineDataInterface, TaskScheduleInterface } from '../types';
import { selectScheduleData } from './domain';

const selectScheduleDataWithoutBot = createSelector(selectScheduleData, selectUsersData, (scheduleData, usersData) =>
  scheduleData.filter(({ userId }) => !usersData.get(userId)?.isBot)
);

const selectScheduleDataByTaskId = createSelector(
  selectScheduleDataWithoutBot,
  (data): Record<string, TaskScheduleInterface[]> => groupBy(data, 'id')
);

const selectScheduleDataByTaskIdAndUserId = createSelector(
  selectScheduleDataByTaskId,
  (data) =>
    Object.entries(data)?.reduce((acc, [taskId, scheduleTasks]) => {
      scheduleTasks?.forEach((task) => {
        const { userId } = task;
        acc[taskId] ? (acc[taskId][userId] = task) : (acc[taskId] = { [userId]: task });
      });
      return acc;
    }, {}) as Record<string, Record<string, TaskScheduleInterface>>
);

const selectUpdatedScheduleData = createSelector(
  selectTimeEstimatesByTasks,
  selectTasksData,
  selectTaskPeopleIdsDomain,
  selectProjectsColor,
  selectUsersData,
  selectScheduleDataByTaskIdAndUserId,
  selectProjectsDataDomain,
  (estimatesByTaskId, tasksById, taskIdsByUser, projectsColors, organizationPeople, tasksByIdAndUser, projectsData) => {
    tasksById?.forEach((task, taskId) => {
      const taskData = task.toJS() as Task;
      if (taskData?.startDate && taskData?.dueDate && tasksByIdAndUser?.[taskId]) {
        if (task?.isArchived) {
          tasksByIdAndUser[taskId] = {};
        } else {
          Object.entries(tasksByIdAndUser[taskId])?.forEach(([userId, scheduleTask]) => {
            const color = projectsColors.get(scheduleTask.projectId);
            tasksByIdAndUser[taskId][userId] = {
              ...scheduleTask,
              ...taskData,
              ...(estimatesByTaskId.get(taskId)?.toJS() ?? { minutes: 0 }),
              color: color || scheduleTask.color,
            };
          });
        }
      }
    });

    Object.entries(taskIdsByUser?.toJS() as Record<string, string[]>).forEach(([taskId, assignees]) => {
      const taskData = tasksById.get(taskId)?.toJS() as Task;
      const localEstimate = estimatesByTaskId.get(taskId)?.toJS() as TaskTimeEstimateInterface;
      const color = projectsColors.get(taskData.projectId);

      const estimate = estimatesByTaskId.get(taskId)?.toJS() ?? { hours: 0 };
      assignees.forEach((userId) => {
        if (!tasksByIdAndUser[taskId]) {
          Object.assign(tasksByIdAndUser, {
            [taskId]: {
              [userId]: {
                ...taskData,
                ...localEstimate,
                ...estimate,
                taskId,
                userId,
                color,
                hasAccess: true,
              },
            },
          });
        }
      });
    });

    return Object.values(tasksByIdAndUser).reduce(
      (acc, scheduleTasksByUser) => [...acc, ...Object.values(scheduleTasksByUser)],
      []
    );
  }
);

const selectScheduleDataByUser = createSelector(
  selectUpdatedScheduleData,
  (data) => ({ ...groupBy(data, 'userId') } as Record<string, TaskScheduleInterface[]>)
);

export const selectScheduleDataWithAllUsersSortedByUserName = createSelector(
  selectScheduleDataByUser,
  selectActiveUsersSortedByFullName,
  (data, users) => {
    let scheduleTasks = [];
    const userPlaceholderTasks = [];
    users.forEach(({ id }) => {
      data[id] ? (scheduleTasks = [...scheduleTasks, ...data[id]]) : userPlaceholderTasks.push(getPlaceholderTask(id));
    });

    return [...scheduleTasks, ...userPlaceholderTasks] as TaskScheduleInterface[];
  }
);

export const selectScheduleTasksById = createSelector(selectUpdatedScheduleData, (data) => {
  return keyBy<TaskScheduleInterface>(data as any, 'id');
});

export const selectAccessibleScheduleTasks = createSelector(selectUpdatedScheduleData, (data) =>
  data.filter(({ hasAccess }) => hasAccess)
);

const DURATION_WITH_TIME_MARKERS = [PeriodDurationType.WEEK, PeriodDurationType.TWO_WEEKS, PeriodDurationType.MONTH];

// args: filterId
export const selectFilteredScheduleData = createCachedSelector(
  selectScheduleDataWithAllUsersSortedByUserName,
  selectFilter,
  selectGroupIdByUserIdMap,
  (scheduleItems, filter, groupIdByUserIdMap) => {
    const filterFields = filter?.get('filterByField') as FilterByType;

    return filterScheduleData({
      scheduleItems,
      filterBy: filterFields,
      groupIdByUserIdMap,
    });
  }
)((_, args) => generateSelectorName(args, ['filterId']));

const selectScheduleTimelineItemsAndGroups = createCachedSelector(selectFilteredScheduleData, (scheduleData) => {
  const { itemsByUser, userGroupMap } = scheduleData?.reduce(
    (acc, taskSchedule) => {
      const scheduleItem = mapTaskDataToScheduleItem(taskSchedule);
      const userTasks = acc.itemsByUser[taskSchedule.userId];

      userTasks ? userTasks.push(scheduleItem) : (acc.itemsByUser[taskSchedule.userId] = [scheduleItem]);

      if (!acc.userGroupMap[taskSchedule.userId]) {
        acc.userGroupMap[taskSchedule.userId] = mapUserIdToGroupItem(taskSchedule.userId);
      }

      return acc;
    },
    { itemsByUser: {}, userGroupMap: {} }
  ) as {
    itemsByUser: { [userId: string]: ScheduleItem[] };
    userGroupMap: {
      [userId: string]: ReturnType<typeof mapUserIdToGroupItem>;
    };
  };

  return {
    itemsByUser,
    userGroup: Object.values(userGroupMap),
  };
})((_, args) => generateSelectorName(args, ['filterId']));

// args OverwatchTileViewSettingsRecordInterface
export const selectScheduleTimelineData = createImmutableEqualSelector(
  selectScheduleTimelineItemsAndGroups,
  (_, args: { viewSettings: OverwatchTileViewSettingsInterface; filterId: string }) => args,
  ({ itemsByUser, userGroup }, { viewSettings: { visiblePeriodDurationType, visibleTimeEnd, visibleTimeStart } }) => {
    const visibleDays: Date[] = eachDay(visibleTimeStart, visibleTimeEnd);

    const timelineItemsByUser = DURATION_WITH_TIME_MARKERS.includes(visiblePeriodDurationType)
      ? Object.entries(itemsByUser).map(([userId, items]) => [
          ...mapTasksItemsInVisibleDaysToWorkTime(items, visibleDays, userId),
          ...items,
        ])
      : Object.values(itemsByUser);

    return {
      items: flatten(timelineItemsByUser),
      groups: userGroup,
    } as ScheduleTimelineDataInterface;
  }
);

export const selectAllTasksByUser = createSelector(selectScheduleDataWithAllUsersSortedByUserName, (data) =>
  groupBy(data, 'userId')
);
