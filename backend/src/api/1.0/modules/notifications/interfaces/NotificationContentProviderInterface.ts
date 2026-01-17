import { Actor } from '../renderer/types';
import {
  NotificationData,
  ChangedPropertyInterface,
  ProjectDbRow,
  ListDbRow,
} from '../../db/schema';
import { NotificationContent } from '../types';

/**
 * This interface returns a bunch of methods to generate PURE TEXTS.
 */
export interface NotificationContentProviderInterface<
  T extends NotificationContent
> {
  renderUserMentionedOnTask(actor: Actor, data: NotificationData): Promise<T>;

  renderUserMentionedOnProject(
    actor: Actor,
    data: NotificationData
  ): Promise<T>;

  renderUserAssignedToTask(
    actor: Actor,
    data: NotificationData,
    isAdded: boolean
  ): T;

  renderUserAssignedToChecklistItem(
    actor: Actor,
    data: NotificationData,
    isAdded: boolean
  ): T;

  renderTaskListCreated(actor: Actor, data: NotificationData): T;

  renderTaskArchived(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): T;

  renderDueDateAdded(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): T;

  renderDueDateChanged(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): T;

  renderDueDateRemoved(actor: Actor, data: NotificationData): T;

  renderProgressUpdated(
    actor: Actor,
    data: NotificationData,
    changedProperty: ChangedPropertyInterface
  ): T;

  renderTaskCompleted(actor: Actor, data: NotificationData): T;

  renderTaskCreated(actor: Actor, data: NotificationData): T;

  renderTaskProjectChanged(
    actor: Actor,
    data: NotificationData,
    oldProject: ProjectDbRow
  ): T;

  renderTaskMovedToAnotherList(
    actor: Actor,
    data: NotificationData,
    oldList: ListDbRow
  ): T;

  renderTaskListArchived(
    actor: Actor,
    data: NotificationData,
    changedProp: ChangedPropertyInterface
  ): T;

  renderFileAttached(actor: Actor, data: NotificationData): T;

  renderFileInChat(actor: Actor, data: NotificationData): T;

  renderNewDirectMessage(actor: Actor, data: NotificationData): Promise<T>;

  renderMessageConvertedToTask(
    actor: Actor,
    data: NotificationData
  ): Promise<T>;

  renderUserAddedOrRemovedToProject(
    actor: Actor,
    project: ProjectDbRow,
    isAdded: boolean
  ): T;

  renderProjectPrivacyChanged(
    actor: Actor,
    data: NotificationData,
    privacy: ChangedPropertyInterface
  ): T;

  renderProjectArchived(
    actor: Actor,
    data: NotificationData,
    isArchived: ChangedPropertyInterface
  ): T;

  renderInvitationJoined(data: NotificationData): T;

  renderDueDateReminder(data: NotificationData): T;
}
