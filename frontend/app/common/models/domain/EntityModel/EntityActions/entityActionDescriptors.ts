import * as ProjectActions from '../../ProjectsModel/actions';
import * as OrganizationsModelActions from '../../OrganizationsModel/actions';
import * as ListsModelActions from '../../ListsModel/actions';
import * as TasksActions from '../../TasksModel/actions';
import * as ChecklistsActions from '../../ChecklistsModel/actions';
import * as UsersModelActions from '../../UsersModel/actions';
import * as MessagesActions from '../../MessagesModel/actions';
import * as ActivitiesActions from '../../ActivitiesModel/actions';
import * as TagsActions from '../../TagsModel/actions';
import * as FileActions from '../../FilesModel/actions';
import { EntityType, EntityActionDescriptor, EntityInterface } from '../../EntityModel/types';
import { EntityStatus } from '../../EntityModel/types';
import * as NotificationsModelActions from '../../NotificationsModel/actions';
import * as ExtensionsModelActions from '../../ExtensionsModel/actions';
import * as SubscriptionModelActions from '../../SubscriptionModel/actions';
import * as IntegrationsModelActions from '../../IntegrationsModel/actions';
import * as UserStatusActions from '../../UserStatusModel/actions';
import * as TaskRecurrenceActions from '../../TaskRecurrenceModel/actions';
import * as UserAppsActions from '../../UserAppsModel/actions';
import * as JobStatusActions from '../../JobStatusModel/actions';
import * as GuestsModelActions from '../../GuestsModel/actions';
import * as AppModelActions from '../../AppModel/actions';
import { UserEntityInterface } from 'models/domain/UsersModel/types';
import { UserInAppEntity } from 'models/domain/UserAppsModel/types';
import * as PersonalProjectStructureActions from 'models/domain/PersonalProjectStructureModel/actions';
import {
  ProjectInGroupInterface,
  UserProjectGroupInterface,
  UserProjectOrderInterface,
} from 'models/domain/PersonalProjectStructureModel/types';
import { AppVersionInterface } from 'models/domain/AppModel/types';
import { ActivityEntityInterface } from 'models/domain/ActivitiesModel/types';

