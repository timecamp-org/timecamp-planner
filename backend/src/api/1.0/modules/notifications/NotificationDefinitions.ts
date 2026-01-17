import { ListDbRow, ProjectDbRow, TaskDbRow, TaskProgress } from '../db/schema';
import { NotificationContent, NotificationType } from './types';
import { ChainableRenderer } from './renderer/ChainableRenderer';
import { Filter } from './renderer/Filter';
import { NotificationContentProviderInterface } from './interfaces/NotificationContentProviderInterface';
import { NotificationRendererInterface } from './interfaces/NotificationRendererInterface';
import { get } from 'lodash';

export class NotificationDefinitions {
  static addDefinitions<T extends NotificationContent>(
    chain: NotificationRendererInterface<T>,
    provider: NotificationContentProviderInterface<T>
  ) {
    // User assigned/unassgined to/from task

    chain.add(
      ChainableRenderer.create(
        Filter.or(
          Filter.type(NotificationType.USER_ASSIGNED_TO_TASK),
          Filter.type(NotificationType.USER_UNASSIGNED_FROM_TASK)
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getNotification().notificationType ===
            NotificationType.USER_ASSIGNED_TO_TASK,
        ],
        provider.renderUserAssignedToTask.bind(provider)
      )
    );

    // User assigned/unassgined to/from checklist item

    chain.add(
      ChainableRenderer.create(
        Filter.or(
          Filter.type(NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM),
          Filter.type(
            NotificationType.USER_REMOVED_FROM_CHECKLIST_ITEM_ASSIGNEES
          )
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getNotification().notificationType ===
            NotificationType.USER_ASSIGNED_TO_CHECKLIST_ITEM,
        ],
        provider.renderUserAssignedToChecklistItem.bind(provider)
      )
    );

    // File attached to task
    chain.add(
      ChainableRenderer.create(
        Filter.type(NotificationType.FILE_ATTACHED_TO_TASK),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderFileAttached.bind(provider)
      )
    );

    // User mentioned on task
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.or(
            Filter.type(NotificationType.USER_MENTIONED),
            Filter.type(NotificationType.HAIL_MENTIONED)
          ),
          (ctx) => ctx.getData().taskId != null
        ),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderUserMentionedOnTask.bind(provider)
      )
    );

    // User mentioned on project
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.or(
            Filter.type(NotificationType.USER_MENTIONED),
            Filter.type(NotificationType.HAIL_MENTIONED)
          ),
          (ctx) => ctx.getData().taskId == null
        ),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderUserMentionedOnProject.bind(provider)
      )
    );

    // Message converted to task
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_CREATED),
          // task.messageId is not null
          (ctx) => !!ctx.getData().taskSourceMessageId
        ),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderMessageConvertedToTask.bind(provider)
      )
    );

    // Task created
    chain.add(
      ChainableRenderer.create(
        Filter.type(NotificationType.TASK_CREATED),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderTaskCreated.bind(provider)
      )
    );

    // Task list created
    chain.add(
      ChainableRenderer.create(
        Filter.type(NotificationType.TASK_LIST_CREATED),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderTaskListCreated.bind(provider)
      )
    );

    // Task list (un)archived
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_LIST_UPDATED),
          Filter.propertyChanged<ListDbRow>('isArchived')
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getChangedProperty<ListDbRow>('isArchived'),
        ],
        provider.renderTaskListArchived.bind(provider)
      )
    );

    // Task completed
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_UPDATED),
          Filter.propertyChanged<TaskDbRow>(
            'progress',
            (prop) => prop.new == TaskProgress.COMPLETE
          )
        ),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderTaskCompleted.bind(provider)
      )
    );

    // Task progress updated
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_UPDATED),
          Filter.propertyChanged<TaskDbRow>(
            'progress',
            (prop) => prop.new != TaskProgress.COMPLETE
          )
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getChangedProperty<TaskDbRow>('progress'),
        ],
        provider.renderProgressUpdated.bind(provider)
      )
    );

    // Due date removed
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_UPDATED),
          Filter.propertyChanged<TaskDbRow>('dueDate', (prop) => !prop.new)
        ),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderDueDateRemoved.bind(provider)
      )
    );

    // Due date added
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_UPDATED),
          Filter.propertyChanged<TaskDbRow>(
            'dueDate',
            (prop) => !prop.old && prop.new
          )
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getChangedProperty<TaskDbRow>('dueDate'),
        ],
        provider.renderDueDateAdded.bind(provider)
      )
    );

    // Due date changed
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_UPDATED),
          Filter.propertyChanged<TaskDbRow>(
            'dueDate',
            (prop) => prop.old && prop.new
          )
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getChangedProperty<TaskDbRow>('dueDate'),
        ],
        provider.renderDueDateChanged.bind(provider)
      )
    );

    // Task moved to list
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_UPDATED),
          Filter.propertyChanged<TaskDbRow>('taskListId')
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getTaskList(
            get(ctx.getChangedProperty<TaskDbRow>('taskListId'), 'old')
          ),
        ],
        provider.renderTaskMovedToAnotherList.bind(provider)
      )
    );

    // Task moved to another project
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_UPDATED),
          Filter.propertyChanged<TaskDbRow>('projectId')
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getProject(
            get(ctx.getChangedProperty<TaskDbRow>('projectId'), 'old')
          ),
        ],
        provider.renderTaskProjectChanged.bind(provider)
      )
    );

    // Task (un)archived
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.TASK_UPDATED),
          Filter.propertyChanged<TaskDbRow>('isArchived')
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getChangedProperty<TaskDbRow>('isArchived'),
        ],
        provider.renderTaskArchived.bind(provider)
      )
    );

    // Direct message
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.CONVERSATION_MESSAGE_SENT),
          Filter.not(Filter.propertyEmpty('messageValue'))
        ),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderNewDirectMessage.bind(provider)
      )
    );

    // TODO Correct place in chain?
    // File uploaded in chat (task & project)
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.CONVERSATION_MESSAGE_SENT),
          Filter.not(Filter.propertyEmpty('fileId'))
        ),
        (ctx) => [ctx.getActor(), ctx.getData()],
        provider.renderFileInChat.bind(provider)
      )
    );

    // User added to project
    chain.add(
      ChainableRenderer.create(
        Filter.type(NotificationType.USER_ADDED_TO_PROJECT),
        (ctx) => [
          ctx.getActor(),
          ctx.getProject(ctx.getData().projectId),
          true,
        ],
        provider.renderUserAddedOrRemovedToProject.bind(provider)
      )
    );

    // User removed from project
    chain.add(
      ChainableRenderer.create(
        Filter.type(NotificationType.USER_REMOVED_FROM_PROJECT),
        (ctx) => [
          ctx.getActor(),
          ctx.getProject(ctx.getData().projectId),
          false,
        ],
        provider.renderUserAddedOrRemovedToProject.bind(provider)
      )
    );

    // Privacy changed
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.PROJECT_UPDATED),
          Filter.propertyChanged<ProjectDbRow>('isPrivate')
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getChangedProperty<ProjectDbRow>('isPrivate'),
        ],
        provider.renderProjectPrivacyChanged.bind(provider)
      )
    );

    // Project archived
    chain.add(
      ChainableRenderer.create(
        Filter.and(
          Filter.type(NotificationType.PROJECT_UPDATED),
          Filter.propertyChanged<ProjectDbRow>('isArchived')
        ),
        (ctx) => [
          ctx.getActor(),
          ctx.getData(),
          ctx.getChangedProperty<ProjectDbRow>('isArchived'),
        ],
        provider.renderProjectArchived.bind(provider)
      )
    );

    // Invitation joined
    chain.add(
      ChainableRenderer.create(
        Filter.and(Filter.type(NotificationType.INVITATION_JOINED)),
        (ctx) => [ctx.getData()],
        provider.renderInvitationJoined.bind(provider)
      )
    );

    // Due date reminder
    chain.add(
      ChainableRenderer.create(
        Filter.and(Filter.type(NotificationType.DUE_DATE_REMINDER)),
        (ctx) => [ctx.getData()],
        provider.renderDueDateReminder.bind(provider)
      )
    );
  }
}
