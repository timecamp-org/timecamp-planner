import { defaultDebounceTime } from 'common/utils/debounceTimes';
import { ResizeEdgeType } from 'commonComponents/Timeline/types';

import { List, Map } from 'immutable';
import { FileUploaded } from 'models/domain/FilesModel/types';
import { action } from 'typesafe-actions';
import { Dict } from '../../../types';
import { getTaskDataFromChangedProps, getTaskRecordFromRestResponse } from '../../../utils/fetchResultToRecord';
import { Id } from '../../../utils/identifier';
import { ActionResultInterface } from '../ActionResultModel';
import { EntityInterface } from '../EntityModel/types';
import * as C from './constants';
import {
  CopyCardOptionsInterface,
  TaskCreateSource,
  TaskInterface,
  TaskPeopleRole,
  TaskStatus,
  TasksFromMessagesData,
  TaskPriorityTypes,
} from './types';

export const onTaskCreate = (
  taskFields: Partial<TaskInterface>,
  destinationTaskId: Id,
  createBelowDestination: boolean,
  createAtTheEnd: boolean,
  createAtTheBeginning: boolean,
  listId: Id,
  taskPeople: Map<Id, TaskPeopleRole>,
  taskFollowerIds?: List<Id>,
  taskCreateSource?: TaskCreateSource,
) =>
  action(C.onTaskCreate, {
    taskFields,
    destinationTaskId,
    createBelowDestination,
    createAtTheEnd,
    createAtTheBeginning,
    listId,
    taskPeople,
    taskFollowerIds,
    taskCreateSource,
  });

export const onTaskCreateSuccess = (actionResult: ActionResultInterface) => action(C.onTaskCreateSuccess, actionResult);

export const onCreateTaskInEmptyList = (
  taskFields: Partial<TaskInterface>,
  taskPeople: Map<Id, TaskPeopleRole>,
  taskCreateSource?: TaskCreateSource,
) =>
  action(C.onCreateTaskInEmptyList, {
    taskFields,
    taskPeople,
    taskCreateSource,
  });

export const onTaskUpdate = (taskId: Id, taskFields: Partial<TaskInterface>, ignoreDebounce?: boolean) =>
  action(C.onTaskUpdate, { taskId, taskFields, ignoreDebounce });

export const onMoveTask = (
  sourceTaskId: Id,
  destinationTaskId: Id,
  destinationListId: Id,
  sourceProjectId: Id,
  destinationProjectId: Id,
  moveBelowDestination: boolean,
) =>
  action(C.onMoveTask, {
    sourceTaskId,
    destinationTaskId,
    destinationListId,
    sourceProjectId,
    destinationProjectId,
    moveBelowDestination,
  });

export const onMoveTaskInSections = (
  taskId: Id,
  sourceListTaskIndex: number,
  destinationListTaskIndex: number,
  sourceListId: Id,
  destinationListId: Id,
  destinationProjectId?: Id,
) =>
  action(C.onMoveTaskInSections, {
    taskId,
    sourceListTaskIndex,
    destinationListTaskIndex,
    sourceListId,
    destinationListId,
    destinationProjectId,
  });

export const onMoveTaskSuccess = (actionResult: ActionResultInterface) => action(C.onMoveTaskSuccess, actionResult);

export const onArchiveTask = (taskId: Id) => action(C.onArchiveTask, { taskId });

export const onUnarchiveTask = (taskId: Id) => action(C.onUnarchiveTask, { taskId });

export const onAddToTaskPeople = (taskId: Id, userId: Id, role: TaskPeopleRole, userIds?: Id[]) =>
  action(C.onAddToTaskPeople, { taskId, userId, role, userIds });

export const onRemoveFromTaskPeople = (taskId: Id, userId: Id) => action(C.onRemoveFromTaskPeople, { taskId, userId });

export const onUpdateName = (taskId: Id, name: string) => action(C.onUpdateName, { taskId, name });

export const onChangeDescription = (taskId: Id, description: string) =>
  action(C.onChangeDescription, { taskId, description });

export const onChangeProgressEstimate = (
  taskId: Id,
  progressEstimate: number,
  ignoreDebounce: boolean = false,
  debounceTimeout: number = defaultDebounceTime,
) =>
  action(C.onChangeProgressEstimate, {
    taskId,
    progressEstimate,
    ignoreDebounce,
    debounceTimeout,
  });

// TODO: figure out better way to do this
export const onSetIsWaitingToUpdateProgress = (isWaiting: boolean) =>
  action(C.onSetIsWaitingToUpdateProgress, { isWaiting });

