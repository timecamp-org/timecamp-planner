import get from 'lodash/get'
import { EnabledStatus, TargetType, FieldType, ExtensionNamespace } from '../types';

const statuses = {
  [ExtensionNamespace.AGILE]: {
    [TargetType.ORGANIZATION]: FieldType.ENABLED_STATUS,
    [TargetType.PROJECT]: EnabledStatus.ESTIMATES_ENABLED,
  },
  [ExtensionNamespace.TASK_VOTING]: {
    [TargetType.ORGANIZATION]: FieldType.ENABLED_STATUS,
    [TargetType.PROJECT]: EnabledStatus.VOTING_ENABLED,
  },
  [ExtensionNamespace.TASK_RECURRENCE]: {
    [TargetType.ORGANIZATION]: FieldType.ENABLED_STATUS,
    [TargetType.PROJECT]: EnabledStatus.RECURRING_TASKS_ENABLED,
  },
  [ExtensionNamespace.KANBAN_LIMITS]: {
    [TargetType.ORGANIZATION]: FieldType.ENABLED_STATUS,
    [TargetType.PROJECT]: EnabledStatus.KANBAN_LIMITS_ENABLED,
  },
}

export default function getEnabledStatusField(extensionNamespace, targetType) {
  return get(statuses, `${extensionNamespace}.${targetType}`)
}
