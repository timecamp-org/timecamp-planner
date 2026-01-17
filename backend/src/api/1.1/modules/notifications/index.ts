import { ModuleLoaderType } from '../../../../ModuleLoaderType';
import { NotificationsModule } from './NotificationsModule';
import { NotificationServiceInterface } from './interfaces/NotificationServiceInterface';
import { NotificationService } from './NotificationService';
import { NotificationSettingsService } from './NotificationSettingsService';
import { NotificationSettingsServiceInterface } from './interfaces/NotificationSettingsServiceInterface';
import { EmailNotificationTransport } from './transport/EmailNotificationTransport';
import { NtfyNotificationTransport } from './transport/NtfyNotificationTransport';
import { NotificationRendererInterface } from './interfaces/NotificationRendererInterface';
import {
  NotificationContent,
  NotificationMethod,
  PushNotificationContent,
  NotificationQueueType,
  UserOrganizationNotificationsResourceQueryParams,
  UserOrganizationNotificationsResourceContext,
  UserOrganizationNotificationsResourceData,
} from './types'
import { RendererChain } from './renderer/RendererChain';
import { PostgresFeedPlugin } from '../feed/PostgresFeedPlugin';
import { NotificationContentProviderInterface } from './interfaces/NotificationContentProviderInterface';
import { EmailNotificationContentProvider } from './content/EmailNotificationContentProvider';
import { PushNotificationContentProvider } from './content/PushNotificationContentProvider';
import { NotificationDefinitions } from './NotificationDefinitions';
import { interfaces } from 'inversify';
import { FollowerService } from './FollowerService';
import { DueDateReminderCronJob } from './DueDateReminderCronJob';
import { NotificationFactoryInterface } from './interfaces/NotificationFactoryInterface';
import { NotificationFactory } from './NotificationFactory';
import NotificationListenerPlugin from './NotificationListenerPlugin';
import { NotificationTransportInterface } from './interfaces/NotificationTransportInterface';
import { injectedIntoService } from '../../../../infrastructure/InversifyUtils';
import { NotificationMethodMapper } from './NotificationMethodMapper';
import { NotificationPushDeviceProviderInterface } from './interfaces/NotificationPushDeviceProviderInterface';
import { NotificationPushDeviceProvider } from './providers/NotificationPushDeviceProvider';
import { EntityPermissionInterface } from '../permissions/interfaces/EntityPermissionInterface';
import { PermissionsModule } from '../permissions/PermissionsModule';
import { NotificationPermissions } from './NotificationPermissions';
import { PgNotificationHandlerInterface } from './interfaces/PgNotificationHandlerInterface';
import { TaskMessageInsertHandler } from './handlers/TaskMessageInsertHandler';
import { HailHandler } from './handlers/HailHandler';
import { MentionHandler } from './handlers/MentionHandler';
import { AddUserToProjectActivityHandler } from './handlers/activity/AddUserToProjectActivityHandler';
import { ActivityInsertNotificationHandler } from './handlers/ActivityInsertNotificationHandler';
import { RemoveUserFromProjectActivityHandler } from './handlers/activity/RemoveUserFromProjectActivityHandler';
import { AddUserToTaskActivityHandler } from './handlers/activity/AddUserToTaskActivityHandler';
import { RemoveUserFromTaskActivityHandler } from './handlers/activity/RemoveUserFromTaskActivityHandler';
import { AddUserToChecklistItemActivityHandler } from './handlers/activity/AddUserToChecklistItemActivityHandler';
import { RemoveUserFromChecklistItemActivityHandler } from './handlers/activity/RemoveUserFromChecklistItemActivityHandler';
import { ConversationMessageNotificationHandler } from './handlers/ConversationMessageNotificationHandler';
import { FileNotificationHandler } from './handlers/FileNotificationHandler';
import { AddFileToTaskActivityHandler } from './handlers/activity/AddFileToTaskActivityHandler';
import { ModifyProjectNotificationHandler } from './handlers/activity/ModifyProjectNotificationHandler';
import { ModifyTaskNotificationHandler } from './handlers/activity/ModifyTaskNotificationHandler';
import { CreateTaskNotificationHandler } from './handlers/activity/CreateTaskNotificationHandler';
import { CreateListNotificationHandler } from './handlers/activity/CreateListNotificationHandler';
import { ModifyListNotificationHandler } from './handlers/activity/ModifyListNotificationHandler';
import { QueueDescriptorInterface } from '../messageQueue/interfaces/QueueDescriptorInterface';
import { QueueDescriptor } from '../messageQueue/QueueDescriptor';
import { NotificationsJobFactory } from './NotificationsJobFactory';
import { NotificationsWorker } from './workers/NotificationsWorker';
import { NotificationsSubWorkerInterface } from './interfaces/NotificationsSubWorkerInterface';
import { ArchiveNotificationsWorker } from './workers/ArchiveNotificationsWorker';
import { MessageQueueModule } from '../messageQueue/MessageQueueModule';
import { WorkerOptionsInterface } from '../messageQueue/types';
import { FeedModule } from '../feed/FeedModule';
import { FeedServicePluginInterface } from '../feed/interfaces/FeedServicePluginInterface';
import { UserOrganizationNotificationsProvider } from './providers/UserOrganizationNotificationsProvider'
import { ResourceInterface } from '../../../../infrastructure/resources/ResourceInterface'
import { UserOrganizationNotificationsResource } from './resources/UserOrganizationNotificationsResource'
import { UserDisplayedNotificationsProvider } from './providers/UserDisplayedNotificationsProvider'
import { DictProviderInterface } from '../dict/interfaces/DictProviderInterface'
import { NotificationCenterType } from '../dict/types'
import { ConnectionInterface } from '../db/ConnectionInterface'
import { DbModule } from '../db/DbModule'
import { DictProvider } from '../dict/DictProvider'
import Table from '../db/Table'
import { NotificationsProviderInterface } from './interfaces/NotificationsProviderInterface';
import { NotificationsProvider } from './providers/NotificationsProvider';

