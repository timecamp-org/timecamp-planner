import { CopyCardOptionsInterface } from '../types';

export const domain = 'TasksModel';

export const onTaskCreate = `${domain}/onTaskCreate`;
export const onTaskCreateSuccess = `${domain}/onTaskCreateSuccess`;

export const onCreateTaskInEmptyList = `${domain}/onCreateTaskInEmptyList`;

export const onTaskDelete = `${domain}/onTaskDelete`;
export const onTaskDeleteSuccess = `${domain}/onTaskDeleteSuccess`;

export const onTaskUpdate = `${domain}/onTaskUpdate`;

export const onAddToTaskPeople = `${domain}/onAddToTaskPeople`;
export const onRemoveFromTaskPeople = `${domain}/onRemoveFromTaskPeople`;
export const onChangeStatus = `${domain}/onChangeStatus`;
export const onUpdateName = `${domain}/onUpdateName`;
export const onChangeDueDate = `${domain}/onChangeDueDate`;
export const onChangeStartDate = `${domain}/onChangeStartDate`;
export const onMoveTaskTimespan = `${domain}/onMoveTaskTimespan`;
export const onChangeDescription = `${domain}/onChangeDescription`;

export const onChangeProgressEstimate = `${domain}/onChangeProgressEstimate`;
export const onSetIsWaitingToUpdateProgress = `${domain}/onSetIsWaitingToUpdateProgress`;

export const onMoveTask = `${domain}/onMoveTask`;
export const onMoveTaskSuccess = `${domain}/onMoveTaskSuccess`;

export const onMoveTaskInSections = `${domain}/onMoveTaskInSections`;

export const onArchiveTask = `${domain}/onArchiveTask`;
export const onUnarchiveTask = `${domain}/onUnarchiveTask`;

export const onCreateTaskData = `${domain}/onCreateTaskData`;
export const onUpdateTaskData = `${domain}/onUpdateTaskData`;

export const onUpdateTaskPeopleIds = `${domain}/onUpdateTaskPeopleIds`;

export const onUpdateTaskPerson = `${domain}/onUpdateTaskPeople`;
export const onAddTaskPerson = `${domain}/onAddTaskPerson`;
export const onRemoveTaskPerson = `${domain}/onRemoveTaskPerson`;

export const onUpdateTaskPeopleRole = `${domain}/onUpdateTaskPeopleRole`;

export const onAddUserToTaskFollowers = `${domain}/onAddUserToTaskFollowers`;
export const onAddUserToTaskFollowersSuccess = `${domain}/onAddUserToTaskFollowersSuccess`;

export const onRemoveUserFromTaskFollowers = `${domain}/onRemoveUserFromTaskFollowers`;
export const onRemoveUserFromTaskFollowersSuccess = `${domain}/onRemoveUserFromTaskFollowersSuccess`;

export const onRemoveUserFromTasksFollowers = `${domain}/onRemoveUserFromTasksFollowers`;
export const onAddTaskFollower = `${domain}/onAddTaskFollower`;
export const onRemoveTaskFollower = `${domain}/onRemoveTaskFollower`;

export const onCreateUserAndAddToSubscribers = `${domain}/onCreateUserAndAddToSubscribers`;

export const onMoveSection = `${domain}/onMoveSection`;

export const onCopySection = `${domain}/onCopySection`;

export const onCopyCard = `${domain}/onCopyCard`;

export const onCreateTaskAttachmentsIds = `${domain}/onCreateTaskAttachmentsIds`;

export const onBatchTasksSources = `${domain}/onBatchTasksSources`;

export const onAddFileToTaskAttachments = `${domain}/onAddFileToTaskAttachments`;
export const onAddFilesToTaskAttachments = `${domain}/onAddFilesToTaskAttachments`;
export const onAddFileToTaskAttachmentsSuccess = `${domain}/onAddFileToTaskAttachmentsSuccess`;

export const onDeleteTaskAttachment = `${domain}/onDeleteTaskAttachment`;
export const onDeleteTaskAttachmentSuccess = `${domain}/onDeleteTaskAttachmentSuccess`;

export const onCreateSpaceIfNoneAndCreateListIfNoneAndCreateCard = `${domain}/onCreateSpaceIfNoneAndCreateListIfNoneAndCreateCard`;

export const onFetchAllTaskAttachments = `${domain}/onFetchAllTaskAttachments`;
export const onFetchTaskDetails = `${domain}/onFetchTaskDetails`;
export const onFetchTaskDetailsSuccess = `${domain}/onFetchTaskDetailsSuccess`;

export const onAddTaskReaction = `${domain}/onAddTaskReaction`;
export const onAddTaskReactionSuccess = `${domain}/onAddTaskReactionSuccess`;

export const onRemoveTaskReaction = `${domain}/onRemoveTaskReaction`;
export const onRemoveTaskReactionSuccess = `${domain}/onRemoveTaskReactionSuccess`;

export const onUpdateTaskReactionData = `${domain}/onUpdateTaskReactionData`;
export const onRemoveTaskReactionData = `${domain}/onRemoveTaskReactionData`;

export const onAddFileIdToTaskFileIds = `${domain}/onAddFileIdToTaskFileIds`;
export const onBatchTaskFileIds = `${domain}/onBatchTaskFileIds`;

export const onSetIsTaskDescriptionDirty = `${domain}/onSetIsTaskDescriptionDirty`;

export const onSetUserLatestTaskVisitDate = `${domain}/onSetUserLatestTaskVisitDate`;

export const ALL_DAY_EVENT_MINUTES_THRESHOLD = 23.5 * 60;

export const DEFAULT_COPY_CARD_OPTIONS: CopyCardOptionsInterface = {
  withAttachments: true,
};

export const onResizeTaskTimePeriod = `${domain}/onResizeTaskTimePeriod`;

export const onSetTaskPriority = `${domain}/onSetTaskPriority`;
