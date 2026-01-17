import {
  normalizeTasksDataFromAPI,
  normalizeListsDataFromAPI,
  normalizeChecklistsItemsBasicDataFromAPI,
  normalizeTaskTimeEstimatesDataFromAPI,
} from './helpers';
import { List, Map, fromJS } from 'immutable';
import * as ExtensionDataTypes from '../ExtensionsModel/constants/extensionDataTypes';
import isEmpty from 'lodash/isEmpty';
import {
  ProjectViewDataInterface,
  ParsedObjectPeopleInterface,
  RoleItemInterface,
  ConversationViewDataInterface,
  ParsedConversationViewDataInterface,
  ParsedProjectViewDataInterface,
  ParsedPeopleInterface,
} from './types';
import { Dict } from '../../../types';
import { Id } from '../../../utils/identifier';
import { ExtensionsData } from '../ExtensionsModel/types';
import { TaskPeopleRole } from '../TasksModel/types';

const emptyMap = Map();
const emptyList = List();

export function parseProjectViewData(projectViewData: ProjectViewDataInterface): ParsedProjectViewDataInterface {
  const {
    lists,
    listFollowers,
    tasks,
    taskPeople,
    taskFollowers,
    taskTagIds,
    extensionsData,
    projectFollowers,
    checklistsItemsBasicData,
    taskTimeEstimates,
    ...restData
  } = projectViewData;
  const { normalizedListsData, listsOrderByProjectId } = normalizeListsDataFromAPI(lists);
  const { tasksData, tasksOrderByListId, listIdByTaskId, projectIdsByTaskIds } = normalizeTasksDataFromAPI(tasks);

  const taskTimeEstimatesByTaskId = normalizeTaskTimeEstimatesDataFromAPI(taskTimeEstimates);

  const { checklistItemsData, checklistsByTaskId, taskIdByChecklistItemId } =
    normalizeChecklistsItemsBasicDataFromAPI(checklistsItemsBasicData);

  const taskIds = tasks.map((task) => task.id);
  const { peopleIds, peopleRole } = parseObjectPeople<TaskPeopleRole>(taskPeople, taskIds);

  const taskReactions = parseTaskReactions(extensionsData);
  const listLimits = parseListLimits(extensionsData);

  const projectFollowerIds = parseProjectFollowers(projectFollowers);

  return {
    normalizedListsData,
    listFollowers: fromJS(listFollowers),
    listsOrderByProjectId,
    tasksData,
    tasksOrderByListId,
    projectIdsByTaskIds,
    taskPeopleIds: peopleIds,
    taskPeopleRole: peopleRole,
    listIdByTaskId,
    taskFollowerIds: fromJS(taskFollowers),
    taskTagIds: fromJS(taskTagIds),
    taskTimeEstimatesByTaskId,
    taskReactions,
    listLimits,
    projectFollowerIds,
    checklistItemsData,
    checklistsByTaskId,
    taskIdByChecklistItemId,
    ...restData,
  };
}

export function parseConversationViewData(
  conversationViewData: ConversationViewDataInterface
): ParsedConversationViewDataInterface {
  const {
    lists,
    listFollowers,
    tasks,
    taskPeople,
    taskFollowers,
    taskTagIds,
    extensionsData,
    projectsFollowers,
    ...restData
  } = conversationViewData;
  const { normalizedListsData, listsOrderByProjectId } = normalizeListsDataFromAPI(lists);
  const { tasksData, tasksOrderByListId, listIdByTaskId, projectIdsByTaskIds } = normalizeTasksDataFromAPI(tasks);

  const taskIds = tasks.map((task) => task.id);
  const { peopleIds, peopleRole } = parseObjectPeople<TaskPeopleRole>(taskPeople, taskIds);

  const taskReactions = parseTaskReactions(extensionsData);

  const projectsFollowerIds = parseProjectsFollowers(projectsFollowers);

  return {
    normalizedListsData,
    listFollowers: fromJS(listFollowers),
    listsOrderByProjectId,
    tasksData,
    tasksOrderByListId,
    projectIdsByTaskIds,
    taskPeopleIds: peopleIds,
    taskPeopleRole: peopleRole,
    listIdByTaskId,
    taskFollowerIds: fromJS(taskFollowers),
    taskTagIds: fromJS(taskTagIds),
    taskReactions,
    projectsFollowerIds,
    ...restData,
  };
}