export const onChangeStatus = (taskId: Id, status: TaskStatus, ignoreDebounce: boolean = false) =>
  action(C.onChangeStatus, { taskId, status, ignoreDebounce });

export const onChangeDueDate = (taskId: Id, dueDate: number, ignoreDebounce: boolean = false) =>
  action(C.onChangeDueDate, { taskId, dueDate, ignoreDebounce });

export const onChangeStartDate = (taskId: Id, startDate: number, ignoreDebounce: boolean = false) =>
  action(C.onChangeStartDate, { taskId, startDate, ignoreDebounce });

export const onMoveTaskTimespan = (
  taskId: Id,
  startDate: number,
  ignoreDebounce: boolean = false,
  taskStartTime?: number,
  taskEndTime?: number,
) =>
  action(C.onMoveTaskTimespan, {
    taskId,
    startDate,
    ignoreDebounce,
    taskStartTime,
    taskEndTime,
  });

export const onCreateTaskData = (entity: EntityInterface) => {
  const task = getTaskRecordFromRestResponse(entity.body);
  const entityBody = entity.body;
  return action(C.onCreateTaskData, {
    taskData: task,
    taskListId: entityBody.taskListId,
    projectId: entityBody.projectId,
    order: entityBody.order,
    sourceMessageId: entityBody.sourceMessageId,
  });
};

export const onUpdateTaskData = (entity: EntityInterface) => {
  const { taskData, order, projectId, taskListId, sourceMessageId, description, taskAssigneeIds, taskFollowerIds } =
    getTaskDataFromChangedProps(entity.body.id, entity.body);
  return action(C.onUpdateTaskData, {
    taskData,
    order,
    projectId,
    taskListId,
    sourceMessageId,
    description,
    taskAssigneeIds,
    taskFollowerIds,
  });
};

export const onUpdateTaskPeopleIds = (taskId: Id, taskPeopleIds: Id[]) =>
  action(C.onUpdateTaskPeopleIds, {
    taskId,
    taskPeopleIds: List(taskPeopleIds),
  });

export const onUpdateTaskPeopleRole = (taskId: Id, taskPeopleRole: Dict<TaskPeopleRole>) =>
  action(C.onUpdateTaskPeopleRole, {
    taskId,
    taskPeopleRole: Map(taskPeopleRole),
  });

export const onRemoveTaskPerson = (entity: EntityInterface) => {
  const { userId } = entity.body;

  return action(C.onRemoveTaskPerson, {
    taskId: entity.entityId,
    userId,
  });
};

export const onAddTaskPerson = (entity: EntityInterface) => {
  const { userId, role } = entity.body;
  return action(C.onAddTaskPerson, {
    taskId: entity.entityId,
    userId,
    role,
  });
};

export const onUpdateTaskPerson = (entity: EntityInterface) => {
  const { userId, role } = entity.body;
  return action(C.onUpdateTaskPerson, {
    taskId: entity.entityId,
    userId,
    role,
  });
};

export const onCreateUserAndAddToSubscribers = (taskId: Id, email: string, role: TaskPeopleRole) =>
  action(C.onCreateUserAndAddToSubscribers, {
    taskId,
    email,
    role,
  });

export const onMoveSection = (
  sourceSectionId: Id,
  destinationSectionId: Id,
  sourceProjectId: Id,
  destinationProjectId: Id,
) =>
  action(C.onMoveSection, {
    sourceSectionId,
    destinationSectionId,
    sourceProjectId,
    destinationProjectId,
  });

export const onCopySection = (sectionId: Id, sectionName: string) =>
  action(C.onCopySection, { sectionId, sectionName });

export const onCreateTaskAttachmentsIds = (taskId: Id, taskAttachmentsIds: Id[]) =>
  action(C.onCreateTaskAttachmentsIds, {
    taskId,
    taskAttachmentsIds: List(taskAttachmentsIds),
  });

export const onBatchTasksSources = (tasksFromMessagesSourceData: TasksFromMessagesData) =>
  action(C.onBatchTasksSources, { tasksFromMessagesSourceData });

export const onAddFileToTaskAttachments = (fileId: Id, taskId: Id) =>
  action(C.onAddFileToTaskAttachments, { fileId, taskId });

export const onAddFileToTaskAttachmentsSuccess = (fileId: Id, taskId: Id) =>
  action(C.onAddFileToTaskAttachmentsSuccess, { fileId, taskId });

export const onAddFilesToTaskAttachments = (files: FileUploaded[], taskId: Id) =>
  action(C.onAddFilesToTaskAttachments, { files, taskId });

