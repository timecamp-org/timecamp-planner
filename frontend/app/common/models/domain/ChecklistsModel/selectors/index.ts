import createCachedSelector from 're-reselect'
import generateSelectorName from '../../../../utils/generateSelectorName'
import { selectCurrentUserId, selectUsersSearchName } from 'models/domain/UsersModel/selectors/domain'
import { selectProjectAvailableAssignees } from 'models/domain/ProjectsModel/selectors'
import { selectTasksColors } from 'models/domain/TasksModel/selectors'
import { selectProjectIdsByTaskIdsDomain } from 'models/domain/TasksModel/selectors/domain'
import { sortTaskAssignees } from 'models/domain/TasksModel/helpers'
import { List } from "immutable"
import { Id } from 'common/utils/identifier'
import {
  selectChecklistItemAssigneeIds,
  selectTaskIdByChecklistItemId
} from 'models/domain/ChecklistsModel/selectors/domain'


// args: checklistItemId
export const selectAlphabeticallySortedChecklistItemAssigneeIds = createCachedSelector(
  selectChecklistItemAssigneeIds,
  selectUsersSearchName,
  selectCurrentUserId,
  (checklistAssigneeIds, usersSearchName, currentUserId) => sortTaskAssignees(checklistAssigneeIds, usersSearchName, currentUserId)
)
(
  (_, args) => generateSelectorName(args, ['checklistItemId']),
)

// args: checklistItemId, projectId
export const selectAlphabeticallySortedAvailableChecklistItemAssigneeIds = createCachedSelector(
  selectChecklistItemAssigneeIds,
  selectUsersSearchName,
  selectProjectAvailableAssignees,
  selectCurrentUserId,
  (checklistAssigneeIds, usersSearchName, projectAvailableAssigneeIds, currentUserId) => sortTaskAssignees(projectAvailableAssigneeIds
    .filter(userId => !checklistAssigneeIds.includes(userId)) as List<Id>, usersSearchName, currentUserId)
)
(
  (_, args) => generateSelectorName(args, ['checklistItemId', 'projectId']),
)


// args: checklistItemId
export const selectProjectIdByChecklistItemId = createCachedSelector(
  selectProjectIdsByTaskIdsDomain,
  selectTaskIdByChecklistItemId,
  (projectIdByTaskIdDomain, taskId) => projectIdByTaskIdDomain.get(taskId),
)
(
  (_, args) => generateSelectorName(args, ['checklistItemId']),
)


// args: checklistItemId
export const selectChecklistItemColor = createCachedSelector(
  selectTaskIdByChecklistItemId,
  selectTasksColors,
  (taskId, tasksColors) => tasksColors.get(taskId),
)
(
  (_, args) => generateSelectorName(args, ['checklistItemId']),
)