export function parseObjectPeople<T>(
  people: Dict<RoleItemInterface<T>[]>,
  objectIds: Id[]
): ParsedObjectPeopleInterface<T> {
  // todo: change names of returned data
  let peopleIds = emptyMap as Map<Id, List<Id>>;
  let peopleRole = emptyMap as Map<Id, Map<Id, T>>;
  objectIds.forEach((objectId) => {
    const roles = people[objectId];
    if (roles) {
      roles.forEach((roleItem) => {
        peopleIds = peopleIds.update(objectId, (list) => (list ? list.push(roleItem.userId) : List([roleItem.userId])));
        peopleRole = peopleRole.setIn([objectId, roleItem.userId], roleItem.role);
      });
    } else {
      peopleIds = peopleIds.set(objectId, emptyList as List<Id>);
      peopleRole = peopleRole.set(objectId, emptyMap as Map<Id, T>);
    }
  });
  return { peopleIds, peopleRole };
}

export function generateObjectPeople<T>(
  objectIds: Id[],
  currentUserId: Id,
  defaultRole: string
): ParsedObjectPeopleInterface<T> {
  // todo: change names of returned data
  let peopleIds = emptyMap as Map<Id, List<Id>>;
  let peopleRole = emptyMap as Map<Id, Map<Id, T>>;
  objectIds.forEach((objectId) => {
    peopleIds = peopleIds.set(objectId, List([currentUserId]));
    peopleRole = peopleRole.setIn([objectId, currentUserId], defaultRole);
  });
  return { peopleIds, peopleRole };
}

export function parsePeopleRoles<T>(roles: RoleItemInterface<T>[]): ParsedPeopleInterface<T> {
  let peopleIds = emptyList as List<Id>;
  let peopleRole = emptyMap as Map<Id, T>;
  roles.forEach((roleItem) => {
    peopleIds = peopleIds.push(roleItem.userId);
    peopleRole = peopleRole.set(roleItem.userId, roleItem.role);
  });
  return { peopleIds, peopleRole };
}

function parseTaskReactions(extensionsData: ExtensionsData): Map<Id, Map<Id, string>> {
  let taskReactions = emptyMap as Map<Id, Map<Id, string>>;
  if (!isEmpty(extensionsData)) {
    const taskReactionsData = extensionsData[ExtensionDataTypes.TASK_VOTING_REACTION];
    if (!isEmpty(taskReactionsData)) {
      taskReactionsData.forEach((taskReaction) => {
        taskReactions = taskReactions.setIn([taskReaction.taskId, taskReaction.userId], taskReaction.emojiCode);
      });
    }
  }
  return taskReactions;
}

function parseListLimits(extensionsData: ExtensionsData): Map<Id, number> {
  let listLimits = emptyMap as Map<Id, number>;
  if (!isEmpty(extensionsData)) {
    const listLimitsData = extensionsData[ExtensionDataTypes.KANBAN_CARD_LIMIT];
    if (!isEmpty(listLimitsData)) {
      listLimitsData.forEach((listLimit) => {
        listLimits = listLimits.set(listLimit.taskListId, listLimit.cardsLimit);
      });
    }
  }
  return listLimits;
}

function parseProjectFollowers(projectFollowers: Id[]): List<Id> {
  let projectFollowerIds = emptyList as List<Id>;

  if (!isEmpty(projectFollowers)) {
    projectFollowerIds = List(projectFollowers);
  }
  return projectFollowerIds;
}

function parseProjectsFollowers(projectsFollowers: Dict<Id[]>): Map<Id, List<Id>> {
  let projectsFollowerIds = emptyMap as Map<Id, List<Id>>;

  if (!isEmpty(projectsFollowers)) {
    Object.keys(projectsFollowers).forEach((projectId) => {
      projectsFollowerIds = projectsFollowerIds.set(projectId, List(projectsFollowers[projectId]));
    });
  }
  return projectsFollowerIds;
}
