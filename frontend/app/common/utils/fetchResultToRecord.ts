import { Task } from '../models/domain/TasksModel/models';
import { Notification } from '../models/domain/NotificationsModel/models';
import { Activity } from '../models/domain/ActivitiesModel/models';
import Delta from 'quill-delta';
import { Message } from '../models/domain/MessagesModel/models';
import { fromJS } from 'immutable';
import { getJsonObjectProperty } from './index';
import { dateAsEpoch } from './epoch';
import isNil from 'lodash/isNil';
import { TaskInterface, TaskPropsChhangesInterface, TaskChangedDataInterface } from '../models/domain/TasksModel/types';
import { Id } from './identifier';
import { ActivityEntityInterface, ActivityRecordInterface } from 'models/domain/ActivitiesModel/types';
import { File } from 'models/domain/FilesModel/models';
import { FileRecordInterface, FileRestResponse } from 'models/domain/FilesModel/types';

const newTask = new Task();

const taskRecordKeys = Object.keys(newTask.toJS());

export function getTaskRecordFromRestResponse(task: TaskInterface): TaskInterface {
  return new Task({
    ...task,
    progress: task.progress,
    description: task.description,
  });
}

export function getTaskDataFromChangedProps(
  id: Id,
  changedProps: TaskPropsChhangesInterface
): TaskChangedDataInterface {
  const {
    progress,
    description,
    order,
    dueDate,
    projectId,
    taskListId,
    sourceMessageId,
    taskAssigneeIds,
    taskFollowerIds,
    startDate,
    ...task
  } = changedProps;

  const taskData: TaskInterface = {
    id,
    ...getTaskData(task as TaskInterface),
  };

  if (!isNil(progress)) {
    taskData.progress = progress;
  }

  if (!isNil(dueDate)) {
    taskData.dueDate = dateAsEpoch(dueDate);
  }

  if (!isNil(startDate)) {
    taskData.startDate = dateAsEpoch(startDate);
  }

  const result: TaskChangedDataInterface = {
    taskData,
    order,
    projectId,
    taskListId,
    sourceMessageId,
    taskAssigneeIds,
    taskFollowerIds,
  };

  if (description !== undefined) {
    result.description = description;
  }

  return result;
}

function getTaskData(task: TaskInterface): TaskInterface {
  const taskData = {};
  Object.keys(task).forEach((key) => {
    if (taskRecordKeys.includes(key)) {
      taskData[key] = task[key];
    }
  });
  return taskData as TaskInterface;
}

export function getNotificationRecordFromRestResponse(notification) {
  return new Notification(
    fromJS({
      ...notification,
      type: notification.notificationType,
      creationTimestamp: notification.createdAt,
    })
  );
}

export function getActivityRecordFromRestResponse(activity: ActivityEntityInterface): ActivityRecordInterface {
  return Activity(
    fromJS({
      ...activity,
      actingUserId: activity.actorId,
      objectId: activity.targetId,
      objectType: activity.targetType,
      objectValue: activity.targetValue,
      timestamp: activity.createdAt,
    })
  );
}

export function getMessageRecordFromRestApiResponse(wrappedMessage) {
  const { body } = wrappedMessage;
  return new Message({
    id: body.id,
    text: body.content,
    containerType: body.containerType,
    containerId: wrappedMessage.optionalId,
    editTime: body.editedAt,
    editorId: body.editorId,
    userId: body.senderId,
    isLinkPreviewEnabled: body.isLinkPreviewEnabled,
  });
}

export function getMessageCreationTimeFromRestApiResponse(wrappedMessage) {
  const { createdAt } = wrappedMessage.body;

  return createdAt;
}

export function getDeltaFromRestApiResponse(value): Delta {
  return new Delta(getJsonObjectProperty(value) as Delta);
}

export function getFileRecordFromRestResponse(file: FileRestResponse): FileRecordInterface {
  return File({
    ...file,
    timestamp: file.createdAt,
  });
}