const entityActionDescriptors: { [type in EntityType]?: EntityActionDescriptor } = {
  [EntityType.ORGANIZATION_DATA]: {
    create: (wrappedEntity: EntityInterface) => OrganizationsModelActions.onCreateOrganizationData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => OrganizationsModelActions.onUpdateOrganizationData(wrappedEntity.body),
  },
  [EntityType.USER_IN_ORGANIZATION]: {
    create: (wrappedEntity: EntityInterface) =>
      OrganizationsModelActions.onCreateUserInOrganizationData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) =>
      OrganizationsModelActions.onUpdateUserInOrganizationData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) =>
      OrganizationsModelActions.onDeleteUserInOrganizationData(wrappedEntity.body),
  },

  [EntityType.USER_DATA]: {
    create: (wrappedEntity: EntityInterface<UserEntityInterface>) => UsersModelActions.onCreateUserData(wrappedEntity),
    update: (wrappedEntity: EntityInterface<UserEntityInterface>) => UsersModelActions.onUpdateUserData(wrappedEntity),
  },
  [EntityType.PROJECT_DATA]: {
    create: (wrappedEntity: EntityInterface) => ProjectActions.onCreateProjectData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => ProjectActions.onUpdateProjectData(wrappedEntity.body),
  },
  [EntityType.PROJECT_PERSON]: {
    create: (wrappedEntity: EntityInterface) => ProjectActions.onAddProjectPerson(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => ProjectActions.onUpdateProjectPerson(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => ProjectActions.onRemoveProjectPerson(wrappedEntity),
  },
  [EntityType.PROJECT_PEOPLE]: {
    create: (wrappedEntity: EntityInterface) => ProjectActions.onUpdateProjectPeople(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => ProjectActions.onUpdateProjectPeople(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => ProjectActions.onUpdateProjectPeople(wrappedEntity),
  },
  [EntityType.PROJECT_FOLLOWER]: {
    create: (wrappedEntity: EntityInterface) => ProjectActions.onAddProjectFollower(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => ProjectActions.onRemoveProjectFollower(wrappedEntity),
  },
  [EntityType.GUEST_IN_PROJECT]: {
    create: (wrappedEntity: EntityInterface) => GuestsModelActions.onCreateGuestInProject(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => GuestsModelActions.onDeleteGuestInProject(wrappedEntity),
  },
  [EntityType.TASK_LIST]: {
    create: (wrappedEntity: EntityInterface) => ListsModelActions.onCreateListData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => ListsModelActions.onUpdateListData(wrappedEntity.body),
  },
  [EntityType.TASK_LIST_FOLLOWER]: {
    create: (wrappedEntity: EntityInterface) =>
      ListsModelActions.onAddUserToTaskListFollowersData(wrappedEntity.entityId, wrappedEntity.body.userId),
    delete: (wrappedEntity: EntityInterface) =>
      ListsModelActions.onRemoveUserFromTaskListFollowersData(wrappedEntity.entityId, wrappedEntity.body.userId),
  },
  [EntityType.TASK_DATA]: {
    create: (wrappedEntity: EntityInterface) => TasksActions.onCreateTaskData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => TasksActions.onUpdateTaskData(wrappedEntity),
  },
  [EntityType.TASK_PERSON]: {
    create: (wrappedEntity: EntityInterface) => TasksActions.onAddTaskPerson(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => TasksActions.onUpdateTaskPerson(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => TasksActions.onRemoveTaskPerson(wrappedEntity),
  },
  [EntityType.TASK_FOLLOWER]: {
    create: (wrappedEntity: EntityInterface) =>
      TasksActions.onAddTaskFollower(wrappedEntity.entityId, wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) =>
      TasksActions.onRemoveTaskFollower(wrappedEntity.entityId, wrappedEntity.body),
  },
  [EntityType.CHECKLIST_ITEM]: {
    create: (wrappedEntity: EntityInterface) =>
      ChecklistsActions.onAddItemToChecklistSuccess(wrappedEntity.body, wrappedEntity.body.taskId),
    update: (wrappedEntity: EntityInterface) =>
      ChecklistsActions.onUpdateChecklistItemData(wrappedEntity.body, wrappedEntity.body.taskId),
    delete: (wrappedEntity: EntityInterface) =>
      ChecklistsActions.onRemoveItemFromChecklistSuccess(wrappedEntity.body.id, wrappedEntity.body.taskId),
  },
  [EntityType.CHECKLIST_ITEM_ASSIGNEE]: {
    create: (wrappedEntity: EntityInterface) => ChecklistsActions.onCreateChecklistItemAssignee(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => ChecklistsActions.onDeleteChecklistItemAssignee(wrappedEntity),
  },
  [EntityType.MESSAGE_DATA]: {
    create: (wrappedEntity: EntityInterface) => MessagesActions.onCreateMessageData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => MessagesActions.onUpdateMessageData(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => MessagesActions.onRemoveMessageData(wrappedEntity),
  },
  [EntityType.MESSAGE_READ_DATA]: {
    update: (wrappedEntity: EntityInterface) => MessagesActions.onUpdateMessageReadData(wrappedEntity),
  },
  [EntityType.MESSAGE_KEYPRESS_DATA]: {
    create: (wrappedEntity: EntityInterface) => MessagesActions.onCreateMessageKeyPressData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => MessagesActions.onUpdateMessageKeyPressData(wrappedEntity),
  },
  [EntityType.MESSAGE_REACTION_DATA]: {
    create: (wrappedEntity: EntityInterface) => MessagesActions.onCreateMessageReactionData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => MessagesActions.onUpdateMessageReactionData(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => MessagesActions.onRemoveMessageReactionData(wrappedEntity),
  },
  [EntityType.ACTIVITY_DATA]: {
    create: (wrappedEntity: EntityInterface<ActivityEntityInterface>) =>
      ActivitiesActions.onCreateActivityData(wrappedEntity.entityId, wrappedEntity.body),
  },
  [EntityType.TAG_DATA]: {
    create: (wrappedEntity: EntityInterface) => TagsActions.onCreateTagData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => TagsActions.onUpdateTagData(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => TagsActions.onDeleteTagData(wrappedEntity),
  },
  [EntityType.USER_STATUS_DATA]: {
    create: (wrappedEntity: EntityInterface) => UserStatusActions.onCreateUserStatusData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => UserStatusActions.onUpdateUserStatusData(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => UserStatusActions.onDeleteUserStatusData(wrappedEntity),
  },
  [EntityType.FILE_DATA]: {
    create: (wrappedEntity: EntityInterface) => FileActions.onCreateFileData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => {
      const file = wrappedEntity.body;
      if (file.status === EntityStatus.DELETED) {
        return FileActions.onRemoveFileData(wrappedEntity.body);
      } else {
        return FileActions.onCreateFileData(wrappedEntity.body);
      }
    },
  },
  [EntityType.TASK_ATTACHMENTS_IDS]: {
    create: (wrappedEntity: EntityInterface) =>
      TasksActions.onCreateTaskAttachmentsIds(wrappedEntity.entityId, wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) =>
      TasksActions.onCreateTaskAttachmentsIds(wrappedEntity.entityId, wrappedEntity.body),
  },
  [EntityType.MESSAGE_ATTACHMENTS]: {
    create: (wrappedEntity: EntityInterface) =>
      MessagesActions.onCreateMessageAttachmentsIds(
        wrappedEntity.entityId,
        wrappedEntity.body.messageAttachments,
        wrappedEntity.body.containerId
      ),
  },
  [EntityType.TASK_TAGS]: {
    create: (wrappedEntity: EntityInterface) =>
      TagsActions.onCreateTagsByObjectId(wrappedEntity.entityId, wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) =>
      TagsActions.onUpdateTagsByObjectId(wrappedEntity.entityId, wrappedEntity.body),
  },
  [EntityType.TASK_CHANGED_PROPS]: {
    create: (wrappedEntity: EntityInterface) => TasksActions.onUpdateTaskData(wrappedEntity),
  },
  [EntityType.PROJECT_CHANGED_PROPS]: {
    create: (wrappedEntity: EntityInterface) => ProjectActions.onUpdateProjectData(wrappedEntity.body),
  },
  [EntityType.CHAT_NOTIFICATION_SETTINGS]: {
    create: (wrappedEntity: EntityInterface) =>
      NotificationsModelActions.onUpdateChatNotificationSettings(
        wrappedEntity.body.objectId,
        wrappedEntity.body.chatNotificationSettingsType
      ),
    update: (wrappedEntity: EntityInterface) =>
      NotificationsModelActions.onUpdateChatNotificationSettings(
        wrappedEntity.body.objectId,
        wrappedEntity.body.chatNotificationSettingsType
      ),
  },
  [EntityType.EXTENSION_IN_ORGANIZATION]: {
    create: (wrappedEntity: EntityInterface) =>
      ExtensionsModelActions.onUpdateExtensionInOrganizationData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) =>
      ExtensionsModelActions.onUpdateExtensionInOrganizationData(wrappedEntity),
  },
  [EntityType.EXTENSION_CUSTOM_FIELD_VALUE]: {
    create: (wrappedEntity: EntityInterface) => ExtensionsModelActions.onUpdateExtensionCustomFieldValue(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => ExtensionsModelActions.onUpdateExtensionCustomFieldValue(wrappedEntity),
  },
  [EntityType.EXTENSION_DATA_TASK_VOTING_REACTION]: {
    create: (wrappedEntity: EntityInterface) => TasksActions.onUpdateTaskReactionData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => TasksActions.onUpdateTaskReactionData(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => TasksActions.onRemoveTaskReactionData(wrappedEntity),
  },
  [EntityType.EXTENSION_DATA_List_CARDS_LIMIT]: {
    create: (wrappedEntity: EntityInterface) => ListsModelActions.onUpdateListCardsLimitData(wrappedEntity),
    update: (wrappedEntity: EntityInterface) => ListsModelActions.onUpdateListCardsLimitData(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => ListsModelActions.onRemoveListCardsLimitData(wrappedEntity),
  },
  [EntityType.SUBSCRIPTION_CANCELLATION_IN_ORGANIZATION]: {
    create: (wrappedEntity: EntityInterface) =>
      SubscriptionModelActions.onSetSubscriptionCancellationStatus(
        wrappedEntity.body.organizationId,
        wrappedEntity.body.status
      ),
    update: (wrappedEntity: EntityInterface) =>
      SubscriptionModelActions.onSetSubscriptionCancellationStatus(
        wrappedEntity.body.organizationId,
        wrappedEntity.body.status
      ),
    delete: (wrappedEntity: EntityInterface) =>
      SubscriptionModelActions.onRemoveSubscriptionCancellationStatus(wrappedEntity.body.organizationId),
  },
  [EntityType.SUBSCRIPTION_IN_ORGANIZATION]: {
    create: (wrappedEntity: EntityInterface) => SubscriptionModelActions.onCreateSubscriptionData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => SubscriptionModelActions.onUpdateSubscriptionData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) =>
      SubscriptionModelActions.onRemoveSubscriptionData(wrappedEntity.body.id, wrappedEntity.body.organizationId),
  },
  [EntityType.SUBSCRIPTION_PLAN]: {
    create: (wrappedEntity: EntityInterface) => SubscriptionModelActions.onCreatePlanData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => SubscriptionModelActions.onUpdatePlanData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) => SubscriptionModelActions.onRemovePlanData(wrappedEntity.body.id),
  },
  [EntityType.SUBSCRIPTION_INVOICE]: {
    create: (wrappedEntity: EntityInterface) => SubscriptionModelActions.onCreateInvoiceData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => SubscriptionModelActions.onUpdateInvoiceData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) => SubscriptionModelActions.onRemoveInvoiceData(wrappedEntity.body.id),
  },
  [EntityType.SUBSCRIPTION_COUPONS]: {
    create: (wrappedEntity: EntityInterface) =>
      SubscriptionModelActions.onUpdateSubscriptionCouponsData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) =>
      SubscriptionModelActions.onUpdateSubscriptionCouponsData(wrappedEntity.body),
  },
  [EntityType.CONVERSATION_SETTINGS]: {
    create: (wrappedEntity: EntityInterface) => ProjectActions.onCreateConversationVisibilityData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => ProjectActions.onCreateConversationVisibilityData(wrappedEntity.body),
  },
  [EntityType.INTEGRATION]: {
    create: (wrappedEntity: EntityInterface) => IntegrationsModelActions.onCreateIntegration(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => IntegrationsModelActions.onUpdateIntegration(wrappedEntity.body),
  },
  [EntityType.EXTENSION_DATA_TASK_RECURRENCE_SETTINGS]: {
    create: (wrappedEntity: EntityInterface) =>
      TaskRecurrenceActions.onUpdateTaskRecurrenceSettingsData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) =>
      TaskRecurrenceActions.onUpdateTaskRecurrenceSettingsData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) =>
      TaskRecurrenceActions.onDeleteTaskRecurrenceSettingsData(wrappedEntity.body),
  },
  [EntityType.EXTENSION_DATA_TASK_RECURRENCE_DEPENDENCY]: {
    create: (wrappedEntity: EntityInterface) =>
      TaskRecurrenceActions.onUpdateTaskRecurrenceDependencyData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface) =>
      TaskRecurrenceActions.onDeleteTaskRecurrenceDependencyData(wrappedEntity.body),
  },
  [EntityType.EXTENSION_APP]: {
    create: (wrappedEntity: EntityInterface) => UserAppsActions.onCreateUserAppData(wrappedEntity),
    delete: (wrappedEntity: EntityInterface) => UserAppsActions.onDeleteUserAppData(wrappedEntity),
  },
  [EntityType.EXTENSION_USER_IN_APP]: {
    create: (wrappedEntity: EntityInterface<UserInAppEntity>) => UserAppsActions.onCreateUserInApp(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface<UserInAppEntity>) => UserAppsActions.onDeleteUserInApp(wrappedEntity.body),
  },
  [EntityType.JOB_STATUS]: {
    create: (wrappedEntity: EntityInterface) => JobStatusActions.onUpdateJobStatusData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface) => JobStatusActions.onUpdateJobStatusData(wrappedEntity.body),
  },
  [EntityType.APP_VERSION]: {
    create: (wrappedEntity: EntityInterface<AppVersionInterface>) =>
      AppModelActions.onReceiveNewAppVersion(wrappedEntity),
  },
  [EntityType.PERSONAL_PROJECT_ORDER]: {
    create: (wrappedEntity: EntityInterface<UserProjectOrderInterface>) =>
      PersonalProjectStructureActions.onCreatePersonalProjectOrderData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface<UserProjectOrderInterface>) =>
      PersonalProjectStructureActions.onUpdatePersonalProjectOrderData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface<UserProjectOrderInterface>) =>
      PersonalProjectStructureActions.onDeletePersonalProjectOrderData(wrappedEntity.body.projectId),
  },
  [EntityType.PROJECT_IN_GROUP]: {
    create: (wrappedEntity: EntityInterface<ProjectInGroupInterface>) =>
      PersonalProjectStructureActions.onCreateProjectInGroupData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface<ProjectInGroupInterface>) =>
      PersonalProjectStructureActions.onUpdateProjectInGroupData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface<ProjectInGroupInterface>) =>
      PersonalProjectStructureActions.onDeleteProjectInGroupData(
        wrappedEntity.body.projectId,
        wrappedEntity.body.groupId
      ),
  },
  [EntityType.PERSONAL_PROJECT_GROUP]: {
    create: (wrappedEntity: EntityInterface<UserProjectGroupInterface>) =>
      PersonalProjectStructureActions.onCreateProjectGroupData(wrappedEntity.body),
    update: (wrappedEntity: EntityInterface<UserProjectGroupInterface>) =>
      PersonalProjectStructureActions.onUpdateProjectGroupData(wrappedEntity.body),
    delete: (wrappedEntity: EntityInterface<UserProjectGroupInterface>) =>
      PersonalProjectStructureActions.onDeleteProjectGroupData(wrappedEntity.entityId),
  },
  [EntityType.PROJECT_FILE]: {
    create: (wrappedEntity: EntityInterface) =>
      ProjectActions.onDebounceRefetchProjectFiles(wrappedEntity.body.projectId),
  },
};

export default entityActionDescriptors;
