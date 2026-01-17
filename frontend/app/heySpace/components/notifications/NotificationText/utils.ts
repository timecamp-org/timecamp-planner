import { i18n } from '../../../../common/i18n';
import { EntityType, EntityStatus } from '../../../../common/models/domain/EntityModel/types';
import { ChangedProperty } from '../../../../common/models/domain/NotificationsModel/types';

enum NotificationContext {
  FROM = 'from',
  IN = 'in',
  NONE = 'none',
}

export function getContainerAlias(context: NotificationContext, containerType: EntityType): string {
  // It needs to be inside function. When user chenges language this function needs to get fresh traslations.
  const contextAliases = {
    from: {
      task: i18n.t('notification|from|task'),
      project: i18n.t('notification|from|project'),
      taskList: i18n.t('notification|from|list'),
      checklistItem: i18n.t('notification|from|checklist_item'),
    },
    in: {
      task: i18n.t('notification|in|task'),
      project: i18n.t('notification|in|project'),
      taskList: i18n.t('notification|in|list'),
      checklistItem: i18n.t('notification|in|checklist_item'),
    },
    none: {
      task: i18n.t('notification|task'),
      project: i18n.t('notification|project'),
      taskList: i18n.t('notification|list'),
      checklistItem: i18n.t('notification|checklist_item'),
    },
  };

  return contextAliases[context || 'none'][containerType];
}

export function isArchivedChange(change: ChangedProperty): boolean {
  const newValue = change.get('new');
  const propertyName = change.get('propertyName');
  return (
    propertyName === 'isArchived' ||
    (propertyName === 'status' && [EntityStatus.ARCHIVED, EntityStatus.EXISTS].includes(newValue))
  );
}
