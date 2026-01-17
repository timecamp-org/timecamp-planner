import { Record, fromJS } from 'immutable'
import { NotificationInterface, NotificationType, NotificationSettingsInterface, NotificationExternalDataInterface, ChangedProperty } from './types';
import { Id } from '../../../utils/identifier';
import { ProjectType } from '../ProjectsModel/types';

const defaultNotification: NotificationInterface = {
  id: undefined,
  type: undefined,
  organizationId: null,
  creationTimestamp: 0,
  isArchived: false,
  readAt: null,
  actorId: null,
  containerId: null,
}


export class Notification extends Record(defaultNotification) implements NotificationInterface {
  public readonly id!: Id
  public readonly type!: NotificationType
  public readonly organizationId!: Id
  public readonly creationTimestamp!: number
  public readonly isArchived!: boolean
  public readonly readAt!: number
  public readonly actorId!: Id
  public readonly containerId!: Id

  public constructor(values?: Partial<NotificationInterface>) {
    values ? super(values) : super()
  }
}

const defaultNotificationSettings: NotificationSettingsInterface = {
  emailNotifications: false,
  mobileNotifications: false,
  pushNotifications: false,
  soundNotifications: false,
}

export class NotificationsSettings extends Record(defaultNotificationSettings) implements NotificationSettingsInterface {
  public readonly emailNotifications!: boolean
  public readonly mobileNotifications!: boolean
  public readonly pushNotifications!: boolean
  public readonly soundNotifications!: boolean


  public constructor(values?: Partial<NotificationSettingsInterface>) {
    values ? super(values) : super()
  }
}

const defaultNotificationExternalData = {
  projectId: null,
  projectValue: null,
  projectType: null,

  taskListId: null,
  taskListValue: null,

  taskId: null,
  taskValue: null,
  taskSourceMessageId: null,
  taskSourceMessageOwnerId: null,

  checklistItemId: null,
  checklistItemValue: null,

  messageId: null,
  messageValue: null,

  conversationId: null,

  userId: null,
  userValue: null,

  fileId: null,
  fileValue: null,

  changedProps: null
}

export class NotificationExternalData extends Record(defaultNotificationExternalData) implements NotificationExternalDataInterface {
  public readonly projectId: Id
  public readonly projectValue: string
  public readonly projectType: ProjectType

  public readonly taskListId: Id
  public readonly taskListValue: string

  public readonly taskId: Id
  public readonly taskValue: string
  public readonly taskSourceMessageId: Id
  public readonly taskSourceMessageOwnerId: Id

  public readonly messageId: Id
  public readonly messageValue: string

  public readonly conversationId?: Id

  public readonly userId: Id
  public readonly userValue: string

  public readonly fileId: Id
  public readonly fileValue: string

  public readonly changedProps: ChangedProperty[]


  public constructor(values?: Partial<NotificationExternalDataInterface>) {
    values ? super(fromJS(values)) : super()
  }
}
