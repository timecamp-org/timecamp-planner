import { __ } from 'i18n';
import { AbstractNotificationContentProvider } from './AbstractNotificationContentProvider';
import { NotificationContentProviderInterface } from '../interfaces/NotificationContentProviderInterface';
import { PushNotificationContent } from '../types';
import { QuillRendererInterface } from '../../messaging/interfaces/QuillRendererInterface';
import { JsonParserType } from '../../../../../utils';
import { Actor } from '../renderer/types';
import {
  ProjectDbRow,
  ChangedPropertyInterface,
  NotificationData,
  ListDbRow,
  ProjectType,
} from '../../db/schema';
import { DateFormatterServiceInterface } from '../../common/date/DateFormatterServiceInterface';
import { inject, injectable, named } from 'inversify';
import { CommonModule } from '../../common/CommonModule';
import { DateFlavor } from '../../common/date/types';
import { MessagingModule } from '../../messaging/MessagingModule';
import { SimpleMarkdownRendererInterface } from '../../messaging/interfaces/SimpleMarkdownRendererInterface';

/************************************************************
 *                         PUSH
 ************************************************************/
@injectable()
export class PushNotificationContentProvider
  extends AbstractNotificationContentProvider
  implements NotificationContentProviderInterface<PushNotificationContent>
{
  constructor(
    @inject(CommonModule.DateFormatterServiceInterface)
      dateFormatter: DateFormatterServiceInterface,
    @inject(MessagingModule.QuillRendererInterface)
    @named('PlainText')
      quillRenderer: QuillRendererInterface,
    @inject(CommonModule.JsonParserType) fromJson: JsonParserType,
    @inject(MessagingModule.SimpleMarkdownRendererInterface)
    @named('PlainRenderer')
      markdownRenderer: SimpleMarkdownRendererInterface
  ) {
    super(dateFormatter, quillRenderer, fromJson, markdownRenderer);
  }

  async renderNewDirectMessage(
    actor: Actor,
    data: NotificationData
  ): Promise<PushNotificationContent> {
    return {
      title: __('New message from %s', actor.getDisplayName()),
      //todo format message from source
      content: await this.renderMessage(data.messageValue),
    };
  }

  async renderMessageConvertedToTask(
    actor: Actor,
    data: NotificationData
  ): Promise<PushNotificationContent> {
    const message = await this.renderMessage(data.messageValue);

    return {
      title: __('Your message is card now by %s', actor.getDisplayName()),
      content: `${data.projectValue}, ${data.taskListValue}: ${message}`,
    };
  }

  renderUserAddedOrRemovedToProject(
    actor: Actor,
    project: ProjectDbRow,
    isAdded: boolean
  ): PushNotificationContent {
    const adjective = project.isPrivate ? __('private') : __('public');
    const title = isAdded
      ? __(
        'You are invited to a %s space by %s',
        adjective,
        actor.getDisplayName()
      )
      : __('You are removed from space by %s', actor.getDisplayName());
    return {
      title,
      content: project ? project.name : null,
    };
  }

  renderProjectPrivacyChanged(
    actor: Actor,
    data: NotificationData,
    privacy: ChangedPropertyInterface
  ): PushNotificationContent {
    const privacyStr = privacy.new ? __('private') : __('public');
    return {
      title: __('Space privacy changed by %s', actor.getDisplayName()),
      content: __('%s is %s now', data.projectValue, privacyStr),
    };
  }

  renderProjectArchived(
    actor: Actor,
    data: NotificationData,
    isArchived: ChangedPropertyInterface
  ) {
    const participle = isArchived.new ? __('archived') : __('unarchived');
    return {
      title: __('Space %s by %s', participle, actor.getDisplayName()),
      content: __('%s is %s now', data.projectValue, participle),
    };
  }

  renderInvitationJoined(data: NotificationData) {
    return {
      title: __(
        '%s joined your WorkSpace using your shared link.',
        data.userValue
      ),
      content: null,
    };
  }

  public renderTaskProjectChanged(
    actor: Actor,
    data: NotificationData,
    oldProject: ProjectDbRow
  ): PushNotificationContent {
    return {
      title: __('Moved card by %s', actor.getDisplayName()),
      content: __(
        '%s from %s to %s (%s)',
        data.taskValue,
        oldProject ? oldProject.name : '',
        data.projectValue,
        data.taskListValue
      ),
    };
  }

  public renderTaskMovedToAnotherList(
    actor: Actor,
    data: NotificationData,
    oldList: ListDbRow
  ): PushNotificationContent {
    return {
      title: __('Moved card by %s', actor.getDisplayName()),
      content: __(
        '%s from %s to %s (%s)',
        data.taskValue,
        oldList ? oldList.name : '',
        data.taskListValue,
        data.projectValue
      ),
    };
  }

  public renderFileAttached(
    actor: Actor,
    data: NotificationData
  ): PushNotificationContent {
    return {
      title: __('New file by %s', actor.getDisplayName()),
      content: __(
        '%s on %s',
        data.fileValue,
        PushNotificationContentProvider.printTaskShortPath(data)
      ),
    };
  }

  public renderFileInChat(
    actor: Actor,
    data: NotificationData
  ): PushNotificationContent {
    return {
      title: __('File uploaded by %s', actor.getDisplayName()),
      content: __(
        PushNotificationContentProvider.printFormat(data),
        data.fileValue,
        PushNotificationContentProvider.printShortPath(data)
      ),
    };
  }

  public async renderUserMentionedOnTask(
    actor: Actor,
    data: NotificationData
  ): Promise<PushNotificationContent> {
    return {
      title: __(
        'You have been mentioned by %s on %s',
        actor.getDisplayName(),
        data.taskValue
      ),
      content: await this.renderMessage(data.messageValue),
    };
  }

  async renderUserMentionedOnProject(
    actor: Actor,
    data: NotificationData
  ): Promise<PushNotificationContent> {
    return {
      title: __(
        'You have been mentioned by %s in %s',
        actor.getDisplayName(),
        data.projectValue
      ),
      content: await this.renderMessage(data.messageValue),
    };
  }

  public renderUserAssignedToTask(
    actor: Actor,
    data: NotificationData,
    isAdded: boolean
  ): PushNotificationContent {
    const verb = isAdded ? __('assigned') : __('unassgined');
    return {
      title: __('You got %s by %s', verb, actor.getDisplayName()),
      content: PushNotificationContentProvider.printTaskShortPath(data),
    };
  }

  public renderUserAssignedToChecklistItem(
    actor: Actor,
    data: NotificationData,
    isAdded: boolean
  ): PushNotificationContent {
    const verb = isAdded ? __('assigned') : __('unassgined');

    return {
      title: __('You got %s by %s', verb, actor.getDisplayName()),
      content:
        PushNotificationContentProvider.printChecklistItemShortPath(data),
    };
  }

  public renderTaskListCreated(
    actor: Actor,
    data: NotificationData
  ): PushNotificationContent {
    return {
      title: __('New list by %s', actor.getDisplayName()),
      content: PushNotificationContentProvider.printListPath(data),
    };
  }

  public renderTaskArchived(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): PushNotificationContent {
    const verb = changedProperty.new ? __('archived') : __('unarchived');
    return {
      title: __('%s card by %s', verb.upperCaseFirst(), actor.getDisplayName()),
      content: PushNotificationContentProvider.getTaskFullPath(data),
    };
  }

  public renderDueDateAdded(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): PushNotificationContent {
    return {
      title: __('New due date by %s', actor.getDisplayName()),
      content: __(
        '%s set in %s',
        this.dateFormatter.format(
          changedProperty.new,
          DateFlavor.DUE_DATE_SHORT
        ),
        PushNotificationContentProvider.printTaskShortPath(data)
      ),
    };
  }

  public renderDueDateChanged(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): PushNotificationContent {
    return {
      title: __('Due date changed by %s', actor.getDisplayName()),
      content: __(
        '%s in %s',
        this.dateFormatter.format(
          changedProperty.new,
          DateFlavor.DUE_DATE_SHORT
        ),
        PushNotificationContentProvider.printTaskShortPath(data)
      ),
    };
  }

  public renderDueDateRemoved(
    actor: Actor,
    data: NotificationData
  ): PushNotificationContent {
    return {
      title: __('Due date removed by %s', actor.getDisplayName()),
      content: PushNotificationContentProvider.printTaskShortPath(data),
    };
  }

  public renderDueDateReminder(
    data: NotificationData
  ): PushNotificationContent {
    return {
      title: __('Upcoming due date'),
      content: __(
        'You have upcoming due date in card %s',
        PushNotificationContentProvider.printTaskShortPath(data)
      ),
    };
  }

  public renderProgressUpdated(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): PushNotificationContent {
    return {
      title: __('Progress updated by %s', actor.getDisplayName()),
      content: __(
        '%s%% in %s',
        changedProperty.new,
        PushNotificationContentProvider.printTaskShortPath(data)
      ),
    };
  }

  public renderTaskCompleted(
    actor: Actor,
    data: NotificationData
  ): PushNotificationContent {
    return {
      title: __('Completed card by %s', actor.getDisplayName()),
      content: PushNotificationContentProvider.getTaskFullPath(data),
    };
  }

  public renderTaskCreated(
    actor: Actor,
    data: NotificationData
  ): PushNotificationContent {
    return {
      title: __('New card by %s', actor.getDisplayName()),
      content: PushNotificationContentProvider.getTaskFullPath(data),
    };
  }

  public renderTaskListArchived(
    actor: Actor,
    data: NotificationData,
    changedProp: ChangedPropertyInterface
  ): PushNotificationContent {
    const verb = changedProp.new ? __('archived') : __('unarchived');
    return {
      title: __('%s list by %s', verb.upperCaseFirst(), actor.getDisplayName()),
      content: PushNotificationContentProvider.printListPath(data),
    };
  }

  /**
   * Prints: "ChecklistItemName in TaskName", or "ChecklistItemName" if no task is set.
   * @param {NotificationData} data
   */
  private static printChecklistItemShortPath(data: NotificationData): string {
    if (data.taskId) {
      return __('%s in %s', data.checklistItemValue, data.taskValue);
    } else {
      return data.checklistItemValue;
    }
  }

  /**
   * Prints: "CardName on SpaceName", or "CardName" if no project is set.
   * @param {NotificationData} data
   */
  private static printTaskShortPath(data: NotificationData): string {
    if (data.projectId) {
      return __('%s in %s', data.taskValue, data.projectValue);
    } else {
      return data.taskValue;
    }
  }

  /**
   * Prints "CardName in ListName on ProjectName" OR "cardName" if not in project OR short path if not in list.
   * @param {NotificationData} data
   * @return {string}
   */
  private static getTaskFullPath(data: NotificationData): string {
    if (data.taskListId) {
      return __(
        '%s on %s in %s',
        data.taskValue,
        data.taskListValue,
        data.projectValue
      );
    } else {
      return PushNotificationContentProvider.printTaskShortPath(data);
    }
  }

  private static printListPath(data: NotificationData): string {
    return __('%s on %s', data.taskListValue, data.projectValue);
  }

  private static printShortPath(data: NotificationData) {
    if (data.taskValue) {
      return PushNotificationContentProvider.printTaskShortPath(data);
    } else if (data.projectType === ProjectType.PROJECT) {
      return data.projectValue;
    } else {
      return 'conversation';
    }
  }

  private static printFormat(data: NotificationData) {
    if (data.projectType !== ProjectType.PROJECT) {
      return '%s in %s';
    } else {
      return '%s on %s';
    }
  }
}
