import { NotificationDbRow, ChangedPropertyInterface, ProjectDbRow, NotificationData, ListDbRow } from '../../db/schema';
import { Id } from '../../common/identifier';
import { Actor } from '../renderer/types';

/**
 * This object is passed to filter and resolver methods as a helper. Common tasks (like geting notification
 * actor) should not be coded in multiple places in code but implemented once and reused.
 * This class allows such reuse. For usage examples see NotificationDefinitions.ts
 */
export interface ChainableContextInterface {
  getNotification(): NotificationDbRow;

  getData(): NotificationData;

  getActor(): Promise<Actor>;

  getChangedProperty<T>(propertyName: keyof T): ChangedPropertyInterface;

  getProject(projectId: Id): Promise<ProjectDbRow>;

  getTaskList(taskListId: Id): Promise<ListDbRow>;
}