export const notificationsModule: ModuleLoaderType = kernel => {
  kernel.bind<NotificationServiceInterface>(NotificationsModule.NotificationServiceInterface).to(NotificationService).inSingletonScope();
  kernel.bind<NotificationFactoryInterface>(NotificationsModule.NotificationFactoryInterface)
    .to(NotificationFactory)
  ;

  kernel.bind<NotificationSettingsServiceInterface>(NotificationsModule.NotificationSettingsServiceInterface).to(NotificationSettingsService);
  kernel.bind<NotificationPushDeviceProviderInterface>(NotificationsModule.NotificationPushDeviceProviderInterface).to(NotificationPushDeviceProvider);

  kernel
    .bind<NtfyNotificationTransport>(NotificationsModule.MobilePushNotificationTransport)
    .to(NtfyNotificationTransport);

  kernel
    .bind<NtfyNotificationTransport>(NotificationsModule.PushNotificationTransport)
    .to(NtfyNotificationTransport);
  kernel.bind<NotificationTransportInterface>(NotificationsModule.NotificationTransportInterface).to(EmailNotificationTransport);

  kernel.bind<NotificationTransportInterface>(NotificationsModule.NotificationTransportInterface)
    .toService(NotificationsModule.MobilePushNotificationTransport);
  kernel.bind<NotificationTransportInterface>(NotificationsModule.NotificationTransportInterface)
    .toService(NotificationsModule.PushNotificationTransport);

  kernel.bind<NotificationMethod>(NotificationsModule.NotificationMethod)
    .toConstantValue(NotificationMethod.PUSH)
    .when(injectedIntoService(NotificationsModule.PushNotificationTransport));

  kernel.bind<NotificationMethod>(NotificationsModule.NotificationMethod)
    .toConstantValue(NotificationMethod.MOBILE)
    .when(injectedIntoService(NotificationsModule.MobilePushNotificationTransport));

  kernel.bind<NotificationContentProviderInterface<NotificationContent>>(NotificationsModule.NotificationContentProviderInterface)
    .to(EmailNotificationContentProvider)
    .whenTargetNamed('EmailNotificationContentProvider')

  kernel.bind<NotificationContentProviderInterface<PushNotificationContent>>(NotificationsModule.NotificationContentProviderInterface)
    .to(PushNotificationContentProvider)
    .whenTargetNamed('PushNotificationContentProvider')

  kernel.bind<NotificationRendererInterface<PushNotificationContent>>(NotificationsModule.NotificationRendererInterface)
    .to(RendererChain)
    .whenInjectedInto(PostgresFeedPlugin)
    .onActivation(bindNotificationDefinitions('PushNotificationContentProvider'))
  kernel.bind<NotificationRendererInterface<PushNotificationContent>>(NotificationsModule.NotificationRendererInterface)
    .to(RendererChain)
    .whenInjectedInto(NtfyNotificationTransport)
    .onActivation(bindNotificationDefinitions('PushNotificationContentProvider'))
  ;
  kernel.bind<NotificationRendererInterface<NotificationContent>>(NotificationsModule.NotificationRendererInterface)
    .to(RendererChain)
    .whenInjectedInto(EmailNotificationTransport)
    .onActivation(bindNotificationDefinitions('EmailNotificationContentProvider'))


  kernel.bind<NotificationListenerPlugin>(NotificationsModule.NotificationListener)
    .to(NotificationListenerPlugin)
  ;
  kernel.bind(NotificationsModule.NotificationServiceOptions).toConstantValue({});

  kernel.bind(NotificationsModule.FollowerServiceInterface).to(FollowerService);
  kernel.bind(NotificationsModule.DueDateReminderCronJob).to(DueDateReminderCronJob);

  // Message Queue
  kernel.bind<QueueDescriptorInterface>(NotificationsModule.NotificationsQueue)
    .toDynamicValue(() => new QueueDescriptor(NotificationQueueType.NOTIFICATIONS, { durable: true }))

  kernel.bind(NotificationsModule.NotificationsJobFactoryInterface)
    .to(NotificationsJobFactory)

  kernel.bind(NotificationsModule.NotificationsWorker)
    .to(NotificationsWorker)

  kernel
    .bind<WorkerOptionsInterface>(MessageQueueModule.WorkerOptionsInterface)
    .toConstantValue({ maxConcurrentJobs: 5 })
    .whenTargetNamed('NotificationsWorker')

  kernel.bind<NotificationsSubWorkerInterface>(NotificationsModule.NotificationsSubWorker)
    .to(ArchiveNotificationsWorker)

  

  kernel.bind<FeedServicePluginInterface>(FeedModule.FeedServicePluginInterface)
    .toService(NotificationsModule.NotificationListener);

  kernel.bind(NotificationsModule.NotificationMethodMapper)
    .to(NotificationMethodMapper);

  kernel.bind<EntityPermissionInterface>(PermissionsModule.EntityPermissionInterface)
    .to(NotificationPermissions);

  // This could be bound in sepearate modules (eg. message handlers in messages module etc.
  kernel.bind<PgNotificationHandlerInterface>(NotificationsModule.PgNotificationHandler).to(TaskMessageInsertHandler);
  kernel.bind<PgNotificationHandlerInterface>(NotificationsModule.PgNotificationHandler).to(HailHandler);
  kernel.bind<PgNotificationHandlerInterface>(NotificationsModule.PgNotificationHandler).to(MentionHandler);
  kernel.bind<PgNotificationHandlerInterface>(NotificationsModule.PgNotificationHandler).to(ConversationMessageNotificationHandler);
  kernel.bind<PgNotificationHandlerInterface>(NotificationsModule.PgNotificationHandler).to(FileNotificationHandler);
  kernel.bind<PgNotificationHandlerInterface>(NotificationsModule.PgNotificationHandler).to(ActivityInsertNotificationHandler);

  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(AddUserToProjectActivityHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(RemoveUserFromProjectActivityHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(AddUserToTaskActivityHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(RemoveUserFromTaskActivityHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(AddUserToChecklistItemActivityHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(RemoveUserFromChecklistItemActivityHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(AddFileToTaskActivityHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(ModifyProjectNotificationHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(ModifyTaskNotificationHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(CreateTaskNotificationHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(CreateListNotificationHandler);
  kernel.bind(NotificationsModule.PgActivityNotificationHandler).to(ModifyListNotificationHandler);

  kernel.bind(NotificationsModule.UserOrganizationNotificationsProviderInterface).to(UserOrganizationNotificationsProvider);
  kernel.bind<ResourceInterface<
    UserOrganizationNotificationsResourceQueryParams,
    UserOrganizationNotificationsResourceContext,
    UserOrganizationNotificationsResourceData
    >>(NotificationsModule.UserOrganizationNotificationsResource)
    .to(UserOrganizationNotificationsResource)

  kernel.bind(NotificationsModule.UserDisplayedNotificationsProviderInterface)
    .to(UserDisplayedNotificationsProvider)

  kernel.bind<DictProviderInterface<NotificationCenterType>>(NotificationsModule.DictNotificationCenterType)
    .toDynamicValue((ctx: interfaces.Context) => {
      const connection = ctx.container.get<ConnectionInterface>(DbModule.ConnectionInterface);
      return new DictProvider(connection, Table.DICT_NOTIFICATION_CENTER_TYPE)
    })

  kernel.bind<NotificationsProviderInterface>(NotificationsModule.NotificationsProviderInterface)
    .to(NotificationsProvider)

}

function bindNotificationDefinitions(provider) {
  return (ctx: interfaces.Context, rendererChain) => {
    const contentProvider = ctx.container
      .getNamed<NotificationContentProviderInterface<NotificationContent>>(NotificationsModule.NotificationContentProviderInterface, provider)
    NotificationDefinitions.addDefinitions(rendererChain, contentProvider);
    return rendererChain
  }
}
