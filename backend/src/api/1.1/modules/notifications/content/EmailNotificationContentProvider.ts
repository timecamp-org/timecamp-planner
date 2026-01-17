import { __ } from 'i18n';
import { AbstractNotificationContentProvider } from './AbstractNotificationContentProvider';
import { NotificationContentProviderInterface } from '../interfaces/NotificationContentProviderInterface';
import { NotificationContent } from '../types';
import { UrlGeneratorInterface } from '../../common/UrlGenerator';
import { QuillRendererInterface } from '../../messaging/interfaces/QuillRendererInterface';
import { JsonParserType } from '../../../../../utils';
import { Actor } from '../renderer/types';
import {
  ChangedPropertyInterface,
  NotificationData,
  ProjectDbRow,
  ProjectType,
} from '../../db/schema';
import { FrontendRoute } from '../../../../../config/frontendRoutes.config';
import { inject, injectable, named } from 'inversify';
import { CommonModule } from '../../common/CommonModule';
import { DateFormatterServiceInterface } from '../../common/date/DateFormatterServiceInterface';
import { DateFlavor } from '../../common/date/types';
import { MessagingModule } from '../../messaging/MessagingModule';
import { SimpleMarkdownRendererInterface } from '../../messaging/interfaces/SimpleMarkdownRendererInterface';

/************************************************************
 *                         Email
 ************************************************************/
