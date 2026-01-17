export enum EntityType {
  // Alphabetically?
  Project = "project",
  User = "user",
  UserOnline = 'user:online',
  Organization = 'organization',
  UserInOrganization = 'userInOrganization',
  GuestInProject = 'guestInProject',
  userStatus = 'userStatus',

  List = "list",
  Task = "task",
  Tag = "tag",

  TaskPerson = 'taskPerson',
  TaskFollower = 'taskFollower',

  ProjectPeople = 'projectPeople',
  ProjectPerson = 'projectPerson',
  ProjectFollower = 'projectFollower',

  TaskList = 'taskList',
  TaskListFollower = 'taskListFollower',
  File = 'file',
  TaskTags = 'taskTags',
  TaskAttachments = 'taskAttachments',
  MessageAttachment = 'messageAttachment',
  Message = 'message',
  MessageReaction = 'messageReaction',
  MessageKeyPress = 'messageKeyPress',
  MessageRead = 'messageRead',
  ChecklistItem = 'checklistItem',
  ChecklistItemAssignee = 'checklistItemAssignee',
  Activity = 'activity',

  TaskChangedProps = 'taskChangedProps',
  ProjectChangedProps = 'projectChangedProps',
  ChatNotificationSettings = 'chatNotificationSettings',

  ExtensionInOrganization = 'extensionInOrganization',
  ExtensionCustomFieldValue = 'extensionCustomFieldValue',

  ExtensionDataTaskVotingReaction = 'extensionDataTaskVotingReaction',

  ExtensionDataTaskRecurrenceSettings = 'extensionDataTaskRecurrenceSettings',
  ExtensionDataTaskRecurrenceDependency = 'extensionDataTaskRecurrenceDependency',

  ConversationSettings = 'conversationSettings',

  SubscriptionInOrganization = 'subscriptionInOrganization',
  SubscriptionPlan = 'subscriptionPlan',
  SubscriptionPayment = 'subscriptionPayment',
  SubscriptionInvoice = 'subscriptionInvoice',
  SubscriptionCoupons = 'subscriptionCoupons',
  SubscriptionCancellationInOrganization = 'subscriptionCancellationInOrganization',
  Integration = 'integration',
  ExtensionApp = 'extensionApp',
  ExtensionUserInApp = 'extensionUserInApp',

  JobStatus = 'jobStatus',
  AppVersion = 'appVersion',

  PersonalProjectOrder = 'personalProjectOrder',
  PersonalProjectGroup = 'personalProjectGroup',
  ProjectInGroup = 'projectInGroup',
}

export enum EntityStatus {
  EXISTS = 'exists',
  DELETED = 'deleted',
  ARCHIVED = 'archived',
}

export enum Cookie {
  AUTH_TOKEN = "AUTH_TOKEN",
}

export enum OpenIdProviderCode {
  GOOGLE = 'google',
}

export enum UserRegistrationStatus {
  PENDING = 'pending',
  REGISTERED = 'registered',
  VERIFIED = 'verified',
  NOT_VERIFIED = 'not_verified'
}