export const onDeleteTaskAttachment = (fileId: Id, taskId: Id) => action(C.onDeleteTaskAttachment, { fileId, taskId });

export const onDeleteTaskAttachmentSuccess = (fileId: Id, taskId: Id) =>
  action(C.onDeleteTaskAttachmentSuccess, { fileId, taskId });

export const onCreateSpaceIfNoneAndCreateListIfNoneAndCreateCard = (
  spaceId: Id,
  listId: Id,
  userId: Id,
  cardName: string,
) =>
  action(C.onCreateSpaceIfNoneAndCreateListIfNoneAndCreateCard, {
    spaceId,
    listId,
    userId,
    cardName,
  });

export const onCopyCard = (taskId: Id, newName: string, options: CopyCardOptionsInterface) =>
  action(C.onCopyCard, { taskId, newName, options });

export const onFetchAllTaskAttachments = ({ taskId }) => action(C.onFetchAllTaskAttachments, { taskId });
export const onFetchTaskDetails = (taskId: Id) => action(C.onFetchTaskDetails, { taskId });

export const onFetchTaskDetailsSuccess = (actionResult: ActionResultInterface) =>
  action(C.onFetchTaskDetailsSuccess, actionResult);

export const onAddUserToTaskFollowers = (taskId: Id, userId: Id) =>
  action(C.onAddUserToTaskFollowers, { taskId, userId });

export const onAddUserToTaskFollowersSuccess = (actionResult: ActionResultInterface) =>
  action(C.onAddUserToTaskFollowersSuccess, actionResult);

export const onRemoveUserFromTaskFollowers = (taskId: Id, userId: Id) =>
  action(C.onRemoveUserFromTaskFollowers, { taskId, userId });

export const onRemoveUserFromTaskFollowersSuccess = (actionResult: ActionResultInterface) =>
  action(C.onRemoveUserFromTaskFollowersSuccess, actionResult);

export const onRemoveUserFromTasksFollowers = (tasksFollowerIds: Map<Id, List<Id>>) =>
  action(C.onRemoveUserFromTasksFollowers, { tasksFollowerIds });

export const onAddTaskFollower = (taskId: Id, { userId }: Dict<Id>) => action(C.onAddTaskFollower, { taskId, userId });

export const onRemoveTaskFollower = (taskId: Id, { userId }: Dict<Id>) =>
  action(C.onRemoveTaskFollower, { taskId, userId });

export const onAddTaskReaction = (taskId: Id, emojiCode: string) => action(C.onAddTaskReaction, { taskId, emojiCode });

export const onAddTaskReactionSuccess = (actionResult: ActionResultInterface) =>
  action(C.onAddTaskReactionSuccess, actionResult);

export const onRemoveTaskReaction = (taskId: Id, emojiCode: string) =>
  action(C.onRemoveTaskReaction, { taskId, emojiCode });

export const onRemoveTaskReactionSuccess = (actionResult: ActionResultInterface) =>
  action(C.onRemoveTaskReactionSuccess, actionResult);

export const onUpdateTaskReactionData = (entity: EntityInterface) => {
  const { taskId, userId, emojiCode } = entity.body;
  return action(C.onUpdateTaskReactionData, {
    taskId,
    userId,
    emojiCode,
  });
};

export const onRemoveTaskReactionData = (entity: EntityInterface) => {
  const { taskId, userId } = entity.body;
  return action(C.onRemoveTaskReactionData, {
    taskId,
    userId,
  });
};

export const onBatchTaskFileIds = (fileIds: List<Id>, taskId: Id) =>
  action(C.onBatchTaskFileIds, {
    fileIds,
    taskId,
  });

export const onAddFileIdToTaskFileIds = (fileId: Id, taskId: Id) =>
  action(C.onAddFileIdToTaskFileIds, {
    fileId,
    taskId,
  });

export const onSetIsTaskDescriptionDirty = (isDirty: boolean) => action(C.onSetIsTaskDescriptionDirty, { isDirty });

export const onSetUserLatestTaskVisitDate = (taskId: Id, date: Date) =>
  action(C.onSetUserLatestTaskVisitDate, { taskId, date });

export const onResizeTaskTimePeriod = (
  taskId: Id,
  timestamp: number,
  edge: ResizeEdgeType,
  taskStartTime?: number,
  taskEndTime?: number,
) =>
  action(C.onResizeTaskTimePeriod, {
    taskId,
    timestamp,
    edge,
    taskEndTime,
    taskStartTime,
  });

export const onSetTaskPriority = (taskId: Id, taskPriorityType: TaskPriorityTypes) =>
  action(C.onSetTaskPriority, { taskPriorityType, taskId });