@injectable()
export class EmailNotificationContentProvider
  extends AbstractNotificationContentProvider
  implements NotificationContentProviderInterface<NotificationContent>
{
  protected urlGenerator: UrlGeneratorInterface;

  constructor(
    @inject(CommonModule.DateFormatterServiceInterface)
      dateFormatter: DateFormatterServiceInterface,
    @inject(MessagingModule.QuillRendererInterface)
    @named('Html')
      quillRenderer: QuillRendererInterface,
    @inject(CommonModule.JsonParserType) fromJson: JsonParserType,
    @inject(CommonModule.UrlGenerator) urlGenerator: UrlGeneratorInterface,
    @inject(MessagingModule.SimpleMarkdownRendererInterface)
    @named('HtmlRenderer')
      markdownRenderer: SimpleMarkdownRendererInterface
  ) {
    super(dateFormatter, quillRenderer, fromJson, markdownRenderer);
    this.urlGenerator = urlGenerator;
  }

  async renderUserMentionedOnTask(
    actor: Actor,
    data: NotificationData
  ): Promise<NotificationContent> {
    return {
      content: __(
        '<b>{{actorName}}</b> mentioned you on {{{taskPath}}}:<br/>{{{messageContent}}}',
        {
          actorName: actor.getDisplayName(),
          taskPath: this.getTaskShortPath(data),
          messageContent: await this.renderMessage(data.messageValue),
        }
      ),
    };
  }

  async renderUserMentionedOnProject(
    actor: Actor,
    data: NotificationData
  ): Promise<NotificationContent> {
    return {
      content: __(
        '<b>{{actorName}}</b> mentioned you in {{{projectLink}}}:<br/>{{{messageContent}}}',
        {
          actorName: actor.getDisplayName(),
          projectLink: this.getProjectHref(data),
          messageContent: await this.renderMessage(data.messageValue),
        }
      ),
    };
  }

  renderUserAssignedToTask(
    actor: Actor,
    data: NotificationData,
    isAdded: boolean
  ): NotificationContent {
    return {
      content: __(
        isAdded
          ? '<b>{{actorName}}</b> added you as assignee to {{{taskPath}}}'
          : '<b>{{actorName}}</b> removed you as assignee from {{{taskPath}}}',
        {
          actorName: actor.getDisplayName(),
          taskPath: this.getTaskShortPath(data),
        }
      ),
    };
  }

  renderUserAssignedToChecklistItem(
    actor: Actor,
    data: NotificationData,
    isAdded: boolean
  ): NotificationContent {
    return {
      content: __(
        isAdded
          ? '<b>{{actorName}}</b> added you as assignee to {{{checklistItemPath}}}'
          : '<b>{{actorName}}</b> removed you as assignee from {{{checklistItemPath}}}',
        {
          actorName: actor.getDisplayName(),
          checklistItemPath: this.getChecklistItemShortPath(data),
        }
      ),
    };
  }

  renderTaskListCreated(
    actor: Actor,
    data: NotificationData
  ): NotificationContent {
    return {
      content: __(
        '{{actorName}} created a new list {{listName}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          listName: data.taskListValue,
          projectLink: this.getProjectHref(data),
        }
      ),
    };
  }

  renderTaskArchived(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): NotificationContent {
    const verb = changedProperty.new ? __('archived') : __('unarchived');
    return {
      content: __(
        '<b>{{actorName}}</b> {{verb}} card {{{taskLink}}} on {{listName}} in {{{projectLink}}}',
        {
          verb,
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          projectLink: this.getProjectHref(data),
          listName: data.taskListValue,
        }
      ),
    };
  }

  renderDueDateAdded(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> set the due date to {{date}} for {{{taskLink}}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          projectLink: this.getProjectHref(data),
          date: this.dateFormatter.format(
            changedProperty.new,
            DateFlavor.DUE_DATE_SHORT
          ),
        }
      ),
    };
  }

  renderDueDateChanged(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> changed the due date to {{date}} for {{{taskLink}}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          projectLink: this.getProjectHref(data),
          date: this.dateFormatter.format(
            changedProperty.new,
            DateFlavor.DUE_DATE_SHORT
          ),
        }
      ),
    };
  }

  renderDueDateRemoved(
    actor: Actor,
    data: NotificationData
  ): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> removed the due date from {{{taskLink}}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          projectLink: this.getProjectHref(data),
        }
      ),
    };
  }

  renderProgressUpdated(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> changed card progress to {{progress}}% for {{{taskLink}}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          projectLink: this.getProjectHref(data),
          progress: changedProperty.new,
        }
      ),
    };
  }

  renderTaskCompleted(
    actor: Actor,
    data: NotificationData
  ): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> completed a card {{{taskLink}}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          projectLink: this.getProjectHref(data),
        }
      ),
    };
  }

  renderTaskCreated(actor: Actor, data: NotificationData): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> created a new card {{{taskLink}}} on {{listName}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          listName: data.taskListValue,
          projectLink: this.getProjectHref(data),
        }
      ),
    };
  }

  renderTaskProjectChanged(
    actor: Actor,
    data: NotificationData,
    oldProject: ProjectDbRow
  ): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> moved card {{{taskLink}}} from {{{oldProjectLink}}} to {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          projectLink: this.getProjectHref(data),
          oldProjectLink: oldProject
            ? this.getProjectHref({
              projectId: oldProject.id,
              projectValue: oldProject.name,
            })
            : null,
        }
      ),
    };
  }

  renderTaskMovedToAnotherList(
    actor: Actor,
    data: NotificationData
  ): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> moved card {{{taskLink}}} to {{listName}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          taskLink: this.getTaskHref(data),
          projectLink: this.getProjectHref(data),
          listName: data.taskListValue,
        }
      ),
    };
  }

  renderTaskListArchived(
    actor: Actor,
    data: NotificationData,
    changedProp: ChangedPropertyInterface
  ): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> archived list {{listName}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          projectLink: this.getProjectHref(data),
          listName: data.taskListValue,
        }
      ),
    };
  }

  renderFileAttached(
    actor: Actor,
    data: NotificationData
  ): NotificationContent {
    return {
      content: __(
        // TODO Center the file vertically?
        '<b>{{actorName}}</b> attached {{uploadedObjectNoun}} to {{{taskLink}}} in {{{projectLink}}}:<br/><br/>{{{downloadLink}}}',
        {
          actorName: actor.getDisplayName(),
          projectLink: this.getProjectHref(data),
          taskLink: this.getTaskHref(data),
          fileName: data.fileValue,
          uploadedObjectNoun: this.getUploadedObjectNoun(data),
          downloadLink: this.getDownloadLink(data),
        }
      ),
    };
  }

  renderFileInChat(actor: Actor, data: NotificationData): NotificationContent {
    const uploadedObjectNoun = this.getUploadedObjectNoun(data);

    //TODO Missing file icon.
    const downloadLink = this.getDownloadLink(data);

    const replacements = {
      actorName: actor.getDisplayName(),
      fileName: data.fileValue,
      projectName: data.projectValue, // Unused if DIRECT_CHAT
      uploadedObjectNoun,
      downloadLink,
    };

    const content =
      data.projectType === ProjectType.DIRECT_CHAT
        ? __(
          '<b>{{actorName}}</b> uploaded you {{uploadedObjectNoun}}:<br/>{{{downloadLink}}}',
          replacements
        )
        : __(
          '<b>{{actorName}}</b> uploaded {{uploadedObjectNoun}} to conversation <b>{{projectName}}</b>:<br/>{{{downloadLink}}}',
          replacements
        );
    return {
      content,
    } as NotificationContent;
  }

  private getUploadedObjectNoun(data: NotificationData) {
    return data.fileIsImage ? __('an image') : __('a file');
  }

  private getDownloadLink(data: NotificationData) {
    return data.fileIsImage
      ? __(
        '<a href="{{{url}}}" title="{{name}}"><img src="{{{thumbUrl}}}" alt="{{name}}"/></a>',
        {
          url: data.fileUrl,
          thumbUrl: data.fileThumbUrl,
          name: data.fileValue || '',
        }
      )
      : __('<a href="{{{url}}}" title="{{fileName}}">{{fileName}}</a>', {
        fileName: data.fileValue,
        url: data.fileUrl,
      });
  }

  async renderNewDirectMessage(
    actor: Actor,
    data: NotificationData
  ): Promise<NotificationContent> {
    // TODO Avatars?
    const messageType =
      data.projectType === ProjectType.DIRECT_CHAT ? 'direct' : 'group';
    return {
      content: __(
        'New {{messageType}} message from <b>{{actorName}}</b>:<br/>{{{messageContent}}}',
        {
          actorName: actor.getDisplayName(),
          messageContent: await this.renderMessage(data.messageValue),
          messageType,
        }
      ),
    };
  }

  async renderMessageConvertedToTask(
    actor: Actor,
    data: NotificationData
  ): Promise<NotificationContent> {
    return {
      content: __(
        '<b>{{actorName}}</b> added your message {{{taskLink}}} to list {{listName}} in {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          projectLink: this.getProjectHref(data),
          taskLink: this.getTaskHref(data),
          listName: data.taskListValue,
        }
      ),
    };
  }

  renderUserAddedOrRemovedToProject(
    actor: Actor,
    project: ProjectDbRow,
    isAdded: boolean
  ): NotificationContent {
    const privacy = project.isPrivate ? __('private') : __('public');
    return {
      content: __(
        '<b>{{actorName}}</b> invited you to {{privacy}} space {{{projectLink}}}',
        {
          actorName: actor.getDisplayName(),
          projectLink: project
            ? this.getProjectHref({
              projectId: project.id,
              projectValue: project.name,
            })
            : null,
          privacy,
        }
      ),
    };
  }

  renderProjectPrivacyChanged(
    actor: Actor,
    data: NotificationData,
    privacy: ChangedPropertyInterface
  ): NotificationContent {
    const privacyString = privacy.new ? __('private') : __('public');
    return {
      content: __(
        '<b>{{actorName}}</b> made space {{{projectLink}}} {{privacyString}}',
        {
          actorName: actor.getDisplayName(),
          projectLink: this.getProjectHref(data),
          privacyString,
        }
      ),
    };
  }

  renderProjectArchived(
    actor: Actor,
    data: NotificationData,
    isArchived: ChangedPropertyInterface
  ): NotificationContent {
    const verb = isArchived.new ? __('archived') : __('unarchived');
    return {
      content: __('<b>{{actorName}}</b> {{verb}} space {{{projectLink}}}', {
        actorName: actor.getDisplayName(),
        projectLink: this.getProjectHref(data),
        verb,
      }),
    };
  }

  renderInvitationJoined(data: NotificationData): NotificationContent {
    return {
      content: __(
        '<b>{{actorName}}</b> joined your WorkSpace using your shared link.',
        {
          actorName: data.userValue,
        }
      ),
    };
  }

  renderDueDateReminder(data: NotificationData): NotificationContent {
    return {
      content: __('You have upcoming due date to card {{{taskLink}}}', {
        taskLink: this.getTaskHref(data),
      }),
    };
  }

  /**
   * Prints: "<a href=..>CardName</a> on <a ..>ProjecName</a>" or simply "<a..>CardName</a>"
   *
   * @param {NotificationData} data
   * @return {string}
   */
  private getTaskShortPath(data: NotificationData): string {
    const taskHref = this.getTaskHref(data);
    if (data.projectId) {
      const projectHref = this.getProjectHref(data);

      return __('{{{taskLink}}} on {{{projectLink}}}', {
        taskLink: taskHref,
        projectLink: projectHref,
      });
    } else {
      return taskHref;
    }
  }

  /**
   * Prints: "ChecklistItemName in <a href=..>CardName</a> on <a ..>ProjecName</a>" or simply "<a..>CardName</a>"
   *
   * @param {NotificationData} data
   * @return {string}
   */
  private getChecklistItemShortPath(data: NotificationData): string {
    const checklistItemName = this.getChecklistItemName(data);
    const taskHref = this.getTaskHref(data);
    if (data.projectId) {
      const projectHref = this.getProjectHref(data);

      return __(
        '{{{checklistItemName}}} in {{{taskLink}}} on {{{projectLink}}}',
        {
          checklistItemName,
          taskLink: taskHref,
          projectLink: projectHref,
        }
      );
    } else {
      return taskHref;
    }
  }

  private getChecklistItemName(data: Partial<NotificationData>) {
    return __('{{{checklistItemName}}}', {
      checklistItemName: data.checklistItemValue,
    });
  }

  private getProjectHref(data: Partial<NotificationData>) {
    const url = this.urlGenerator.generate(FrontendRoute.PROJECT, {
      projectId: data.projectId,
    });
    return __('<a href="{{{url}}}">{{projectName}}</a>', {
      url,
      projectName: data.projectValue,
    });
  }

  private getTaskHref(data: Partial<NotificationData>) {
    const { taskId, projectId } = data;
    let url = this.urlGenerator.generate(FrontendRoute.TASK, {
      taskId,
    });
    if (projectId) {
      url = this.urlGenerator.generate(FrontendRoute.TASK_IN_PROJECT, {
        taskId,
        projectId,
      });
    }

    return __('<a href="{{{url}}}">{{taskName}}</a>', {
      url,
      taskName: data.taskValue,
    });
  }
}
